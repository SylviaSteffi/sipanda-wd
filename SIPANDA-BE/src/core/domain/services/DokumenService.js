const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB per file

export class DokumenService {
  validateAndPrepare(dokumenList = []) {
    const errors = [];

    for (const doc of dokumenList) {
      if (!doc.original_name) {
        errors.push(
          `Dokumen dengan kode ${doc.kode_dokumen} tidak memiliki nama file.`,
        );
      }
      if (!doc.file_base64) {
        errors.push(
          `Dokumen ${doc.original_name || doc.kode_dokumen} tidak memiliki konten.`,
        );
      }
      if (doc.mime_type && !ALLOWED_MIME_TYPES.includes(doc.mime_type)) {
        errors.push(
          `Tipe file ${doc.mime_type} tidak diizinkan untuk dokumen ${doc.original_name}.`,
        );
      }
      if (doc.file_size_bytes && doc.file_size_bytes > MAX_FILE_SIZE_BYTES) {
        errors.push(`Ukuran file ${doc.original_name} melebihi batas 2MB.`);
      }
    }

    if (errors.length > 0) {
      const err = new Error(errors.join(" | "));
      err.name = "DOKUMEN_VALIDATION_ERROR";
      err.statusCode = 422;
      err.details = errors;
      throw err;
    }

    return dokumenList.map((doc) => ({
      kode_dokumen: doc.kode_dokumen || null,
      original_name: doc.original_name,
      mime_type: doc.mime_type || null,
      file_base64: doc.file_base64,
      file_size_bytes: Number(doc.file_size_bytes || 0),
    }));
  }
}