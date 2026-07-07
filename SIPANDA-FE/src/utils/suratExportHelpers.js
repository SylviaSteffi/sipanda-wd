import { formatDateOnly } from "./dateHelpers";
import {
  getCakupanJurnalLabel,
  getPengajuanStatus,
  getPeringkatJurnalLabel,
} from "./pengajuanHelpers";
import { STATUS_LABELS } from "../config/statusConfig";
import {
  EMPTY_EXPORT_VALUE,
  createExportLink,
  downloadWorkbook,
  getExportValue,
} from "./excelExportCore";

const EXPORT_TAHAP = "PENGESAHAN";
const EXPORT_KATEGORI = "ARTIKEL";
const EXPORT_STATUS = "SELESAI";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatOptionalDate(value) {
  return value ? formatDateOnly(value) : EMPTY_EXPORT_VALUE;
}

function getConfiguredDocumentPreviewBaseUrl() {
  return String(import.meta.env.VITE_DOCUMENT_PREVIEW_BASE_URL || "").trim();
}

function joinUrl(baseUrl = "", path = "") {
  const safeBase = String(baseUrl || "").replace(/\/+$/, "");
  const safePath = String(path || "").replace(/^\/+/, "");
  if (!safeBase || !safePath) return "";
  return `${safeBase}/${safePath}`;
}

function getDocumentPreviewUrl(doc) {
  const directUrl = doc?.preview_url || doc?.file_url || doc?.url || doc?.download_url || "";
  if (directUrl) return String(directUrl).trim();
  const baseUrl = getConfiguredDocumentPreviewBaseUrl();
  if (!baseUrl || !doc?.id) return "";
  return joinUrl(baseUrl, doc.id);
}

function getDocByCode(pengajuan, code) {
  return (pengajuan?.dokumen || []).find((item) => item?.kode_dokumen === code) || null;
}

function getDocNameByCode(pengajuan, code) {
  const found = getDocByCode(pengajuan, code);
  if (!found) return EMPTY_EXPORT_VALUE;
  return createExportLink(found.original_name, getDocumentPreviewUrl(found));
}

function isPengesahanArtikelSelesai(pengajuan) {
  return (
    pengajuan?.tahap === EXPORT_TAHAP &&
    pengajuan?.kategori === EXPORT_KATEGORI &&
    getPengajuanStatus(pengajuan) === EXPORT_STATUS
  );
}

function buildPengesahanArtikelSuratRow(pengajuan) {
  const detail = pengajuan?.detail || {};
  const p = pengajuan?.pemohon;

  return {
    "ID Pengajuan": getExportValue(pengajuan?.id),
    Status: getExportValue(
      STATUS_LABELS[getPengajuanStatus(pengajuan)] || getPengajuanStatus(pengajuan),
    ),
    Email: getExportValue(p?.email),
    "Nama lengkap dengan gelar": getExportValue(p?.nama),
    "NIDN/NUPTK": getExportValue(p?.nidn),
    Fakultas: getExportValue(String(p?.fakultas || "").replace(/^Fakultas\s+/i, "")),
    "Program Studi": getExportValue(p?.prodi),
    "No WA/HP": getExportValue(p?.no_hp),
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
    "Nomor Surat Final": getExportValue(pengajuan?.nomor_surat),
    "Tanggal Surat Final": formatOptionalDate(pengajuan?.tanggal_surat),
    "Dokumen Surat Final": getDocNameByCode(pengajuan, "SURAT_FINAL"),
  };
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function exportPengesahanArtikelSuratData({ periodeLabel = "", pengajuanList = [] }) {
  const rows = pengajuanList
    .filter(isPengesahanArtikelSelesai)
    .map(buildPengesahanArtikelSuratRow);

  if (rows.length === 0) {
    throw new Error(
      "Belum ada data pengesahan artikel berstatus selesai yang bisa diekspor.",
    );
  }

  const baseName = `Daftar Pengesahan Artikel ${periodeLabel}`.trim();
  downloadWorkbook({ rows, sheetName: baseName, fileName: `${baseName}.xlsx` });
}