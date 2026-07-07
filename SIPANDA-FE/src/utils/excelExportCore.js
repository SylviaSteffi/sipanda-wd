import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const EMPTY_EXPORT_VALUE = "-";

export function isFilledExportValue(value) {
  return value !== null && value !== undefined && value !== "";
}

export function getExportValue(value) {
  return isFilledExportValue(value) ? value : EMPTY_EXPORT_VALUE;
}

function removeControlCharacters(value) {
  return String(value || "")
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("");
}

function sanitizeSheetName(value) {
  const sanitized = removeControlCharacters(value)
    .replace(/[\\/*?:[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized.slice(0, 31) || "Sheet1";
}

function sanitizeFileName(value) {
  const invalidChars = ["<", ">", ":", '"', "/", "\\", "|", "?", "*"];

  const cleaned = removeControlCharacters(value)
    .split("")
    .map((char) => (invalidChars.includes(char) ? " " : char))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || "export";
}

function isHyperlinkValue(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.text === "string" &&
    typeof value.hyperlink === "string"
  );
}

function getPlainWorksheetValue(value) {
  if (isHyperlinkValue(value)) {
    return value.text;
  }

  return value ?? EMPTY_EXPORT_VALUE;
}

function getWorksheetCellAddress(rowIndex, columnIndex) {
  return XLSX.utils.encode_cell({
    r: rowIndex + 1,
    c: columnIndex,
  });
}

function getExportCellLength(value) {
  if (isHyperlinkValue(value)) {
    return String(value.text || "").length;
  }

  return String(value ?? "").length;
}

function getDynamicColumns(rows = []) {
  if (!rows.length) return [];

  return Object.keys(rows[0]).map((key) => ({
    key,
    header: key,
    width: Math.max(
      String(key).length + 2,
      ...rows.map((row) => getExportCellLength(row[key]) + 2),
    ),
  }));
}

function autoFitWorksheetColumns(worksheet, columns = []) {
  worksheet["!cols"] = columns.map((column) => ({
    wch: Math.max(String(column.header || "").length + 2, column.width || 14),
  }));
}

function applyWorksheetHyperlinks(worksheet, rows = [], columns = []) {
  rows.forEach((row, rowIndex) => {
    columns.forEach((column, columnIndex) => {
      const value = row[column.key];

      if (!isHyperlinkValue(value)) return;

      const cellAddress = getWorksheetCellAddress(rowIndex, columnIndex);
      const cell = worksheet[cellAddress];

      if (!cell) return;

      cell.l = {
        Target: value.hyperlink,
        Tooltip: `Buka ${value.text}`,
      };
    });
  });
}

function buildWorksheet(rows = [], columns = []) {
  const worksheetRows = rows.map((row) => {
    const result = {};

    columns.forEach((column) => {
      result[column.header] = getPlainWorksheetValue(row[column.key]);
    });

    return result;
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetRows);

  applyWorksheetHyperlinks(worksheet, rows, columns);
  autoFitWorksheetColumns(worksheet, columns);

  return worksheet;
}

export function createExportLink(text, url) {
  const safeText = getExportValue(text);
  const safeUrl = String(url || "").trim();

  if (!safeUrl || safeText === EMPTY_EXPORT_VALUE) {
    return safeText;
  }

  return {
    text: safeText,
    hyperlink: safeUrl,
  };
}

export function downloadWorkbook({ rows = [], sheetName, fileName }) {
  const columns = getDynamicColumns(rows);
  const workbook = XLSX.utils.book_new();
  const worksheet = buildWorksheet(rows, columns);

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sanitizeSheetName(sheetName),
  );

  const workbookArray = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([workbookArray], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, sanitizeFileName(fileName));
}