import { SURAT_CUSTOM_HOLIDAY_CONFIG } from "../config/suratCustomHolidayConfig";
import { SURAT_OFFICIAL_HOLIDAY_CONFIG } from "../config/suratOfficialHolidayConfig";

function pad2(value) {
  return String(value).padStart(2, "0");
}

function toIsoDateOnly(date) {
  const current = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(current.getTime())) return "";

  const year = current.getFullYear();
  const month = pad2(current.getMonth() + 1);
  const day = pad2(current.getDate());

  return `${year}-${month}-${day}`;
}

// function parseIsoDate(dateString = "") {
//   const safeDate = String(dateString || "").slice(0, 10);
//   if (!safeDate) return null;

//   const date = new Date(`${safeDate}T00:00:00`);
//   if (Number.isNaN(date.getTime())) return null;

//   return date;
// }

// function isSunday(dateString = "") {
//   const date = parseIsoDate(dateString);
//   if (!date) return false;

//   return date.getDay() === 0;
// }

function getYearConfig(source, year) {
  if (!source || typeof source !== "object") return null;

  return source[year] || source[String(year)] || null;
}

function extractBlockedDateMap(source, year) {
  const yearConfig = getYearConfig(source, year);
  if (!yearConfig) return {};

  if (yearConfig.dates && typeof yearConfig.dates === "object") {
    return yearConfig.dates;
  }

  if (yearConfig.blockedDates && typeof yearConfig.blockedDates === "object") {
    return yearConfig.blockedDates;
  }

  return {};
}

function getBlockedMessage(dateKey) {
  const year = String(dateKey).slice(0, 4);

  const officialDates = extractBlockedDateMap(
    SURAT_OFFICIAL_HOLIDAY_CONFIG,
    year,
  );

  if (officialDates[dateKey]) {
    return officialDates[dateKey];
  }

  const customDates = extractBlockedDateMap(
    SURAT_CUSTOM_HOLIDAY_CONFIG,
    year,
  );

  if (customDates[dateKey]) {
    return customDates[dateKey];
  }

  return "";
}

export function getCreatePengajuanAvailability(date = new Date()) {
  const dateKey = toIsoDateOnly(date);

  if (!dateKey) {
    return {
      isBlocked: false,
      message: "",
      dateKey: "",
    };
  }

  // if (isSunday(dateKey)) {
  //   return {
  //     isBlocked: true,
  //     message: "Hari Minggu pengajuan tidak dapat dibuat.",
  //     dateKey,
  //   };
  // }

  const blockedMessage = getBlockedMessage(dateKey);

  if (blockedMessage) {
    return {
      isBlocked: true,
      message:
        blockedMessage ||
        "Hari ini pengajuan tidak dapat dibuat karena tanggal sedang diblokir.",
      dateKey,
    };
  }

  return {
    isBlocked: false,
    message: "",
    dateKey,
  };
}