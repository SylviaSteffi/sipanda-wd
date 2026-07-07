import {
  CREATE_FORM_DEFAULT_VALUES,
  DOSEN_KATEGORI_OPTIONS,
  MAX_UPLOAD_SIZE_BYTES,
  PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN,
} from "./dosenCreatePengajuanConfig";

const SUPPORTED_TAHAP = ["TUGAS", "KEMAJUAN", "PENGESAHAN"];

function compactSpaces(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function toCapitalizedWord(word = "") {
  const normalized = compactSpaces(word);
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

function getAllowedExtensions(item = {}) {
  return Array.isArray(item.allowedExtensions) ? item.allowedExtensions : [];
}

function getAllowedMimeTypes(item = {}) {
  return Array.isArray(item.allowedMimeTypes) ? item.allowedMimeTypes : [];
}

export function normalizeText(value) {
  return compactSpaces(value);
}

export function normalizeUpperText(value) {
  return compactSpaces(value).toUpperCase();
}

export function toTitleCase(value) {
  const normalized = compactSpaces(value);
  if (!normalized) return "";

  return normalized
    .split(" ")
    .map((word) => toCapitalizedWord(word))
    .join(" ");
}

export function toNumberOrEmpty(value) {
  const normalized = compactSpaces(value);
  if (!normalized) return "";

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? "" : parsed;
}

export function isPublikasiKategori(kategori) {
  const normalized = normalizeUpperText(kategori);
  return normalized === "ARTIKEL" || normalized === "BUKU";
}

export function isPkmPembicara(jenisPkm) {
  return normalizeUpperText(jenisPkm) === "PEMBICARA";
}

export function getTempatPkmLabel(isPembicara) {
  return isPembicara ? "Tempat Pelaksanaan PKM" : "Tempat PKM";
}

export function getTempatPkmPlaceholder(isPembicara) {
  return isPembicara
    ? "Masukkan tempat pelaksanaan PKM"
    : "Masukkan tempat PKM";
}

export function getPeringkatJurnalOptionsByCakupan(cakupanJurnal) {
  return (
    PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN[normalizeUpperText(cakupanJurnal)] || []
  );
}

export function getFileExtension(filename = "") {
  const normalized = compactSpaces(filename).toLowerCase();
  const lastDotIndex = normalized.lastIndexOf(".");
  return lastDotIndex < 0 ? "" : normalized.slice(lastDotIndex + 1);
}

export function isAllowedFileExtension(file, item = {}) {
  const allowedExtensions = getAllowedExtensions(item);
  if (allowedExtensions.length === 0) return true;

  const fileExtension = getFileExtension(file?.name);
  return fileExtension ? allowedExtensions.includes(fileExtension) : false;
}

export function isAllowedFileMimeType(file, item = {}) {
  const allowedMimeTypes = getAllowedMimeTypes(item);
  if (allowedMimeTypes.length === 0) return true;

  const mimeType = compactSpaces(file?.type);
  return mimeType ? allowedMimeTypes.includes(mimeType) : true;
}

export function getFileFormatErrorMessage(item = {}) {
  const allowedExtensions = getAllowedExtensions(item);
  return allowedExtensions.length > 0
    ? `Format file hanya boleh ${allowedExtensions.join("/")}.`
    : "Format file tidak didukung.";
}

export function getFileAcceptValue(item = {}) {
  const extensions = getAllowedExtensions(item).map((ext) => `.${ext}`);
  const mimeTypes = getAllowedMimeTypes(item);
  return [...extensions, ...mimeTypes].join(",");
}

export function getFileValidationError(file, item = {}) {
  if (!file) return "";

  if (!isAllowedFileExtension(file, item) || !isAllowedFileMimeType(file, item)) {
    return getFileFormatErrorMessage(item);
  }

  if (Number(file.size || 0) > MAX_UPLOAD_SIZE_BYTES) {
    return "Ukuran file maksimal 2 MB.";
  }

  return "";
}

export function getKategoriOptionsByTahap(tahap) {
  if (normalizeUpperText(tahap) === "KEMAJUAN") {
    return DOSEN_KATEGORI_OPTIONS.filter(
      (item) => item.value === "PENELITIAN" || item.value === "PKM",
    );
  }

  return DOSEN_KATEGORI_OPTIONS;
}

export function getSupportedTahapMessage(tahap) {
  return SUPPORTED_TAHAP.includes(normalizeUpperText(tahap))
    ? ""
    : "Tahap layanan belum didukung.";
}

export function getEffectiveJenisPengajuan(
  _tahap,
  _kategori,
  jenisPengajuan = "INDIVIDU",
) {
  return normalizeUpperText(jenisPengajuan) === "KELOMPOK"
    ? "KELOMPOK"
    : "INDIVIDU";
}

export function getInitialCreateFormValues() {
  return { ...CREATE_FORM_DEFAULT_VALUES };
}

export function getInitialMemberItem() {
  return { user_id: "" };
}

export function getEligibleDosenOptions(
  usersData = [],
  pemohonUserId,
  otherMemberEntries = [],
  options = {},
) {
  const selectedIds = new Set(
    otherMemberEntries
      .map((item) => String(item?.user_id || "").trim())
      .filter(Boolean),
  );

  const fakultasFilterMode = normalizeUpperText(options.fakultasFilterMode);
  const fakultasId = String(options.fakultasId || "");

  return usersData
    .filter((user) => normalizeUpperText(user?.role) === "DOSEN")
    .filter((user) => String(user.id) !== String(pemohonUserId))
    .filter((user) => !selectedIds.has(String(user.id)))
    .filter((user) => {
      if (fakultasFilterMode !== "SAME_FAKULTAS") return true;
      if (!fakultasId) return true;
      return String(user.fakultas_id || "") === fakultasId;
    })
    .map((user) => ({
      value: String(user.id),
      label: `${user.nama} - ${user.nidn || "-"}`,
    }));
}

function createBaseField(type, config) {
  return {
    type,
    name: config.name,
    label: config.label,
    placeholder: config.placeholder || "",
    helperText: config.helperText || "",
    required: config.required ?? true,
    className: config.className || "",
    ...(config.options ? { options: config.options } : {}),
  };
}

export function createTextField(config) {
  return createBaseField("text", config);
}

export function createTextareaField(config) {
  return createBaseField("textarea", {
    className: "md:col-span-2",
    ...config,
  });
}

export function createSelectField(config) {
  return createBaseField("select", config);
}

export function createDateField(config) {
  return createBaseField("date", config);
}

export function createDateTimeField(config) {
  return createBaseField("datetime-local", config);
}