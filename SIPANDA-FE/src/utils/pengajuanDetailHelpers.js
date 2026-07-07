import {
  formatDateOnly,
  formatDateTime,
  getNowSqlDateTime,
} from "./dateHelpers";

import {
  getCakupanJurnalLabel,
  getJenisPkmLabel,
  getPengajuanStatus,
  getPeringkatJurnalLabel,
} from "./pengajuanHelpers";

function isFilled(value) {
  return value !== null && value !== undefined && value !== "";
}

function formatRupiah(value) {
  if (!isFilled(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildFields(detail, config) {
  return config.map((item) => {
    const value =
      typeof item.getValue === "function"
        ? item.getValue(detail)
        : item.format
          ? item.format(detail[item.key], detail)
          : detail[item.key];
    return {
      label: item.label,
      value: isFilled(value) ? value : "-",
      isLink: Boolean(item.isLink) && isFilled(value),
    };
  });
}

function normalizeJenisPkm(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function isJenisPkmPembicara(detail = {}) {
  return normalizeJenisPkm(detail.jenis_pkm) === "PEMBICARA";
}

function getJudulPkmValue(detail = {}) {
  if (isFilled(detail.judul_pkm)) return detail.judul_pkm;
  if (isJenisPkmPembicara(detail) && isFilled(detail.judul_materi)) {
    return detail.judul_materi;
  }
  return "";
}

function getTugasPenelitianFields() {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    {
      key: "judul_proposal",
      label: "Judul Proposal Penelitian yang Sudah Disetujui",
    },
  ];
}

function getTugasPublikasiFields(pengajuan) {
  const isBuku = pengajuan?.kategori === "BUKU";
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    {
      key: "judul_karya",
      label: isBuku ? "Judul Buku" : "Judul Artikel/Jurnal Ilmiah",
    },
    {
      key: "tanggal_mulai",
      label: isBuku ? "Tanggal Mulai Menulis Buku" : "Tanggal Mulai Menulis",
      format: formatDateOnly,
    },
  ];
}

function getTugasPkmFields(detail = {}) {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    { key: "nama_institusi_pemohon", label: "Nama Institusi Pemohon" },
    { key: "no_surat_permohonan", label: "No Surat Permohonan" },
    {
      key: "tanggal_surat_permohonan",
      label: "Tanggal Surat Permohonan",
      format: formatDateOnly,
    },
    {
      key: "jenis_pkm",
      label: "Jenis PKM",
      format: getJenisPkmLabel,
    },
    {
      key: "judul_pkm",
      label: "Judul PKM",
      getValue: getJudulPkmValue,
    },
    ...(isJenisPkmPembicara(detail)
      ? [{ key: "judul_materi", label: "Judul Materi yang Disampaikan" }]
      : []),
    {
      key: "tempat_pelaksanaan",
      label: isJenisPkmPembicara(detail)
        ? "Tempat Pelaksanaan PKM"
        : "Tempat PKM",
    },
    {
      key: "waktu_pelaksanaan",
      label: "Waktu Pelaksanaan PKM",
      format: formatDateTime,
    },
    { key: "sumber_dana", label: "Sumber Dana PKM" },
    {
      key: "besar_dana",
      label: "Besar Dana PKM",
      format: formatRupiah,
    },
  ];
}

function getKemajuanPenelitianFields() {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    { key: "judul_penelitian", label: "Judul Penelitian" },
    { key: "no_surat_tugas", label: "No Surat Tugas Penelitian" },
    {
      key: "tanggal_surat_tugas",
      label: "Tanggal Surat Tugas Penelitian",
      format: formatDateOnly,
    },
  ];
}

function getKemajuanPkmFields() {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    {
      key: "judul_pkm",
      label: "Judul PKM",
      getValue: getJudulPkmValue,
    },
    { key: "no_surat_tugas", label: "No Surat Tugas PKM" },
    {
      key: "tanggal_surat_tugas",
      label: "Tanggal Surat Tugas PKM",
      format: formatDateOnly,
    },
    { key: "tempat_pkm", label: "Tempat PKM" },
  ];
}

function getPengesahanPenelitianFields() {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    { key: "judul_penelitian", label: "Judul Penelitian" },
    { key: "no_surat_tugas", label: "No Surat Tugas" },
    {
      key: "tanggal_mulai",
      label: "Tanggal Mulai/Tanggal Surat Tugas",
      format: formatDateOnly,
    },
    {
      key: "tanggal_selesai",
      label: "Tanggal Selesai",
      format: formatDateOnly,
    },
  ];
}

function getPengesahanArtikelFields() {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    {
      key: "tanggal_mulai",
      label: "Tanggal Mulai Menulis Artikel",
      format: formatDateOnly,
    },
    { key: "no_surat_tugas", label: "No Surat Tugas" },
    { key: "judul_artikel", label: "Judul Artikel/Jurnal Ilmiah" },
    { key: "nama_jurnal", label: "Nama Jurnal" },
    {
      key: "cakupan_jurnal",
      label: "Cakupan Jurnal/Prosiding",
      format: getCakupanJurnalLabel,
    },
    {
      key: "peringkat_jurnal",
      label: "Indeks/Peringkat",
      format: getPeringkatJurnalLabel,
    },
    { key: "volume", label: "Volume Jurnal" },
    { key: "nomor", label: "Nomor Jurnal" },
    { key: "doi", label: "DOI" },
    {
      key: "tanggal_terbit",
      label: "Tanggal Terbit Artikel",
      format: formatDateOnly,
    },
    { key: "penerbit", label: "Penerbit Jurnal" },
    {
      key: "link_artikel",
      label: "Link Jurnal/Artikel",
      isLink: true,
    },
  ];
}

function getPengesahanBukuFields() {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    {
      key: "tanggal_mulai",
      label: "Tanggal Mulai Menulis Buku",
      format: formatDateOnly,
    },
    { key: "no_surat_tugas", label: "No Surat Tugas" },
    { key: "judul_book_chapter", label: "Judul Book Chapter" },
    { key: "judul_buku", label: "Judul Buku" },
    { key: "halaman", label: "Halaman" },
    { key: "isbn", label: "ISBN" },
    {
      key: "tanggal_terbit",
      label: "Tanggal Terbit Buku",
      format: formatDateOnly,
    },
    { key: "penerbit", label: "Penerbit Buku" },
    {
      key: "link_buku",
      label: "Link Buku",
      isLink: true,
    },
  ];
}

function getPengesahanPkmFields(detail = {}) {
  return [
    { key: "bidang_ilmu", label: "Bidang Ilmu" },
    { key: "no_surat_tugas", label: "No Surat Tugas PKM" },
    {
      key: "jenis_pkm",
      label: "Jenis PKM",
      format: getJenisPkmLabel,
    },
    ...(isJenisPkmPembicara(detail)
      ? [
          {
            key: "judul_materi",
            label: "Judul Materi yang Disampaikan",
          },
        ]
      : [
          {
            key: "judul_pkm",
            label: "Judul PKM",
            getValue: getJudulPkmValue,
          },
        ]),
    {
      key: "tempat_pelaksanaan",
      label: isJenisPkmPembicara(detail)
        ? "Tempat Pelaksanaan PKM"
        : "Tempat PKM",
    },
    {
      key: "waktu_pelaksanaan",
      label: "Waktu Pelaksanaan PKM",
      format: formatDateTime,
    },
  ];
}

const DETAIL_FIELD_CONFIG_MAP = {
  detail_tugas_penelitian: () => getTugasPenelitianFields(),
  detail_tugas_publikasi: (pengajuan) => getTugasPublikasiFields(pengajuan),
  detail_tugas_pkm: (_pengajuan, detail) => getTugasPkmFields(detail),
  detail_kemajuan_penelitian: () => getKemajuanPenelitianFields(),
  detail_kemajuan_pkm: () => getKemajuanPkmFields(),
  detail_pengesahan_penelitian: () => getPengesahanPenelitianFields(),
  detail_pengesahan_artikel: () => getPengesahanArtikelFields(),
  detail_pengesahan_buku: () => getPengesahanBukuFields(),
  detail_pengesahan_pkm: (_pengajuan, detail) => getPengesahanPkmFields(detail),
};

function getFieldConfigByDetailType(pengajuan, detail = {}) {
  const resolver = DETAIL_FIELD_CONFIG_MAP[pengajuan?.detail_type];
  return resolver ? resolver(pengajuan, detail) : [];
}

export function createRiwayatItem(
  pengajuanId,
  statusLama,
  statusBaru,
  keterangan,
  options = {},
) {
  const createdAt = options.createdAt || getNowSqlDateTime();
  return {
    id: Date.now(),
    pengajuan_id: pengajuanId,
    user_id: Number(options.userId || 1),
    status_lama: statusLama,
    status_baru: statusBaru,
    keterangan,
    created_at: createdAt,
  };
}

export function updateStatusWithHistory(
  previous,
  nextStatus,
  keterangan,
  extra = {},
  options = {},
) {
  const currentStatus = getPengajuanStatus(previous);
  const riwayatBaru = createRiwayatItem(
    previous.id,
    currentStatus,
    nextStatus,
    keterangan,
    options,
  );
  return {
    ...previous,
    ...extra,
    status_pengajuan: nextStatus,
    updated_at: riwayatBaru.created_at,
    riwayat_status: [...(previous.riwayat_status || []), riwayatBaru],
  };
}

export function getFormulirFields(pengajuan) {
  const detail = pengajuan?.detail || {};
  const fieldConfig = getFieldConfigByDetailType(pengajuan, detail);
  return buildFields(detail, fieldConfig);
}
