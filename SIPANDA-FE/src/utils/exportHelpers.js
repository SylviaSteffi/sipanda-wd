import { formatDateOnly, formatDateTime } from "./dateHelpers";
import {
  formatKategori,
  formatTahap,
  getCakupanJurnalLabel,
  getJenisPkmLabel,
  getJenisPengajuanLabel,
  getJudulPengajuan,
  getPengajuanStatus,
  getPeringkatJurnalLabel,
} from "./pengajuanHelpers";
import { STATUS_LABELS } from "../config/statusConfig";
import { dummyPengajuan } from "../data/dummyPengajuan";
import { dummyPengajuanDosen } from "../data/dummyPengajuanDosen";
import {
  EMPTY_EXPORT_VALUE,
  downloadWorkbook,
  getExportValue,
  isFilledExportValue,
} from "./excelExportCore";

const ALL_PENGAJUAN = [...dummyPengajuan, ...dummyPengajuanDosen];

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatOptionalDate(value) {
  return value ? formatDateOnly(value) : EMPTY_EXPORT_VALUE;
}

function formatOptionalDateTime(value) {
  return value ? formatDateTime(value) : EMPTY_EXPORT_VALUE;
}

function formatCurrency(value) {
  if (value == null) return EMPTY_EXPORT_VALUE;
  const num = Number(value);
  return isNaN(num) ? EMPTY_EXPORT_VALUE : num;
}

// ─── Document helpers ─────────────────────────────────────────────────────────

function getDocByCode(pengajuan, code) {
  return (
    (pengajuan?.dokumen || []).find((item) => item?.kode_dokumen === code) ||
    null
  );
}

function getDocNameByCode(pengajuan, code) {
  const found = getDocByCode(pengajuan, code);
  return found ? getExportValue(found.original_name) : EMPTY_EXPORT_VALUE;
}

// ─── PKM helpers ──────────────────────────────────────────────────────────────

function normalizeJenisPkm(value) {
  return String(value || "").trim().toUpperCase();
}

function findPengajuanById(id) {
  return ALL_PENGAJUAN.find((item) => String(item?.id) === String(id)) || null;
}

function getAncestorStages(pengajuan) {
  const result = [];
  let currentParentId = pengajuan?.parent_id || null;
  while (currentParentId) {
    const found = findPengajuanById(currentParentId);
    if (!found) break;
    result.push(found);
    currentParentId = found.parent_id || null;
  }
  return result;
}

function getNearestParent(pengajuan) {
  if (!pengajuan?.parent_id) return null;
  return findPengajuanById(pengajuan.parent_id);
}

function getJudulPkmExportValue(pengajuan) {
  const detail = pengajuan?.detail || {};
  const jenisPkm = normalizeJenisPkm(detail.jenis_pkm);

  if (isFilledExportValue(detail.judul_pkm)) return detail.judul_pkm;

  const parentDetail = getNearestParent(pengajuan)?.detail || {};
  if (isFilledExportValue(parentDetail.judul_pkm)) return parentDetail.judul_pkm;

  if (jenisPkm === "PEMBICARA" && isFilledExportValue(detail.judul_materi)) {
    return detail.judul_materi;
  }

  if (normalizeJenisPkm(parentDetail.jenis_pkm) === "PEMBICARA") {
    if (isFilledExportValue(parentDetail.judul_pkm)) return parentDetail.judul_pkm;
    if (isFilledExportValue(parentDetail.judul_materi)) return parentDetail.judul_materi;
  }

  for (const item of getAncestorStages(pengajuan)) {
    const d = item?.detail || {};
    if (isFilledExportValue(d.judul_pkm)) return d.judul_pkm;
    if (
      normalizeJenisPkm(d.jenis_pkm) === "PEMBICARA" &&
      isFilledExportValue(d.judul_materi)
    ) {
      return d.judul_materi;
    }
  }

  return EMPTY_EXPORT_VALUE;
}

// ─── Form key ─────────────────────────────────────────────────────────────────

function getJenisFormKey({ tahap, kategori }) {
  const key = `${String(tahap || "").toUpperCase()}_${String(kategori || "").toUpperCase()}`;
  const map = {
    TUGAS_PENELITIAN: "TUGAS_PENELITIAN",
    TUGAS_PKM: "TUGAS_PKM",
    TUGAS_ARTIKEL: "TUGAS_ARTIKEL",
    TUGAS_BUKU: "TUGAS_BUKU",
    KEMAJUAN_PENELITIAN: "KEMAJUAN_PENELITIAN",
    KEMAJUAN_PKM: "KEMAJUAN_PKM",
    PENGESAHAN_PENELITIAN: "PENGESAHAN_PENELITIAN",
    PENGESAHAN_PKM: "PENGESAHAN_PKM",
    PENGESAHAN_ARTIKEL: "PENGESAHAN_ARTIKEL",
    PENGESAHAN_BUKU: "PENGESAHAN_BUKU",
  };
  return map[key] || null;
}

// ─── Shared row builders ──────────────────────────────────────────────────────

function buildTopColumns(pengajuan) {
  return {
    "ID Pengajuan": getExportValue(pengajuan?.id),
    Status: getExportValue(
      STATUS_LABELS[getPengajuanStatus(pengajuan)] || getPengajuanStatus(pengajuan),
    ),
  };
}

function buildIdentityRow(pengajuan, includeEmail = true) {
  const p = pengajuan?.pemohon;
  return {
    ...(includeEmail ? { Email: getExportValue(p?.email) } : {}),
    "Nama lengkap dengan gelar": getExportValue(p?.nama),
    "NIDN/NUPTK": getExportValue(p?.nidn),
    Fakultas: getExportValue(String(p?.fakultas || "").replace(/^Fakultas\s+/i, "")),
    "Program Studi": getExportValue(p?.prodi),
    "No WA/HP": getExportValue(p?.no_hp),
  };
}

// ─── Row builders ─────────────────────────────────────────────────────────────

function buildTugasPenelitianRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Judul Proposal Penelitian yang Sudah Disetujui": getExportValue(detail.judul_proposal),
    "Upload Proposal Penelitian yang Sudah Disetujui": getDocNameByCode(pengajuan, "PROPOSAL"),
  };
}

function buildTugasPkmRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  const jenisPkm = normalizeJenisPkm(detail.jenis_pkm);
  const isPembicara = jenisPkm === "PEMBICARA";
  const isLainnya = jenisPkm === "LAINNYA";
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Nama Institusi Pemohon": getExportValue(detail.nama_institusi_pemohon),
    "No Surat Permohonan": getExportValue(detail.no_surat_permohonan),
    "Tanggal Surat Permohonan": formatOptionalDate(detail.tanggal_surat_permohonan),
    "Upload Surat Permohonan atau Surat Persetujuan dari Masyarakat/Organisasi":
      getDocNameByCode(pengajuan, "SURAT_PERMOHONAN"),
    "Jenis PKM": getExportValue(getJenisPkmLabel(detail.jenis_pkm)),
    "Judul PKM": getExportValue(getJudulPkmExportValue(pengajuan)),
    "Judul Materi yang Disampaikan": isPembicara
      ? getExportValue(detail.judul_materi)
      : EMPTY_EXPORT_VALUE,
    "Tempat Pelaksanaan PKM": getExportValue(detail.tempat_pelaksanaan),
    "Waktu Pelaksanaan PKM": formatOptionalDateTime(detail.waktu_pelaksanaan),
    "Sumber Dana PKM": getExportValue(detail.sumber_dana),
    "Besar Dana PKM": formatCurrency(detail.besar_dana),
    "Upload Materi yang Disampaikan": isPembicara
      ? getDocNameByCode(pengajuan, "MATERI_DISAMPAIKAN")
      : EMPTY_EXPORT_VALUE,
    "Upload Surat Undangan/Surat Persetujuan dari Masyarakat/Organisasi": isLainnya
      ? getDocNameByCode(pengajuan, "SURAT_UNDANGAN_PKM")
      : EMPTY_EXPORT_VALUE,
    "Upload Proposal PKM": isLainnya
      ? getDocNameByCode(pengajuan, "PROPOSAL_PKM")
      : EMPTY_EXPORT_VALUE,
  };
}

function buildTugasArtikelRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Judul Artikel/Jurnal Ilmiah": getExportValue(detail.judul_karya),
    "Tanggal Mulai Menulis": formatOptionalDate(detail.tanggal_mulai),
    "Upload Artikel/Jurnal Ilmiah": getDocNameByCode(pengajuan, "ARTIKEL"),
  };
}

function buildTugasBukuRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Judul Buku": getExportValue(detail.judul_karya),
    "Tanggal Mulai Menulis Buku": formatOptionalDate(detail.tanggal_mulai),
    "Upload Naskah Buku": getDocNameByCode(pengajuan, "NASKAH_BUKU"),
  };
}

function buildPengesahanPenelitianRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Judul Penelitian": getExportValue(detail.judul_penelitian),
    "Nomor Surat Tugas": getExportValue(detail.no_surat_tugas),
    "Tanggal Mulai / Tanggal Surat Tugas": formatOptionalDate(detail.tanggal_mulai),
    "Tanggal Selesai": formatOptionalDate(detail.tanggal_selesai),
    "Upload Laporan Akhir Penelitian": getDocNameByCode(pengajuan, "LAPORAN_AKHIR"),
  };
}

function buildPengesahanPkmRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  const jenisPkm = normalizeJenisPkm(detail.jenis_pkm);
  const isPembicara = jenisPkm === "PEMBICARA";
  const isLainnya = jenisPkm === "LAINNYA";
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Jenis PKM": getExportValue(getJenisPkmLabel(detail.jenis_pkm)),
    // Pembicara
    "Judul Materi yang Disampaikan": isPembicara
      ? getExportValue(detail.judul_materi)
      : EMPTY_EXPORT_VALUE,
    // Lain-lain
    "Judul PKM": isLainnya
      ? getExportValue(detail.judul_pkm)
      : EMPTY_EXPORT_VALUE,
    // Satu kolom nomor surat tugas, berlaku untuk keduanya
    "Nomor Surat Tugas": getExportValue(detail.no_surat_tugas),
    "Tempat PKM": getExportValue(detail.tempat_pelaksanaan),
    "Waktu Pelaksanaan PKM": formatOptionalDateTime(detail.waktu_pelaksanaan),
    "Upload Materi yang Disampaikan dan Surat Keterangan/Sertifikat yang diperoleh":
      isPembicara
        ? getDocNameByCode(pengajuan, "MATERI_SERTIFIKAT")
        : EMPTY_EXPORT_VALUE,
    "Upload Laporan Akhir PKM beserta surat keterangan telah melaksanakan PKM dari Tempat Pelaksanaan PKM/Sertifikat":
      isLainnya
        ? getDocNameByCode(pengajuan, "LAPORAN_AKHIR_PKM_SERTIFIKAT")
        : EMPTY_EXPORT_VALUE,
  };
}

function buildPengesahanArtikelRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Tanggal Mulai Menulis Artikel": formatOptionalDate(detail.tanggal_mulai),
    "Nomor Surat Tugas": getExportValue(detail.no_surat_tugas),
    "Judul Artikel/Jurnal Ilmiah": getExportValue(detail.judul_artikel),
    "Nama Jurnal": getExportValue(detail.nama_jurnal),
    "Cakupan Jurnal/Prosiding": getExportValue(getCakupanJurnalLabel(detail.cakupan_jurnal)),
    "Indeks/Peringkat": getExportValue(getPeringkatJurnalLabel(detail.peringkat_jurnal)),
    "Volume Jurnal": getExportValue(detail.volume),
    "Nomor Jurnal": getExportValue(detail.nomor),
    DOI: getExportValue(detail.doi),
    "Tanggal Terbit Artikel": formatOptionalDate(detail.tanggal_terbit),
    "Penerbit Jurnal": getExportValue(detail.penerbit),
    "Link Jurnal/Artikel": getExportValue(detail.link_artikel),
    "Upload Artikel/Jurnal yang Sudah Dipublikasikan Beserta Printscreen dari Layar Tampilan Web Tempat Artikel/Jurnal Dipublikasikan":
      getDocNameByCode(pengajuan, "ARTIKEL_PUBLIKASI"),
  };
}

function buildPengesahanBukuRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, true),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Tanggal Mulai Menulis Buku": formatOptionalDate(detail.tanggal_mulai),
    "Nomor Surat Tugas": getExportValue(detail.no_surat_tugas),
    "Judul Buku": getExportValue(detail.judul_buku),
    "Judul Book Chapter": getExportValue(detail.judul_book_chapter),
    Halaman: getExportValue(detail.halaman),
    "E-ISBN/ISBN": getExportValue(detail.isbn),
    "Tanggal Terbit Buku": formatOptionalDate(detail.tanggal_terbit),
    "Penerbit Buku": getExportValue(detail.penerbit),
    "Link Buku": getExportValue(detail.link_buku),
    "Upload Buku yang Sudah Diterbitkan Beserta Printscreen dari Tempat Diterbitkan":
      getDocNameByCode(pengajuan, "BUKU_PUBLIKASI"),
  };
}

function buildKemajuanPenelitianRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, false),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Judul Penelitian": getExportValue(detail.judul_penelitian),
    "Nomor Surat Tugas Penelitian": getExportValue(detail.no_surat_tugas),
    "Tanggal Surat Tugas Penelitian": formatOptionalDate(detail.tanggal_surat_tugas),
    "Upload Laporan Kemajuan Penelitian": getDocNameByCode(pengajuan, "LAPORAN_KEMAJUAN"),
  };
}

function buildKemajuanPkmRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  return {
    ...buildTopColumns(pengajuan),
    ...buildIdentityRow(pengajuan, false),
    "Bidang Ilmu": getExportValue(detail.bidang_ilmu),
    "Judul PKM": getExportValue(getJudulPkmExportValue(pengajuan)),
    "Nomor Surat Tugas PKM": getExportValue(detail.no_surat_tugas),
    "Tanggal Surat Tugas PKM": formatOptionalDate(detail.tanggal_surat_tugas),
    "Tempat PKM": getExportValue(detail.tempat_pkm),
    "Upload Laporan Kemajuan PKM": getDocNameByCode(pengajuan, "LAPORAN_KEMAJUAN_PKM"),
  };
}

// ─── Registry & exports ───────────────────────────────────────────────────────

const EXPORT_BUILDERS = {
  TUGAS_PENELITIAN: buildTugasPenelitianRow,
  TUGAS_PKM: buildTugasPkmRow,
  TUGAS_ARTIKEL: buildTugasArtikelRow,
  TUGAS_BUKU: buildTugasBukuRow,
  KEMAJUAN_PENELITIAN: buildKemajuanPenelitianRow,
  KEMAJUAN_PKM: buildKemajuanPkmRow,
  PENGESAHAN_PENELITIAN: buildPengesahanPenelitianRow,
  PENGESAHAN_PKM: buildPengesahanPkmRow,
  PENGESAHAN_ARTIKEL: buildPengesahanArtikelRow,
  PENGESAHAN_BUKU: buildPengesahanBukuRow,
};

export function canExportByFormSelection({ tahap, kategori }) {
  return Boolean(getJenisFormKey({ tahap, kategori }));
}

export function exportPengajuanFormDataBySelection({
  tahap,
  kategori,
  periodeLabel = "",
  pengajuanList = [],
}) {
  const formKey = getJenisFormKey({ tahap, kategori });
  if (!formKey) {
    throw new Error("Kombinasi Tahap dan Kategori yang dipilih belum mendukung ekspor Excel.");
  }
  if (!Array.isArray(pengajuanList) || pengajuanList.length === 0) {
    throw new Error("Tidak ada data yang bisa diekspor.");
  }
  const builder = EXPORT_BUILDERS[formKey];
  if (!builder) throw new Error("Builder ekspor tidak ditemukan.");

  const rows = pengajuanList.map((item) => builder(item));
  const baseName = `Surat ${formatTahap(tahap)} ${formatKategori(kategori)} ${periodeLabel}`.trim();
  downloadWorkbook({ rows, sheetName: baseName, fileName: `${baseName}.xlsx` });
}

function buildPendingDashboardRow(pengajuan) {
  return {
    "ID Pengajuan": getExportValue(pengajuan?.id),
    "Nama Dosen": getExportValue(pengajuan?.pemohon?.nama),
    NIDN: getExportValue(pengajuan?.pemohon?.nidn),
    Judul: getExportValue(getJudulPengajuan(pengajuan)),
    Tahap: getExportValue(formatTahap(pengajuan?.tahap)),
    Kategori: getExportValue(formatKategori(pengajuan?.kategori)),
    "Jenis Pengajuan": getExportValue(getJenisPengajuanLabel(pengajuan?.jenis_pengajuan)),
    Status: getExportValue(
      STATUS_LABELS[getPengajuanStatus(pengajuan)] || getPengajuanStatus(pengajuan),
    ),
    "Tanggal Pengajuan": formatOptionalDateTime(pengajuan?.tanggal_pengajuan),
  };
}

export function exportPendingDashboardData({ periodeLabel = "", pengajuanList = [] }) {
  if (!Array.isArray(pengajuanList) || pengajuanList.length === 0) {
    throw new Error("Tidak ada data pengajuan belum selesai untuk diekspor.");
  }
  const rows = pengajuanList.map(buildPendingDashboardRow);
  const baseName = `Daftar Pengajuan Belum Selesai ${periodeLabel}`.trim();
  downloadWorkbook({ rows, sheetName: baseName, fileName: `${baseName}.xlsx` });
}