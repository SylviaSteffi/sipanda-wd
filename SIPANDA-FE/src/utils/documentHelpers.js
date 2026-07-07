function toDataUrlFromBase64(doc) {
  if (!doc?.file_base64 || !doc?.mime_type) return "";
  return `data:${doc.mime_type};base64,${doc.file_base64}`;
}

function openBlobUrl(blob) {
  const blobUrl = URL.createObjectURL(blob);
  const newWindow = window.open(blobUrl, "_blank", "noopener,noreferrer");

  if (!newWindow) {
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
  }

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);

  return blobUrl;
}

function triggerDownloadUrl(url, fileName = "dokumen") {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function normalizeMimeType(doc) {
  return doc?.mime_type || "application/octet-stream";
}

function normalizeFileName(doc) {
  return doc?.original_name || "dokumen";
}

function isPdfMime(mimeType = "") {
  return String(mimeType).toLowerCase() === "application/pdf";
}

function isImageMime(mimeType = "") {
  return String(mimeType).toLowerCase().startsWith("image/");
}

function isValidDocument(doc) {
  return Boolean(doc?.kode_dokumen && doc?.original_name);
}

const FINAL_DOCUMENT_CODES = ["SURAT_FINAL"];

const PREVIOUS_STAGE_DOCUMENT_CODES = [
  "PROPOSAL",
  "LAPORAN_KEMAJUAN",
  "LAPORAN_KEMAJUAN_PKM",
  "SURAT_TUGAS_PENELITIAN",
  "SURAT_TUGAS_PKM",
  "SURAT_TUGAS_ARTIKEL",
  "SURAT_TUGAS_BUKU",
  "SURAT_PERMOHONAN",
  "SURAT_UNDANGAN_PKM",
  "PROPOSAL_PKM",
  "MATERI_DISAMPAIKAN",
  "ARTIKEL",
  "NASKAH_BUKU",
  "SURAT_FINAL"
];

const CURRENT_STAGE_HIDDEN_DOCUMENT_CODES = [
  "SURAT_FINAL",
  "SURAT_TUGAS_PENELITIAN",
  "SURAT_TUGAS_PKM",
  "SURAT_TUGAS_ARTIKEL",
  "SURAT_TUGAS_BUKU",
];

export function canPreviewStoredDoc(doc) {
  if (!doc) return false;

  const mimeType = normalizeMimeType(doc);

  if (doc.file_base64) {
    return isPdfMime(mimeType) || isImageMime(mimeType);
  }

  if (doc.url) {
    return isPdfMime(mimeType) || isImageMime(mimeType);
  }

  return false;
}

export function canPreviewSelectedFile(file) {
  if (!file) return false;
  return isPdfMime(file.type) || isImageMime(file.type);
}

export function previewStoredDoc(doc) {
  if (!doc) return;

  if (doc.file_base64) {
    const mimeType = normalizeMimeType(doc);

    const byteChars = atob(doc.file_base64);
    const byteNumbers = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: mimeType });
    openBlobUrl(blob);
    return;
  }

  if (doc.url) {
    window.open(doc.url, "_blank", "noopener,noreferrer");
  }
}
export function downloadStoredDoc(doc) {
  if (!doc) return;

  const fileName = normalizeFileName(doc);
  const mimeType = normalizeMimeType(doc);

  if (doc.file_base64) {
    const dataUrl = toDataUrlFromBase64(doc);
    if (dataUrl) {
      triggerDownloadUrl(dataUrl, fileName);
      return;
    }
  }

  if (doc.url) {
    triggerDownloadUrl(doc.url, fileName);
    return;
  }

  const fallbackBlob = new Blob([], { type: mimeType });
  const blobUrl = URL.createObjectURL(fallbackBlob);
  triggerDownloadUrl(blobUrl, fileName);

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 10000);
}

export function previewSelectedFile(file) {
  if (!file || !canPreviewSelectedFile(file)) return;

  const blob = new Blob([file], {
    type: file.type || "application/octet-stream",
  });

  openBlobUrl(blob);
}

export function downloadSelectedFile(file) {
  if (!file) return;

  const blob = new Blob([file], {
    type: file.type || "application/octet-stream",
  });

  const blobUrl = URL.createObjectURL(blob);
  triggerDownloadUrl(blobUrl, file.name || "dokumen");

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 10000);
}

export function getCurrentStageDocuments(dokumen = []) {
  const safeDocuments = Array.isArray(dokumen) ? dokumen : [];

  return safeDocuments.filter((item) => {
    if (!isValidDocument(item)) return false;

    return !CURRENT_STAGE_HIDDEN_DOCUMENT_CODES.includes(item.kode_dokumen);
  });
}

export function getPreviousStageDocuments(dokumen = []) {
  const safeDocuments = Array.isArray(dokumen) ? dokumen : [];

  return safeDocuments.filter((item) => {
    if (!isValidDocument(item)) return false;

    return PREVIOUS_STAGE_DOCUMENT_CODES.includes(item.kode_dokumen);
  });
}

export function getFinalDocument(dokumen = []) {
  const safeDocuments = Array.isArray(dokumen) ? dokumen : [];

  return (
    safeDocuments.find(
      (item) =>
        isValidDocument(item) &&
        FINAL_DOCUMENT_CODES.includes(item.kode_dokumen),
    ) || null
  );
}