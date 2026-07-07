function normalizeDateValue(value) {
  if (value === null || value === undefined || value === "") return "";

  const str = String(value).trim();

  const isSqlFormat = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(str);

  if (isSqlFormat) {
    return str.replace(" ", "T");
  }

  return str;
}

export function parseDateValue(value) {
  const normalized = normalizeDateValue(value);
  if (!normalized) return null;

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export function getDateTimeValue(value) {
  const date = parseDateValue(value);
  return date ? date.getTime() : 0;
}

export function sortByDateDesc(items = [], getValue = (item) => item) {
  return [...items].sort(
    (a, b) => getDateTimeValue(getValue(b)) - getDateTimeValue(getValue(a)),
  );
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

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

export function formatDateOnly(value) {
  const date = parseDateValue(value);
  if (!date) return "-";

  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateTime(value) {
  const date = parseDateValue(value);
  if (!date) return "-";

  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());

  return `${day} ${month} ${year}, ${hours}.${minutes}`;
}

export function getNowSqlDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = pad2(now.getMonth() + 1);
  const day = pad2(now.getDate());
  const hours = pad2(now.getHours());
  const minutes = pad2(now.getMinutes());
  const seconds = pad2(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
