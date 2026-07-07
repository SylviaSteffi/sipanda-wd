export class DokumenEntity {
  constructor({
    dokumen_id,
    pengajuan_id,
    kode_dokumen,
    original_name,
    mime_type,
    file_base64,
    file_size_bytes,
    createdAt,
    updatedAt,
  }) {
    this.id = dokumen_id;
    this.pengajuan_id = pengajuan_id;
    this.kode_dokumen = kode_dokumen || null;
    this.original_name = original_name;
    this.mime_type = mime_type || null;
    this.file_base64 = file_base64 || null;
    this.file_size_bytes = file_size_bytes || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
