import { PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN } from "./dosenCreatePengajuanConfig";

const LABELS = {
  tahap: {
    TUGAS: "Surat Tugas",
    KEMAJUAN: "Laporan Kemajuan",
    PENGESAHAN: "Surat Pengesahan",
  },
  kategori: {
    PENELITIAN: "Penelitian",
    PKM: "Pengabdian Kepada Masyarakat",
    ARTIKEL: "Artikel/Publikasi",
    BUKU: "Buku",
  },
  jenisPengajuan: {
    INDIVIDU: "Individu",
    KELOMPOK: "Kelompok",
  },
  jenisPkm: {
    PEMBICARA: "Pembicara/Nara Sumber Seminar/Workshop/Pelatihan",
    LAINNYA: "Lain-lain",
  },
  cakupanJurnal: {
    JURNAL_NASIONAL: "Jurnal Nasional",
    JURNAL_INTERNASIONAL: "Jurnal Internasional",
    PROSIDING: "Prosiding",
  },
};

const PERINGKAT_JURNAL_LABEL_MAP = Object.values(
  PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN,
)
  .flat()
  .reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

const JUDUL_CONFIG = {
  PENELITIAN: {
    keys: ["judul_proposal", "judul_penelitian"],
    fallback: "Pengajuan Penelitian",
  },
  PKM: {
    keys: ["judul_pkm", "judul_materi"],
    fallback: "Pengajuan PKM",
  },
  ARTIKEL: {
    TUGAS: {
      keys: ["judul_karya"],
      fallback: "Pengajuan Artikel",
    },
    PENGESAHAN: {
      keys: ["judul_artikel"],
      fallback: "Pengajuan Artikel",
    },
  },
  BUKU: {
    TUGAS: {
      keys: ["judul_karya"],
      fallback: "Pengajuan Buku",
    },
    PENGESAHAN: {
      keys: ["judul_buku"],
      fallback: "Pengajuan Buku",
    },
  },
};

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function getText(value) {
  return String(value || "").trim();
}

function getTitleFromDetail(detail = {}, keys = []) {
  for (const key of keys) {
    const value = getText(detail?.[key]);
    if (value) return value;
  }
  return "";
}

function formatLabel(map, value) {
  const key = normalizeKey(value);
  return map[key] || value || "-";
}

export function formatTahap(value) {
  return formatLabel(LABELS.tahap, value);
}

export function formatKategori(value) {
  return formatLabel(LABELS.kategori, value);
}

export function getJenisPengajuanLabel(value) {
  return formatLabel(LABELS.jenisPengajuan, value);
}

export function getJenisPkmLabel(value) {
  return formatLabel(LABELS.jenisPkm, value);
}

export function getCakupanJurnalLabel(value) {
  return formatLabel(LABELS.cakupanJurnal, value);
}

export function getPeringkatJurnalLabel(value) {
  const normalized = normalizeKey(value);
  if (!normalized) return "-";
  return PERINGKAT_JURNAL_LABEL_MAP[normalized] || value || "-";
}

export function getPengajuanStatus(pengajuan) {
  return pengajuan?.status_pengajuan || pengajuan?.status || "-";
}

export function getJudulPengajuan(pengajuan) {
  const kategori = normalizeKey(pengajuan?.kategori);
  const tahap = normalizeKey(pengajuan?.tahap);
  const detail = pengajuan?.detail || {};
  const kategoriConfig = JUDUL_CONFIG[kategori];
  if (!kategoriConfig) return "Pengajuan";
  const resolvedConfig = kategoriConfig[tahap] || kategoriConfig;
  return (
    getTitleFromDetail(detail, resolvedConfig.keys) || resolvedConfig.fallback
  );
}

export function getRingkasanSubtitle(pengajuan) {
  return `${formatTahap(pengajuan?.tahap)} · ${formatKategori(
    pengajuan?.kategori,
  )}`;
}

export function getAnggotaLabel(pengajuan) {
  if (
    normalizeKey(pengajuan?.jenis_pengajuan) !== "KELOMPOK" ||
    !Array.isArray(pengajuan?.anggota)
  ) {
    return "";
  }
  const anggotaNames = pengajuan.anggota
    .map((anggota) => getText(anggota?.nama))
    .filter(Boolean);
  if (anggotaNames.length === 0) return "";
  const [firstName, ...rest] = anggotaNames;
  return rest.length > 0
    ? `${firstName} +${rest.length} anggota lainnya`
    : firstName;
}

export function matchesPengajuanSearch(pengajuan, keyword, akademikLabel = "") {
  const normalizedKeyword = String(keyword || "")
    .trim()
    .toLowerCase();
  if (!normalizedKeyword) return true;
  const haystack = [
    pengajuan?.id,
    pengajuan?.pemohon?.nama,
    getAnggotaLabel(pengajuan),
    getJudulPengajuan(pengajuan),
    getRingkasanSubtitle(pengajuan),
    akademikLabel,
  ].map((item) => String(item || "").toLowerCase());

  return haystack.some((item) => item.includes(normalizedKeyword));
}

export function formatSemesterLabel(semester) {
  const normalized = normalizeKey(semester);
  if (normalized === "GANJIL") return "Ganjil";
  if (normalized === "GENAP") return "Genap";
  return "-";
}
