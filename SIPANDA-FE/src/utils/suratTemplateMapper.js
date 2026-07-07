import { formatDateOnly, parseDateValue } from "./dateHelpers";
import { getTemplateKey } from "./suratTemplateRegistry";

function safeText(value) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatDateWithDayIndonesia(value) {
  const date = parseDateValue(value);
  if (!date) return "-";
  const dayName = DAY_NAMES[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

function formatTimeOnly(value) {
  const date = parseDateValue(value);
  if (!date) return "-";
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function formatRupiah(value) {
  const amount = Number(value || 0);
  if (amount <= 0) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getParentPengajuan(pengajuan, pengajuanData = []) {
  if (!pengajuan?.parent_id) return null;
  return (
    pengajuanData.find(
      (item) => String(item.id) === String(pengajuan.parent_id),
    ) || null
  );
}

function getAncestorPengajuanByTahap(pengajuan, pengajuanData = [], tahap) {
  const targetTahap = String(tahap || "").toUpperCase();
  let current = pengajuan;
  while (current?.parent_id) {
    const parent = getParentPengajuan(current, pengajuanData);
    if (!parent) return null;
    if (String(parent.tahap || "").toUpperCase() === targetTahap) {
      return parent;
    }
    current = parent;
  }
  return null;
}

function getTugasAncestorPengajuan(pengajuan, pengajuanData = []) {
  return getAncestorPengajuanByTahap(pengajuan, pengajuanData, "TUGAS");
}

function getKemajuanAncestorPengajuan(pengajuan, pengajuanData = []) {
  return getAncestorPengajuanByTahap(pengajuan, pengajuanData, "KEMAJUAN");
}

function findKetuaLppm(usersData = []) {
  return (
    usersData.find((user) => {
      const jabatan = String(user.jabatan || "").trim().toUpperCase();
      return jabatan === "KETUA_LPPM" || jabatan === "KETUA LPPM";
    }) || null
  );
}

function findDekanByFakultas(fakultas, usersData = []) {
  const normalizedFakultas = String(fakultas || "").trim().toUpperCase();
  return (
    usersData.find((user) => {
      const jabatan = String(user.jabatan || "").trim().toUpperCase();
      const userFakultas = String(user.fakultas || "").trim().toUpperCase();
      return jabatan === "DEKAN" && userFakultas === normalizedFakultas;
    }) || null
  );
}

function buildCommonKetuaLppmFields(usersData = []) {
  const ketuaLppm = findKetuaLppm(usersData);
  return {
    nama_ketua_lppm: safeText(ketuaLppm?.nama),
    nidn_ketua_lppm: safeText(ketuaLppm?.nidn),
  };
}

function getSuratTugasPkmPelaksanaanLabel(jenisPkm) {
  const normalized = String(jenisPkm || "").trim().toUpperCase();
  if (normalized === "PEMBICARA") return "Pembicara/Nara Sumber";
  if (normalized === "LAINNYA") return "Lain-Lain";
  return "-";
}

function buildDosenKelompokFields(pengajuan) {
  const pemohon = pengajuan?.pemohon || {};
  const anggota = Array.isArray(pengajuan?.anggota) ? pengajuan.anggota : [];
  const daftarDosen = [pemohon, ...anggota].filter(
    (item) => item && (item.nama || item.nidn),
  );
  return {
    daftar_dosen: daftarDosen.map((item, index) => ({
      nomor: index + 1,
      nama_dosen: safeText(item.nama),
      nidn: safeText(item.nidn),
    })),
  };
}

function getResearchTitle(detail = {}, fallbackDetail = {}) {
  return safeText(
    detail.judul_penelitian ||
      detail.judul_proposal ||
      fallbackDetail.judul_penelitian ||
      fallbackDetail.judul_proposal,
  );
}

function getPkmTitle(detail = {}, fallbackDetail = {}) {
  return safeText(
    detail.judul_pkm ||
      detail.judul_materi ||
      fallbackDetail.judul_pkm ||
      fallbackDetail.judul_materi,
  );
}

function getVolumeNomor(detail = {}) {
  return {
    volume: safeText(detail.volume),
    nomor: safeText(detail.nomor),
  };
}

function getTanggalSuratTugasValue(detail = {}, tugasPengajuan = null) {
  return formatDateOnly(tugasPengajuan?.tanggal_surat || detail.tanggal_mulai);
}

function buildBaseIdentityPayload(pengajuan, nomorSurat) {
  const pemohon = pengajuan?.pemohon || {};
  return {
    nomor_surat: safeText(nomorSurat),
    nama_dosen: safeText(pemohon.nama),
    nidn: safeText(pemohon.nidn),
  };
}

function buildBaseKelompokPayload(pengajuan, nomorSurat) {
  return {
    nomor_surat: safeText(nomorSurat),
    ...buildDosenKelompokFields(pengajuan),
  };
}

function buildTugasPenelitianIndividuPayload({
  pengajuan,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    bidang_ilmu: safeText(detail.bidang_ilmu),
    judul_proposal: safeText(detail.judul_proposal),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildTugasPenelitianKelompokPayload(params) {
  const base = buildTugasPenelitianIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    bidang_ilmu: base.bidang_ilmu,
    judul_proposal: base.judul_proposal,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildKemajuanPenelitianIndividuPayload({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  const tugasPengajuan = getTugasAncestorPengajuan(pengajuan, pengajuanData);
  const tugasDetail = tugasPengajuan?.detail || {};
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    bidang_ilmu: safeText(detail.bidang_ilmu || tugasDetail.bidang_ilmu),
    judul_penelitian: getResearchTitle(detail, tugasDetail),
    no_surat_tugas: safeText(
      detail.no_surat_tugas || tugasPengajuan?.nomor_surat,
    ),
    tanggal_surat_tugas: safeText(
      formatDateOnly(
        detail.tanggal_surat_tugas || tugasPengajuan?.tanggal_surat,
      ),
    ),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildKemajuanPenelitianKelompokPayload(params) {
  const base = buildKemajuanPenelitianIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    judul_penelitian: base.judul_penelitian,
    no_surat_tugas: base.no_surat_tugas,
    tanggal_surat_tugas: base.tanggal_surat_tugas,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildKemajuanPkmIndividuPayload({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  const tugasPengajuan = getTugasAncestorPengajuan(pengajuan, pengajuanData);
  const tugasDetail = tugasPengajuan?.detail || {};
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    bidang_ilmu: safeText(detail.bidang_ilmu || tugasDetail.bidang_ilmu),
    judul_pkm: getPkmTitle(detail, tugasDetail),
    no_surat_tugas: safeText(
      detail.no_surat_tugas || tugasPengajuan?.nomor_surat,
    ),
    tanggal_surat_tugas: safeText(
      formatDateOnly(
        detail.tanggal_surat_tugas || tugasPengajuan?.tanggal_surat,
      ),
    ),
    tempat_pkm: safeText(detail.tempat_pkm || tugasDetail.tempat_pelaksanaan),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildKemajuanPkmKelompokPayload(params) {
  const base = buildKemajuanPkmIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    judul_pkm: base.judul_pkm,
    no_surat_tugas: base.no_surat_tugas,
    tanggal_surat_tugas: base.tanggal_surat_tugas,
    tempat_pkm: base.tempat_pkm,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildPengesahanPenelitianIndividuPayload({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  const tugasPengajuan = getTugasAncestorPengajuan(pengajuan, pengajuanData);
  const kemajuanPengajuan = getKemajuanAncestorPengajuan(
    pengajuan,
    pengajuanData,
  );
  const tugasDetail = tugasPengajuan?.detail || {};
  const kemajuanDetail = kemajuanPengajuan?.detail || {};
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    bidang_ilmu: safeText(
      detail.bidang_ilmu ||
        kemajuanDetail.bidang_ilmu ||
        tugasDetail.bidang_ilmu,
    ),
    judul_penelitian: getResearchTitle(detail, kemajuanDetail || tugasDetail),
    no_surat_tugas: safeText(
      detail.no_surat_tugas || tugasPengajuan?.nomor_surat,
    ),
    tanggal_mulai: safeText(formatDateOnly(detail.tanggal_mulai)),
    tanggal_selesai: safeText(formatDateOnly(detail.tanggal_selesai)),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildPengesahanPenelitianKelompokPayload(params) {
  const base = buildPengesahanPenelitianIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    judul_penelitian: base.judul_penelitian,
    no_surat_tugas: base.no_surat_tugas,
    tanggal_mulai: base.tanggal_mulai,
    tanggal_selesai: base.tanggal_selesai,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildPengesahanPkmIndividuPayload({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  const tugasPengajuan = getTugasAncestorPengajuan(pengajuan, pengajuanData);
  const tugasDetail = tugasPengajuan?.detail || {};
  const pemohon = pengajuan?.pemohon || {};
  const dekan = findDekanByFakultas(pemohon.fakultas, usersData);
  return {
    nomor_surat: safeText(nomorSurat),
    judul_pkm: getPkmTitle(detail, tugasDetail),
    bidang_ilmu: safeText(detail.bidang_ilmu || tugasDetail.bidang_ilmu),
    nama_dosen: safeText(pemohon.nama),
    tempat_pelaksanaan: safeText(
      detail.tempat_pelaksanaan || tugasDetail.tempat_pelaksanaan,
    ),
    waktu_pelaksanaan: safeText(
      formatDateOnly(detail.waktu_pelaksanaan || tugasDetail.waktu_pelaksanaan),
    ),
    besar_dana: safeText(formatRupiah(tugasDetail.besar_dana)),
    sumber_dana: safeText(tugasDetail.sumber_dana),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    nama_dekan_fakultas: safeText(dekan?.nama),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildPengesahanPkmKelompokPayload(params) {
  const base = buildPengesahanPkmIndividuPayload(params);
  const pemohon = params.pengajuan?.pemohon || {};
  return {
    nomor_surat: base.nomor_surat,
    nama_dosen: safeText(pemohon.nama),
    ...buildDosenKelompokFields(params.pengajuan),
    judul_pkm: base.judul_pkm,
    bidang_ilmu: base.bidang_ilmu,
    tempat_pelaksanaan: base.tempat_pelaksanaan,
    waktu_pelaksanaan: base.waktu_pelaksanaan,
    besar_dana: base.besar_dana,
    sumber_dana: base.sumber_dana,
    tanggal_surat: base.tanggal_surat,
    nama_dekan_fakultas: base.nama_dekan_fakultas,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildPengesahanArtikelIndividuPayload({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  const tugasPengajuan = getTugasAncestorPengajuan(pengajuan, pengajuanData);
  const { volume, nomor } = getVolumeNomor(detail);
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    judul_artikel: safeText(detail.judul_artikel),
    nama_jurnal: safeText(detail.nama_jurnal),
    volume,
    nomor,
    doi: safeText(detail.doi),
    tanggal_terbit: safeText(formatDateOnly(detail.tanggal_terbit)),
    no_surat_tugas: safeText(
      detail.no_surat_tugas || tugasPengajuan?.nomor_surat,
    ),
    tanggal_surat_tugas: safeText(
      getTanggalSuratTugasValue(detail, tugasPengajuan),
    ),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildPengesahanArtikelKelompokPayload(params) {
  const base = buildPengesahanArtikelIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    judul_artikel: base.judul_artikel,
    nama_jurnal: base.nama_jurnal,
    volume: base.volume,
    nomor: base.nomor,
    doi: base.doi,
    tanggal_terbit: base.tanggal_terbit,
    no_surat_tugas: base.no_surat_tugas,
    tanggal_surat_tugas: base.tanggal_surat_tugas,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildPengesahanBukuIndividuPayload({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  const tugasPengajuan = getTugasAncestorPengajuan(pengajuan, pengajuanData);
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    judul_book_chapter: safeText(detail.judul_book_chapter),
    judul_buku: safeText(detail.judul_buku),
    halaman: safeText(detail.halaman),
    isbn: safeText(detail.isbn),
    tanggal_terbit: safeText(formatDateOnly(detail.tanggal_terbit)),
    no_surat_tugas: safeText(
      detail.no_surat_tugas || tugasPengajuan?.nomor_surat,
    ),
    tanggal_surat_tugas: safeText(
      getTanggalSuratTugasValue(detail, tugasPengajuan),
    ),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildPengesahanBukuKelompokPayload(params) {
  const base = buildPengesahanBukuIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    judul_book_chapter: base.judul_book_chapter,
    judul_buku: base.judul_buku,
    halaman: base.halaman,
    isbn: base.isbn,
    tanggal_terbit: base.tanggal_terbit,
    no_surat_tugas: base.no_surat_tugas,
    tanggal_surat_tugas: base.tanggal_surat_tugas,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildTugasArtikelIndividuPayload({
  pengajuan,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    judul_karya: safeText(detail.judul_karya),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildTugasArtikelKelompokPayload(params) {
  const base = buildTugasArtikelIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    judul_karya: base.judul_karya,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildTugasBukuIndividuPayload({
  pengajuan,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildBaseIdentityPayload(pengajuan, nomorSurat),
    judul_karya: safeText(detail.judul_karya),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildTugasBukuKelompokPayload(params) {
  const base = buildTugasBukuIndividuPayload(params);
  return {
    ...buildBaseKelompokPayload(params.pengajuan, params.nomorSurat),
    judul_karya: base.judul_karya,
    tanggal_surat: base.tanggal_surat,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

function buildTugasPkmIndividuPayload({
  pengajuan,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const detail = pengajuan?.detail || {};
  const pemohon = pengajuan?.pemohon || {};
  return {
    nomor_surat: safeText(nomorSurat),
    nama_institusi_pemohon: safeText(detail.nama_institusi_pemohon),
    no_surat_permohonan: safeText(detail.no_surat_permohonan),
    tanggal_surat_permohonan: safeText(
      formatDateOnly(detail.tanggal_surat_permohonan),
    ),
    nama_dosen: safeText(pemohon.nama),
    nidn: safeText(pemohon.nidn),
    pelaksanaan: getSuratTugasPkmPelaksanaanLabel(detail.jenis_pkm),
    judul_pelaksanaan: safeText(detail.judul_pkm || detail.judul_materi),
    tempat_pelaksanaan: safeText(detail.tempat_pelaksanaan),
    tanggal_pelaksanaan: safeText(
      formatDateWithDayIndonesia(detail.waktu_pelaksanaan),
    ),
    jam_pelaksanaan: safeText(formatTimeOnly(detail.waktu_pelaksanaan)),
    sumber_dana: safeText(detail.sumber_dana),
    besar_dana: safeText(formatRupiah(detail.besar_dana)),
    tanggal_surat: safeText(formatDateOnly(tanggalSurat)),
    nama_fakultas: safeText(pemohon.fakultas),
    ...buildCommonKetuaLppmFields(usersData),
  };
}

function buildTugasPkmKelompokPayload(params) {
  const base = buildTugasPkmIndividuPayload(params);
  return {
    nomor_surat: base.nomor_surat,
    nama_institusi_pemohon: base.nama_institusi_pemohon,
    no_surat_permohonan: base.no_surat_permohonan,
    tanggal_surat_permohonan: base.tanggal_surat_permohonan,
    ...buildDosenKelompokFields(params.pengajuan),
    pelaksanaan: base.pelaksanaan,
    judul_pelaksanaan: base.judul_pelaksanaan,
    tempat_pelaksanaan: base.tempat_pelaksanaan,
    tanggal_pelaksanaan: base.tanggal_pelaksanaan,
    jam_pelaksanaan: base.jam_pelaksanaan,
    sumber_dana: base.sumber_dana,
    besar_dana: base.besar_dana,
    tanggal_surat: base.tanggal_surat,
    nama_fakultas: base.nama_fakultas,
    nama_ketua_lppm: base.nama_ketua_lppm,
    nidn_ketua_lppm: base.nidn_ketua_lppm,
  };
}

const TEMPLATE_BUILDERS = {
  "tugas-penelitian-individu": buildTugasPenelitianIndividuPayload,
  "tugas-penelitian-kelompok": buildTugasPenelitianKelompokPayload,
  "kemajuan-penelitian-individu": buildKemajuanPenelitianIndividuPayload,
  "kemajuan-penelitian-kelompok": buildKemajuanPenelitianKelompokPayload,
  "kemajuan-pkm-individu": buildKemajuanPkmIndividuPayload,
  "kemajuan-pkm-kelompok": buildKemajuanPkmKelompokPayload,
  "pengesahan-penelitian-individu": buildPengesahanPenelitianIndividuPayload,
  "pengesahan-penelitian-kelompok": buildPengesahanPenelitianKelompokPayload,
  "pengesahan-pkm-individu": buildPengesahanPkmIndividuPayload,
  "pengesahan-pkm-kelompok": buildPengesahanPkmKelompokPayload,
  "pengesahan-artikel-individu": buildPengesahanArtikelIndividuPayload,
  "pengesahan-artikel-kelompok": buildPengesahanArtikelKelompokPayload,
  "pengesahan-buku-individu": buildPengesahanBukuIndividuPayload,
  "pengesahan-buku-kelompok": buildPengesahanBukuKelompokPayload,
  "tugas-artikel-individu": buildTugasArtikelIndividuPayload,
  "tugas-artikel-kelompok": buildTugasArtikelKelompokPayload,
  "tugas-buku-individu": buildTugasBukuIndividuPayload,
  "tugas-buku-kelompok": buildTugasBukuKelompokPayload,
  "tugas-pkm-individu": buildTugasPkmIndividuPayload,
  "tugas-pkm-kelompok": buildTugasPkmKelompokPayload,
};

export function buildSuratTemplatePayload({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const templateKey = getTemplateKey(pengajuan);
  const builder = TEMPLATE_BUILDERS[templateKey];
  if (!builder) {
    return null;
  }
  return builder({
    pengajuan,
    pengajuanData,
    usersData,
    nomorSurat,
    tanggalSurat,
  });
}