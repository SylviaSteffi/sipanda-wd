import { getCurrentStageDocuments } from "./documentHelpers";
import {
  getClarificationDocumentConfig,
  getClarificationFieldConfig,
} from "../config/dosenClarificationConfig";
import { MAX_UPLOAD_SIZE_BYTES } from "./dosenCreatePengajuanConfig";
import { toTitleCase } from "./dosenCreatePengajuanUtils";

function isFilled(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function toInputDateTime(value) {
  if (!value) return "";
  return String(value).trim().replace(" ", "T").slice(0, 16);
}

function toSqlDateTime(value) {
  if (!value) return "";
  const normalized = String(value).trim().replace("T", " ");
  return normalized.length === 16 ? `${normalized}:00` : normalized;
}

function trimValue(value) {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value.trim() : value;
}

function getSafeString(value) {
  return value === null || value === undefined ? "" : String(value);
}

function getFileExtensionWithDot(fileName = "") {
  const normalized = String(fileName).trim().toLowerCase();
  const dotIndex = normalized.lastIndexOf(".");
  return dotIndex >= 0 ? normalized.slice(dotIndex) : "";
}

function normalizeExtensions(extensions = []) {
  if (!Array.isArray(extensions)) return [];
  return extensions
    .map((item) =>
      String(item || "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean)
    .map((item) => (item.startsWith(".") ? item : `.${item}`));
}

function parseExtensionsFromAccept(accept = "") {
  return String(accept)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.startsWith("."));
}

function parseMimeTypesFromAccept(accept = "") {
  return String(accept)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.includes("/"));
}

function getAllowedExtensions(slot = {}) {
  const fromConfig = normalizeExtensions(slot.allowedExtensions);
  if (fromConfig.length > 0) return fromConfig;
  return parseExtensionsFromAccept(slot.accept);
}

function getAllowedMimeTypes(slot = {}) {
  const fromConfig = Array.isArray(slot.allowedMimeTypes)
    ? slot.allowedMimeTypes
        .map((item) =>
          String(item || "")
            .trim()
            .toLowerCase(),
        )
        .filter(Boolean)
    : [];
  if (fromConfig.length > 0) return fromConfig;
  return parseMimeTypesFromAccept(slot.accept);
}

function getMaxSizeBytes(slot = {}) {
  const value = Number(slot.maxSizeBytes || 0);
  return value > 0 ? value : MAX_UPLOAD_SIZE_BYTES;
}

function matchesAllowedFileType(slot, file) {
  if (!file) return false;
  const extension = getFileExtensionWithDot(file.name);
  const mimeType = String(file.type || "")
    .trim()
    .toLowerCase();
  const allowedExtensions = getAllowedExtensions(slot);
  const allowedMimeTypes = getAllowedMimeTypes(slot);
  const extensionMatches =
    allowedExtensions.length === 0 || allowedExtensions.includes(extension);
  const mimeMatches =
    allowedMimeTypes.length === 0 ||
    mimeType === "" ||
    allowedMimeTypes.includes(mimeType);
  return extensionMatches && mimeMatches;
}

function getAllowedFormatText(slot = {}) {
  const allowedExtensions = getAllowedExtensions(slot);
  if (allowedExtensions.length === 0) return "format yang diizinkan";
  return allowedExtensions.map((item) => item.replace(".", "")).join("/");
}

function createRequiredMessage(label) {
  return `${label} wajib diisi.`;
}

function createInvalidUrlMessage(label) {
  return `${label} harus berupa URL yang valid.`;
}

function createInvalidDocumentMessage(slot) {
  return `Format file hanya boleh ${getAllowedFormatText(slot)}.`;
}

function createMaxSizeMessage(slot) {
  const maxSizeMb =
    Math.round((getMaxSizeBytes(slot) / (1024 * 1024)) * 100) / 100;
  return `Ukuran file maksimal ${maxSizeMb} MB.`;
}

function createMinNumberMessage(label, minValue) {
  return `${label} tidak boleh kurang dari ${minValue}.`;
}

function getNextDocumentId(dokumen = []) {
  const maxId = dokumen.reduce((max, doc) => {
    const value = Number(doc?.id || 0);
    return value > max ? value : max;
  }, 0);
  return maxId + 1;
}

function countChangedFields(previousDetail = {}, nextDetail = {}) {
  return Object.keys(previousDetail).reduce((total, key) => {
    const previousValue = getSafeString(previousDetail[key]).trim();
    const nextValue = getSafeString(nextDetail[key]).trim();
    if (previousValue !== nextValue) {
      return total + 1;
    }
    return total;
  }, 0);
}

const TITLE_CASE_KEYS = new Set([
  "bidang_ilmu",
  "judul_proposal",
  "judul_penelitian",
  "nama_institusi_pemohon",
  "judul_pkm",
  "judul_materi",
  "tempat_pelaksanaan",
  "tempat_pkm",
  "judul_karya",
  "judul_artikel",
  "nama_jurnal",
  "judul_buku",
  "judul_book_chapter",
  "penerbit",
]);

export function getClarificationEditableFields(pengajuan, values = {}) {
  return getClarificationFieldConfig(pengajuan, values);
}

export function getInitialClarificationFormValues(pengajuan) {
  const detail = pengajuan?.detail || {};
  const result = {};
  Object.entries(detail).forEach(([key, value]) => {
    if (key === "waktu_pelaksanaan") {
      result[key] = toInputDateTime(value);
      return;
    }
    if (key === "besar_dana") {
      result[key] = value === null || value === undefined ? "" : String(value);
      return;
    }
    result[key] = value === null || value === undefined ? "" : String(value);
  });
  return result;
}

export function normalizeClarificationFormValues(pengajuan, values = {}) {
  const detail = pengajuan?.detail || {};
  const normalized = {};
  Object.keys(detail).forEach((key) => {
    const rawValue = values[key];
    if (key === "waktu_pelaksanaan") {
      normalized[key] = toSqlDateTime(rawValue);
      return;
    }
    if (key === "besar_dana") {
      normalized[key] = rawValue === "" ? 0 : Number(rawValue || 0);
      return;
    }
    normalized[key] = TITLE_CASE_KEYS.has(key)
      ? toTitleCase(rawValue)
      : trimValue(rawValue);
  });
  if ("jenis_pkm" in normalized) {
    normalized.jenis_pkm = String(normalized.jenis_pkm || "")
      .trim()
      .toUpperCase();
  }
  return normalized;
}

export function getClarificationStageDocuments(pengajuan) {
  return getCurrentStageDocuments(pengajuan?.dokumen || []);
}

export function getClarificationDocumentSlots(pengajuan, values = {}) {
  const currentStageDocuments = getClarificationStageDocuments(pengajuan);
  const documentConfig = getClarificationDocumentConfig(pengajuan, values);
  return documentConfig.map((item) => {
    const existingDocument =
      currentStageDocuments.find(
        (doc) => doc.kode_dokumen === item.kode_dokumen,
      ) || null;
    return {
      ...item,
      existingDocument,
      isMissing: !existingDocument,
    };
  });
}

export function getClarificationDocumentSelectionError(slot, file) {
  if (!file) return "";
  if (!matchesAllowedFileType(slot, file)) {
    return createInvalidDocumentMessage(slot);
  }
  if (Number(file.size || 0) > getMaxSizeBytes(slot)) {
    return createMaxSizeMessage(slot);
  }
  return "";
}

export function validateClarificationForm(
  pengajuan,
  values = {},
  documentFiles = {},
) {
  const errors = {};
  const visibleFields = getClarificationEditableFields(pengajuan, values);
  const documentSlots = getClarificationDocumentSlots(pengajuan, values);

  visibleFields.forEach((field) => {
    const value = values[field.key];
    if (!field.optional && !isFilled(value)) {
      errors[field.key] = createRequiredMessage(field.label);
      return;
    }
    if (field.type === "url" && isFilled(value)) {
      try {
        new URL(String(value).trim());
      } catch {
        errors[field.key] = createInvalidUrlMessage(field.label);
      }
    }
    if (
      field.type === "number" &&
      isFilled(value) &&
      field.min !== undefined &&
      Number(value) < field.min
    ) {
      errors[field.key] = createMinNumberMessage(field.label, field.min);
    }
  });

  documentSlots.forEach((slot) => {
    const selectedFile = documentFiles[slot.kode_dokumen];
    if (!selectedFile) {
      if (slot.required && slot.isMissing) {
        errors[`dokumen_${slot.kode_dokumen}`] =
          slot.errorMessage || `${slot.label} wajib diunggah.`;
      }
      return;
    }
    const selectionError = getClarificationDocumentSelectionError(
      slot,
      selectedFile,
    );
    if (selectionError) {
      errors[`dokumen_${slot.kode_dokumen}`] = selectionError;
    }
  });

  return errors;
}

export function buildUpdatedClarificationDocuments(
  pengajuan,
  values = {},
  documentFiles = {},
  createdAt,
  base64Files = {},
) {
  const currentDocuments = pengajuan?.dokumen || [];
  const documentSlots = getClarificationDocumentSlots(pengajuan, values);
  const nextDocuments = [...currentDocuments];
  let nextId = getNextDocumentId(currentDocuments);

  documentSlots.forEach((slot) => {
    const selectedFile = documentFiles[slot.kode_dokumen];
    if (!selectedFile) return;

    const nextMimeType =
      getAllowedMimeTypes(slot)[0] ||
      selectedFile.type ||
      "application/octet-stream";

    const fileBase64 = base64Files[slot.kode_dokumen] || "";

    if (slot.existingDocument) {
      const documentIndex = nextDocuments.findIndex(
        (doc) =>
          Number(doc.dokumen_id) === Number(slot.existingDocument.dokumen_id),
      );

      if (documentIndex >= 0) {
        nextDocuments[documentIndex] = {
          ...nextDocuments[documentIndex],
          original_name: selectedFile.name,
          mime_type: nextMimeType,
          file_base64: fileBase64,
          file_size_bytes: Number(selectedFile.size || 0),
          created_at: nextDocuments[documentIndex].created_at || createdAt,
          updated_at: createdAt,
        };
      }

      return;
    }

    nextDocuments.push({
      id: nextId,
      pengajuan_id: pengajuan.id,
      kode_dokumen: slot.kode_dokumen,
      original_name: selectedFile.name,
      mime_type: nextMimeType,
      file_base64: fileBase64,
      file_size_bytes: Number(selectedFile.size || 0),
      created_at: createdAt,
      updated_at: createdAt,
    });

    nextId += 1;
  });

  return nextDocuments;
}

export function buildClarificationResponseMessage(
  pengajuan,
  values = {},
  documentFiles = {},
) {
  const previousDetail = normalizeClarificationFormValues(
    pengajuan,
    pengajuan?.detail || {},
  );
  const nextDetail = normalizeClarificationFormValues(pengajuan, values);
  const changedFieldCount = countChangedFields(previousDetail, nextDetail);
  const changedDocumentCount =
    Object.values(documentFiles).filter(Boolean).length;

  const parts = [];
  if (changedFieldCount > 0) {
    parts.push(`${changedFieldCount} field diperbarui`);
  }
  if (changedDocumentCount > 0) {
    parts.push(`${changedDocumentCount} dokumen diganti`);
  }
  if (parts.length === 0) {
    return "Dosen mengirim revisi klarifikasi.";
  }
  return `Dosen mengirim revisi klarifikasi: ${parts.join(", ")}.`;
}

export function markLatestClarificationAnswered(
  klarifikasiItems = [],
  payload = {},
) {
  let targetId = null;
  [...klarifikasiItems]
    .sort(
      (a, b) =>
        new Date(b?.waktu_minta || 0).getTime() -
        new Date(a?.waktu_minta || 0).getTime(),
    )
    .some((item) => {
      if (item?.status_klarifikasi === "MENUNGGU") {
        targetId = item.klarifikasi_id;
        return true;
      }
      return false;
    });

  if (!targetId) return klarifikasiItems;

  return klarifikasiItems.map((item) =>
    item.klarifikasi_id === targetId
      ? {
          ...item,
          status_klarifikasi: "TERJAWAB",
          waktu_jawab: payload.waktu_jawab || item.waktu_jawab || null,
          pesan_dosen:
            payload.pesan_dosen ||
            item.pesan_dosen ||
            "Dosen mengirim revisi klarifikasi.",
        }
      : item,
  );
}

export function getClarificationFieldValue(values = {}, key) {
  return getSafeString(values[key]);
}
