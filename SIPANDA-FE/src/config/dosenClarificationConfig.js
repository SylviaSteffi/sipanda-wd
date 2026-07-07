import { getCreatePengajuanFieldConfig } from "../utils/dosenCreatePengajuanFieldConfig";
import { getRequiredDocumentConfig } from "../utils/dosenCreatePengajuanDocumentConfig";
import { MAX_UPLOAD_SIZE_BYTES } from "../utils/dosenCreatePengajuanConfig";

function isOptionalField(field = {}) {
  if (typeof field.required === "boolean") {
    return !field.required;
  }

  const helperText = String(field.helperText || "").trim().toLowerCase();
  return helperText.includes("opsional");
}

function mapCreateFieldToClarificationField(field) {
  return {
    key: field.name,
    label: field.label,
    type: field.type || "text",
    placeholder: field.placeholder || "",
    options: field.options || [],
    helperText: field.helperText || "",
    required: !isOptionalField(field),
    optional: isOptionalField(field),
    fullWidth:
      String(field.className || "").includes("md:col-span-2") ||
      field.type === "textarea",
    min: field.min,
  };
}

function mapCreateDocumentToClarificationDocument(documentConfig) {
  return {
    kode_dokumen: documentConfig.code,
    label: documentConfig.label,
    uploadLabel: documentConfig.label,
    helperText:
      documentConfig.helperText ||
      documentConfig.description ||
      "Format file: pdf. Maksimal 2 MB.",
    errorMessage: documentConfig.errorMessage || "",
    required: Boolean(documentConfig.required),
    accept:
      documentConfig.accept ||
      documentConfig.fileAccept ||
      documentConfig.inputAccept ||
      "",
    allowedExtensions:
      documentConfig.allowedExtensions ||
      documentConfig.extensions ||
      documentConfig.fileExtensions ||
      [],
    allowedMimeTypes:
      documentConfig.allowedMimeTypes ||
      documentConfig.mimeTypes ||
      documentConfig.fileMimeTypes ||
      [],
    maxSizeBytes:
      documentConfig.maxSizeBytes ||
      documentConfig.maxFileSizeBytes ||
      documentConfig.sizeLimitBytes ||
      documentConfig.maxSize ||
      MAX_UPLOAD_SIZE_BYTES,
  };
}

export function getClarificationFieldConfig(pengajuan, formValues = {}) {
  if (!pengajuan) return [];

  return getCreatePengajuanFieldConfig(
    pengajuan.tahap,
    pengajuan.kategori,
    formValues,
  ).map(mapCreateFieldToClarificationField);
}

export function getClarificationDocumentConfig(pengajuan, formValues = {}) {
  if (!pengajuan) return [];

  return getRequiredDocumentConfig(
    pengajuan.tahap,
    pengajuan.kategori,
    formValues,
  ).map(mapCreateDocumentToClarificationDocument);
}

export function getClarificationDocumentCodes(pengajuan, formValues = {}) {
  return getClarificationDocumentConfig(pengajuan, formValues).map(
    (item) => item.kode_dokumen,
  );
}