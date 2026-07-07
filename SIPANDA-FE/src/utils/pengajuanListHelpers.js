import {
  formatKategori,
  formatTahap,
  getJudulPengajuan,
} from "./pengajuanHelpers";

export function getRingkasanSubtitle(pengajuan) {
  return `${formatTahap(pengajuan?.tahap)} · ${formatKategori(
    pengajuan?.kategori,
  )}`;
}

export function getAnggotaLabel(pengajuan) {
  if (
    pengajuan?.jenis_pengajuan !== "KELOMPOK" ||
    !Array.isArray(pengajuan?.anggota) ||
    pengajuan.anggota.length === 0
  ) {
    return "";
  }

  const anggotaNames = pengajuan.anggota
    .map((anggota) => String(anggota?.nama || "").trim())
    .filter(Boolean);

  if (anggotaNames.length === 0) {
    return "";
  }

  const firstName = anggotaNames[0];
  const remainingCount = anggotaNames.length - 1;

  if (remainingCount <= 0) {
    return firstName;
  }

  return `${firstName} +${remainingCount} anggota lainnya`;
}

export function matchesPengajuanSearch(pengajuan, keyword, akademikLabel = "") {
  if (!keyword) return true;

  const normalizedKeyword = String(keyword).trim().toLowerCase();
  const judul = getJudulPengajuan(pengajuan).toLowerCase();
  const subtitle = getRingkasanSubtitle(pengajuan).toLowerCase();
  const namaDosen = String(pengajuan?.pemohon?.nama || "").toLowerCase();
  const anggota = getAnggotaLabel(pengajuan).toLowerCase();

  return (
    String(pengajuan?.id || "").includes(normalizedKeyword) ||
    namaDosen.includes(normalizedKeyword) ||
    anggota.includes(normalizedKeyword) ||
    judul.includes(normalizedKeyword) ||
    subtitle.includes(normalizedKeyword) ||
    String(akademikLabel).toLowerCase().includes(normalizedKeyword)
  );
}

export function formatSemesterLabel(semester) {
  if (semester === "GANJIL") return "Ganjil";
  if (semester === "GENAP") return "Genap";
  return "-";
}