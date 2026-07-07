import {
  formatKategori,
  formatTahap,
  getPengajuanStatus,
} from "./pengajuanHelpers";
import { SURAT_OFFICIAL_HOLIDAY_CONFIG } from "../config/suratOfficialHolidayConfig";
import { SURAT_CUSTOM_HOLIDAY_CONFIG } from "../config/suratCustomHolidayConfig";

const ROMAN_MONTH = {
  "01": "I",
  "02": "II",
  "03": "III",
  "04": "IV",
  "05": "V",
  "06": "VI",
  "07": "VII",
  "08": "VIII",
  "09": "IX",
  "10": "X",
  "11": "XI",
  "12": "XII",
};

const FACULTY_CODES = {
  "Fakultas Teknologi Informasi": "FTI",
  "Fakultas Ekonomi dan Bisnis": "FEB",
  "Fakultas Bahasa": "FB",
};

const SURAT_READY_STATUSES = ["DISETUJUI", "SELESAI"];
const MAX_DAILY_SEQUENCE = 26;
const NOMOR_SURAT_REGEX = /^\d{2}\.\d{2}\.([A-Z])\/([A-Z]+)-([A-Z]+)\//i;

function toIsoDateOnly(value = "") {
  return value ? String(value).slice(0, 10) : "";
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeTahap(value = "") {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function normalizeKategori(value = "") {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function getDateParts(dateString = "") {
  const safeDate = toIsoDateOnly(dateString);
  const todayParts = getToday().split("-");

  if (!safeDate) {
    return { year: todayParts[0], month: todayParts[1], day: todayParts[2] };
  }

  const [
    year = todayParts[0],
    month = todayParts[1],
    day = todayParts[2],
  ] = safeDate.split("-");

  return { year, month, day };
}

function parseIsoDate(dateString = "") {
  const safeDate = toIsoDateOnly(dateString);
  if (!safeDate) return null;

  const date = new Date(`${safeDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function formatIsoDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCustomHolidayConfigForYear(year) {
  return SURAT_CUSTOM_HOLIDAY_CONFIG[year] || {};
}

function getCustomUnblockedDatesForYear(year) {
  return getCustomHolidayConfigForYear(year)?.unblockedDates || [];
}

function getMergedHolidayMapForYear(year) {
  const mergedMap = {
    ...(SURAT_OFFICIAL_HOLIDAY_CONFIG[year]?.blockedDates || {}),
    ...(SURAT_CUSTOM_HOLIDAY_CONFIG[year]?.blockedDates || {}),
  };

  getCustomUnblockedDatesForYear(year).forEach((dateString) => {
    delete mergedMap[dateString];
  });

  return mergedMap;
}

function getAllConfiguredYears() {
  const yearSet = new Set([
    ...Object.keys(SURAT_OFFICIAL_HOLIDAY_CONFIG),
    ...Object.keys(SURAT_CUSTOM_HOLIDAY_CONFIG),
  ]);

  return Array.from(yearSet)
    .map(Number)
    .sort((a, b) => a - b);
}

function isSunday(dateString = "") {
  const date = parseIsoDate(dateString);
  return date ? date.getDay() === 0 : false;
}

function isYearEndBlocked(dateString = "") {
  const safeDate = toIsoDateOnly(dateString);
  if (!safeDate) return false;

  const [, month = "", day = ""] = safeDate.split("-");
  const numericDay = Number(day);

  return month === "12" && numericDay >= 23 && numericDay <= 31;
}

function findPengajuanById(pengajuanData = [], pengajuanId) {
  return (
    pengajuanData.find((item) => String(item?.id) === String(pengajuanId)) ||
    null
  );
}

function getAncestorStages(pengajuan, pengajuanData = []) {
  const result = [];
  let currentParentId = pengajuan?.parent_id || null;

  while (currentParentId) {
    const found = findPengajuanById(pengajuanData, currentParentId);
    if (!found) break;

    result.push(found);
    currentParentId = found.parent_id || null;
  }

  return result;
}

function getNearestAncestorByTahap(pengajuan, pengajuanData = [], tahap) {
  const normalizedTahap = normalizeTahap(tahap);

  return (
    getAncestorStages(pengajuan, pengajuanData).find(
      (item) => normalizeTahap(item?.tahap) === normalizedTahap,
    ) || null
  );
}

function getTanggalSuratAcuan(pengajuan) {
  return toIsoDateOnly(pengajuan?.tanggal_surat);
}

function isSuratReadyPengajuan(pengajuan) {
  return SURAT_READY_STATUSES.includes(getPengajuanStatus(pengajuan));
}

function getStoredNomorSuratInfo(nomorSurat = "") {
  const match = String(nomorSurat || "")
    .trim()
    .match(NOMOR_SURAT_REGEX);

  if (!match) {
    return {
      urutan: "",
      sequenceNumber: 0,
      kodeJenis: "",
      kodeFakultas: "",
    };
  }

  const urutan = String(match[1] || "").toUpperCase();

  return {
    urutan,
    sequenceNumber: urutan.charCodeAt(0) - 64,
    kodeJenis: String(match[2] || "").toUpperCase(),
    kodeFakultas: String(match[3] || "").toUpperCase(),
  };
}

function getStoredNomorSuratSequenceNumber(nomorSurat = "") {
  return getStoredNomorSuratInfo(nomorSurat).sequenceNumber;
}

function toAlphabetSequence(value = 1) {
  const number = Number(value || 0);

  if (number < 1 || number > MAX_DAILY_SEQUENCE) {
    return "A";
  }

  return String.fromCharCode(64 + number);
}

export function getKodeJenisSurat(pengajuan) {
  return normalizeKategori(pengajuan?.kategori) === "PKM" ? "PKM" : "RST";
}

export function getKodeFakultas(pengajuan) {
  return FACULTY_CODES[pengajuan?.pemohon?.fakultas] || "FK";
}

function isSameNomorSuratGroup(item, pengajuan) {
  const storedInfo = getStoredNomorSuratInfo(item?.nomor_surat);

  if (!storedInfo.kodeJenis || !storedInfo.kodeFakultas) {
    return false;
  }

  return (
    storedInfo.kodeJenis === getKodeJenisSurat(pengajuan) &&
    storedInfo.kodeFakultas === getKodeFakultas(pengajuan)
  );
}

function getStoredSuratSequenceMaxByDate(
  tanggalSurat = "",
  pengajuanData = [],
  currentPengajuan = null,
) {
  const safeDate = toIsoDateOnly(tanggalSurat);
  if (!safeDate || !currentPengajuan) return 0;

  return pengajuanData.reduce((max, item) => {
    if (!isSuratReadyPengajuan(item)) return max;
    if (String(item?.id) === String(currentPengajuan?.id)) return max;
    if (toIsoDateOnly(item?.tanggal_surat) !== safeDate) return max;
    if (!item?.nomor_surat) return max;
    if (!isSameNomorSuratGroup(item, currentPengajuan)) return max;

    const sequenceNumber = getStoredNomorSuratSequenceNumber(item.nomor_surat);
    return sequenceNumber > max ? sequenceNumber : max;
  }, 0);
}

function isSuratSequenceFullByDate(
  tanggalSurat = "",
  pengajuan = null,
  pengajuanData = [],
) {
  if (!pengajuan) return false;

  const safeDate = toIsoDateOnly(tanggalSurat);
  if (!safeDate) return false;

  const currentStoredDate = toIsoDateOnly(pengajuan?.tanggal_surat);
  const currentStoredSequence = getStoredNomorSuratSequenceNumber(
    pengajuan?.nomor_surat,
  );

  if (
    currentStoredDate === safeDate &&
    currentStoredSequence > 0 &&
    getPengajuanStatus(pengajuan) === "SELESAI"
  ) {
    return false;
  }

  const maxSequence = getStoredSuratSequenceMaxByDate(
    safeDate,
    pengajuanData,
    pengajuan,
  );

  return maxSequence >= MAX_DAILY_SEQUENCE;
}

export function getMinimumTanggalSurat(pengajuan, pengajuanData = []) {
  if (!pengajuan) return "";

  const tahap = normalizeTahap(pengajuan?.tahap);

  if (tahap === "TUGAS") {
    return "";
  }

  if (tahap === "KEMAJUAN") {
    const tugas = getNearestAncestorByTahap(pengajuan, pengajuanData, "TUGAS");
    return getTanggalSuratAcuan(tugas);
  }

  if (tahap === "PENGESAHAN") {
    const kemajuan = getNearestAncestorByTahap(
      pengajuan,
      pengajuanData,
      "KEMAJUAN",
    );
    const tugas = getNearestAncestorByTahap(pengajuan, pengajuanData, "TUGAS");

    return getTanggalSuratAcuan(kemajuan) || getTanggalSuratAcuan(tugas);
  }

  return "";
}

export function getSupportedSuratYearRange() {
  const years = getAllConfiguredYears();

  if (!years.length) {
    const currentYear = new Date().getFullYear();
    return { fromYear: currentYear, toYear: currentYear };
  }

  return {
    fromYear: years[0],
    toYear: years[years.length - 1],
  };
}

export function getBlockedSuratDateReason(
  dateString = "",
  pengajuan = null,
  pengajuanData = [],
) {
  const safeDate = toIsoDateOnly(dateString);
  if (!safeDate) return "";

  const minimumDate = getMinimumTanggalSurat(pengajuan, pengajuanData);
  const tahap = normalizeTahap(pengajuan?.tahap);

  if (minimumDate && safeDate < minimumDate) {
    if (tahap === "KEMAJUAN") {
      return `Tanggal surat kemajuan tidak boleh sebelum ${minimumDate}.`;
    }

    if (tahap === "PENGESAHAN") {
      return `Tanggal surat pengesahan tidak boleh sebelum ${minimumDate}.`;
    }

    return `Tanggal surat tidak boleh sebelum ${minimumDate}.`;
  }

  if (isSunday(safeDate)) {
    return "Hari Minggu tidak bisa dipilih.";
  }

  if (isYearEndBlocked(safeDate)) {
    return "Tanggal 23–31 Desember tidak bisa dipilih.";
  }

  const year = Number(safeDate.slice(0, 4));
  const holidayMap = getMergedHolidayMapForYear(year);

  if (holidayMap[safeDate]) {
    return holidayMap[safeDate];
  }

  if (isSuratSequenceFullByDate(safeDate, pengajuan, pengajuanData)) {
    return `Nomor surat ${getKodeJenisSurat(pengajuan)}-${getKodeFakultas(
      pengajuan,
    )} pada tanggal ini sudah mencapai Z.`;
  }

  return "";
}

export function isBlockedSuratDate(
  dateString = "",
  pengajuan = null,
  pengajuanData = [],
) {
  return Boolean(
    getBlockedSuratDateReason(dateString, pengajuan, pengajuanData),
  );
}

export function findNextAvailableSuratDate(
  dateString = "",
  pengajuan = null,
  pengajuanData = [],
) {
  const minimumDate = getMinimumTanggalSurat(pengajuan, pengajuanData);
  const baseDate = parseIsoDate(dateString || minimumDate || getToday());
  if (!baseDate) return minimumDate || getToday();

  const cursor = new Date(baseDate);

  if (minimumDate) {
    const minDateObj = parseIsoDate(minimumDate);
    if (minDateObj && cursor < minDateObj) {
      cursor.setTime(minDateObj.getTime());
    }
  }

  for (let i = 0; i < 740; i += 1) {
    const candidate = formatIsoDate(cursor);

    if (!isBlockedSuratDate(candidate, pengajuan, pengajuanData)) {
      return candidate;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return formatIsoDate(cursor);
}

export function getSuratDayPickerDisabledMatchers(
  pengajuan = null,
  pengajuanData = [],
) {
  const years = getAllConfiguredYears();
  const minimumDate = getMinimumTanggalSurat(pengajuan, pengajuanData);
  const minimumDateObj = parseIsoDate(minimumDate);

  const blockedDates = years
    .flatMap((year) => Object.keys(getMergedHolidayMapForYear(year)))
    .map((dateString) => parseIsoDate(dateString))
    .filter(Boolean);

  return [
    { dayOfWeek: [0] },
    ...blockedDates,
    (date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return month === 12 && day >= 23 && day <= 31;
    },
    ...(minimumDateObj
      ? [
          (date) => {
            const candidate = new Date(date);
            candidate.setHours(0, 0, 0, 0);
            return candidate < minimumDateObj;
          },
        ]
      : []),
    (date) => {
      const candidate = formatIsoDate(date);
      return isSuratSequenceFullByDate(candidate, pengajuan, pengajuanData);
    },
  ];
}

export function getDefaultTanggalSurat(pengajuan, pengajuanData = []) {
  if (!pengajuan) return getToday();

  const status = getPengajuanStatus(pengajuan);

  if (status === "SELESAI" && pengajuan.tanggal_surat) {
    return toIsoDateOnly(pengajuan.tanggal_surat);
  }

  const candidateDate =
    getMinimumTanggalSurat(pengajuan, pengajuanData) || getToday();

  return findNextAvailableSuratDate(candidateDate, pengajuan, pengajuanData);
}

export function getUrutanHarian(pengajuan, tanggalSurat, pengajuanData = []) {
  if (!pengajuan) return "A";

  const safeDate = toIsoDateOnly(
    tanggalSurat || pengajuan?.tanggal_surat || "",
  );

  if (!safeDate) {
    return pengajuan?.nomor_urut_harian || "A";
  }

  const currentStoredDate = toIsoDateOnly(pengajuan?.tanggal_surat);
  const currentStoredSequence = getStoredNomorSuratSequenceNumber(
    pengajuan?.nomor_surat,
  );

  if (
    currentStoredDate === safeDate &&
    currentStoredSequence > 0 &&
    getPengajuanStatus(pengajuan) === "SELESAI"
  ) {
    return toAlphabetSequence(currentStoredSequence);
  }

  const maxStoredSequence = getStoredSuratSequenceMaxByDate(
    safeDate,
    pengajuanData,
    pengajuan,
  );

  return toAlphabetSequence(maxStoredSequence + 1);
}

export function generateNomorSurat(pengajuan, tanggalSurat, pengajuanData = []) {
  if (!pengajuan) return "";

  const tanggalFinal = findNextAvailableSuratDate(
    tanggalSurat || getDefaultTanggalSurat(pengajuan, pengajuanData),
    pengajuan,
    pengajuanData,
  );

  if (
    getPengajuanStatus(pengajuan) === "SELESAI" &&
    pengajuan?.nomor_surat &&
    toIsoDateOnly(pengajuan?.tanggal_surat) === tanggalFinal
  ) {
    return pengajuan.nomor_surat;
  }

  const { year, month, day } = getDateParts(tanggalFinal);
  const prefixTanggal = `${month}.${day}`;
  const urutanHarian = getUrutanHarian(pengajuan, tanggalFinal, pengajuanData);
  const kodeJenis = getKodeJenisSurat(pengajuan);
  const kodeFakultas = getKodeFakultas(pengajuan);
  const bulanRomawi = ROMAN_MONTH[month] || "I";

  return `${prefixTanggal}.${urutanHarian}/${kodeJenis}-${kodeFakultas}/LPPM/${bulanRomawi}/${year}`;
}

export function getJenisSuratLabel(pengajuan) {
  return `${formatTahap(pengajuan?.tahap)} ${formatKategori(pengajuan?.kategori)}`;
}

export function getDisplayTanggalSurat(
  pengajuan,
  tanggalSuratState,
  pengajuanData = [],
) {
  if (!pengajuan) return "";

  const status = getPengajuanStatus(pengajuan);

  if (status === "SELESAI" && pengajuan.tanggal_surat) {
    return toIsoDateOnly(pengajuan.tanggal_surat);
  }

  const candidateDate =
    toIsoDateOnly(tanggalSuratState) ||
    getDefaultTanggalSurat(pengajuan, pengajuanData);

  return findNextAvailableSuratDate(candidateDate, pengajuan, pengajuanData);
}
