import {
  formatKategori,
  formatTahap,
  getPengajuanStatus,
} from "./pengajuanHelpers";
import { getAkademikLabelById } from "./akademikHelpers";
import { matchesPengajuanSearch } from "./pengajuanListHelpers";
import { getDateTimeValue } from "./dateHelpers";
import { getDocumentLabel } from "./documentLabelHelpers";

const BKD_READY_STATUSES = ["SELESAI"];

const PRIMARY_BKD_DOCUMENT_CODES = [
  "SURAT_FINAL",
  "ARTIKEL_PUBLIKASI",
  "LAPORAN_AKHIR",
  "LAPORAN_AKHIR_PKM_SERTIFIKAT",
  "MATERI_SERTIFIKAT",
  "LAPORAN_KEMAJUAN",
  "LAPORAN_KEMAJUAN_PKM",
];

const BKD_EVIDENCE_LABELS = {
  SURAT_FINAL: "Surat final",
  LAPORAN_AKHIR: "Laporan akhir",
  LAPORAN_AKHIR_PKM_SERTIFIKAT: "Laporan akhir & sertifikat",
  MATERI_SERTIFIKAT: "Materi & sertifikat",
  LAPORAN_KEMAJUAN: "Laporan kemajuan",
  LAPORAN_KEMAJUAN_PKM: "Laporan kemajuan PKM",
};

function normalizeId(value) {
  return String(value || "");
}

function normalizeKey(value) {
  return String(value || "").trim().toUpperCase();
}

function sortByTanggalTerbaru(data = []) {
  return [...data].sort(
    (a, b) =>
      getDateTimeValue(b?.tanggal_pengajuan) -
      getDateTimeValue(a?.tanggal_pengajuan),
  );
}

function getPrimaryBkdDocument(pengajuan) {
  const dokumen = Array.isArray(pengajuan?.dokumen) ? pengajuan.dokumen : [];

  return (
    PRIMARY_BKD_DOCUMENT_CODES.map((code) =>
      dokumen.find((item) => item?.kode_dokumen === code),
    ).find(Boolean) || null
  );
}

function getShortEvidenceLabelByCode(code, pengajuan = null) {
  if (!code) return "";

  if (BKD_EVIDENCE_LABELS[code]) {
    return BKD_EVIDENCE_LABELS[code];
  }

  const rawLabel = getDocumentLabel(code, pengajuan);
  const normalizedLabel = String(rawLabel || "").trim();

  if (!normalizedLabel || normalizedLabel === code) {
    return "";
  }

  const shortMap = {
    "Proposal Penelitian": "Proposal penelitian",
    "Draft Artikel/Jurnal Ilmiah": "Draft artikel",
    "Naskah Buku": "Naskah buku",
    "Proposal PKM": "Proposal PKM",
    "Materi yang Disampaikan": "Materi",
    "Surat Tugas Penelitian": "Surat tugas penelitian",
    "Surat Tugas PKM": "Surat tugas PKM",
    "Surat Tugas Artikel": "Surat tugas artikel",
    "Surat Tugas Buku": "Surat tugas buku",
    "Artikel/Jurnal yang Sudah Dipublikasikan beserta Bukti Tampil Publikasi":
      "Artikel publikasi",
    "Buku yang Sudah Dipublikasikan beserta Bukti Tampil Publikasi":
      "Buku publikasi",
    "Artikel/Jurnal/Buku yang Sudah Dipublikasikan beserta Bukti Tampil Publikasi":
      "Publikasi",
    "Surat Permohonan atau Surat Persetujuan dari Masyarakat/Organisasi":
      "Surat permohonan",
    "Surat Undangan atau Surat Persetujuan dari Masyarakat/Organisasi":
      "Surat undangan",
  };

  return shortMap[normalizedLabel] || normalizedLabel;
}

export function filterPengajuanByUserId(pengajuanData = [], userId) {
  if (!userId) return pengajuanData;

  return pengajuanData.filter(
    (item) => normalizeId(item?.user_id) === normalizeId(userId),
  );
}

export function canAccessDosenPengajuan(pengajuan, userId) {
  if (!pengajuan || !userId) return false;

  return normalizeId(pengajuan.user_id) === normalizeId(userId);
}

export function isBkdReadyPengajuan(pengajuan) {
  return BKD_READY_STATUSES.includes(getPengajuanStatus(pengajuan));
}

export function hasArsipDokumen(pengajuan) {
  return Array.isArray(pengajuan?.dokumen) && pengajuan.dokumen.length > 0;
}

export function hasFinalArsipDokumen(pengajuan) {
  return Array.isArray(pengajuan?.dokumen)
    ? pengajuan.dokumen.some((doc) => doc?.kode_dokumen === "SURAT_FINAL")
    : false;
}

export function getBkdEvidenceLabel(pengajuan) {
  const dokumen = Array.isArray(pengajuan?.dokumen) ? pengajuan.dokumen : [];

  if (dokumen.length === 0) return "Belum ada bukti";

  const primaryDocument = getPrimaryBkdDocument(pengajuan);

  if (primaryDocument) {
    return getShortEvidenceLabelByCode(
      primaryDocument.kode_dokumen,
      pengajuan,
    );
  }

  if (dokumen.length === 1) {
    return (
      getShortEvidenceLabelByCode(dokumen[0]?.kode_dokumen, pengajuan) ||
      "1 dokumen"
    );
  }

  const firstKnownLabel = dokumen
    .map((item) => getShortEvidenceLabelByCode(item?.kode_dokumen, pengajuan))
    .find(Boolean);

  if (firstKnownLabel) {
    return `${firstKnownLabel} +${dokumen.length - 1}`;
  }

  return `${dokumen.length} dokumen`;
}

export function getBkdJenisSuratLabel(pengajuan) {
  return `${formatTahap(pengajuan?.tahap)} ${formatKategori(
    pengajuan?.kategori,
  )}`;
}

export function filterDosenPengajuan({
  pengajuanData = [],
  akademikData = [],
  userId = "",
  search = "",
  status = "",
  tahap = "",
  kategori = "",
  akademikId = "",
  onlyBkdReady = false,
  cakupanArtikel = "",
  indeksArtikel = "",
}) {
  const ownedPengajuan = filterPengajuanByUserId(pengajuanData, userId);
  const keyword = search.trim().toLowerCase();

  const filtered = ownedPengajuan.filter((item) => {
    const akademikLabel = getAkademikLabelById(akademikData, item.akademik_id);
    const itemStatus = getPengajuanStatus(item);
    const detail = item?.detail || {};

    const matchSearch = matchesPengajuanSearch(item, keyword, akademikLabel);
    const matchStatus = !status || itemStatus === status;
    const matchTahap = !tahap || item.tahap === tahap;
    const matchKategori = !kategori || item.kategori === kategori;
    const matchAkademik =
      !akademikId || normalizeId(item.akademik_id) === normalizeId(akademikId);
    const matchBkdReady = !onlyBkdReady || isBkdReadyPengajuan(item);
    const matchCakupanArtikel =
      !cakupanArtikel ||
      normalizeKey(detail.cakupan_jurnal) === normalizeKey(cakupanArtikel);
    const matchIndeksArtikel =
      !indeksArtikel ||
      normalizeKey(detail.peringkat_jurnal) === normalizeKey(indeksArtikel);

    return (
      matchSearch &&
      matchStatus &&
      matchTahap &&
      matchKategori &&
      matchAkademik &&
      matchBkdReady &&
      matchCakupanArtikel &&
      matchIndeksArtikel
    );
  });

  return sortByTanggalTerbaru(filtered);
}

export function getLatestDosenPengajuan(pengajuanData = [], limit = 5) {
  return sortByTanggalTerbaru(pengajuanData).slice(0, limit);
}

export function getPendingDosenPengajuan(pengajuanData = []) {
  const pendingStatuses = [
    "DIAJUKAN",
    "DALAM_PEMERIKSAAN",
    "PERLU_KLARIFIKASI",
    "DISETUJUI",
  ];

  return sortByTanggalTerbaru(
    pengajuanData.filter((item) =>
      pendingStatuses.includes(getPengajuanStatus(item)),
    ),
  );
}