export {
  DOSEN_JENIS_PENGAJUAN_OPTIONS,
  DOSEN_KATEGORI_OPTIONS,
  DOSEN_LAYANAN_OPTIONS,
  MAX_ANGGOTA_KELOMPOK_DOSEN,
} from "./dosenCreatePengajuanConfig";

export {
  getCreatePengajuanFieldConfig,
} from "./dosenCreatePengajuanFieldConfig";

export {
  getRequiredDocumentConfig,
} from "./dosenCreatePengajuanDocumentConfig";

export {
  validateCreatePengajuanForm,
} from "./dosenCreatePengajuanValidation";

export {
  buildCreatePengajuanPayload,
} from "./dosenCreatePengajuanPayload";

export {
  createDateField,
  createDateTimeField,
  createSelectField,
  createTextField,
  createTextareaField,
  getEffectiveJenisPengajuan,
  getEligibleDosenOptions,
  getFileAcceptValue,
  getFileFormatErrorMessage,
  getFileValidationError,
  getInitialCreateFormValues,
  getInitialMemberItem,
  getKategoriOptionsByTahap,
  getSupportedTahapMessage,
  getTempatPkmLabel,
  getTempatPkmPlaceholder,
  getFileExtension,
  isAllowedFileExtension,
  isAllowedFileMimeType,
  isPkmPembicara,
  isPublikasiKategori,
  normalizeText,
  normalizeUpperText,
  toNumberOrEmpty,
  toTitleCase,
} from "./dosenCreatePengajuanUtils";

import { normalizeText, normalizeUpperText, toTitleCase } from "./dosenCreatePengajuanUtils";

export function isKelompokAllowed() {
  return true;
}

export function normalizeCreateFormValues(formValues = {}) {
  return {
    ...formValues,

    bidang_ilmu: toTitleCase(formValues.bidang_ilmu),

    judul_proposal: toTitleCase(formValues.judul_proposal),
    judul_penelitian: toTitleCase(formValues.judul_penelitian),
    no_surat_tugas: normalizeText(formValues.no_surat_tugas),
    tanggal_surat_tugas: String(formValues.tanggal_surat_tugas || "").trim(),
    tanggal_mulai: String(formValues.tanggal_mulai || "").trim(),
    tanggal_selesai: String(formValues.tanggal_selesai || "").trim(),

    nama_institusi_pemohon: toTitleCase(formValues.nama_institusi_pemohon),
    no_surat_permohonan: normalizeText(formValues.no_surat_permohonan),
    tanggal_surat_permohonan: String(
      formValues.tanggal_surat_permohonan || "",
    ).trim(),
    jenis_pkm: normalizeUpperText(formValues.jenis_pkm) || "PEMBICARA",
    judul_pkm: toTitleCase(formValues.judul_pkm),
    judul_materi: toTitleCase(formValues.judul_materi),
    tempat_pelaksanaan: toTitleCase(formValues.tempat_pelaksanaan),
    waktu_pelaksanaan: String(formValues.waktu_pelaksanaan || "").trim(),
    tempat_pkm: toTitleCase(formValues.tempat_pkm),
    sumber_dana: normalizeText(formValues.sumber_dana),
    besar_dana: formValues.besar_dana,

    judul_karya: toTitleCase(formValues.judul_karya),

    judul_artikel: toTitleCase(formValues.judul_artikel),
    nama_jurnal: toTitleCase(formValues.nama_jurnal),
    cakupan_jurnal: normalizeUpperText(formValues.cakupan_jurnal),
    peringkat_jurnal: normalizeUpperText(formValues.peringkat_jurnal),
    volume: normalizeText(formValues.volume),
    nomor: normalizeText(formValues.nomor),
    link_artikel: String(formValues.link_artikel || "").trim(),
    doi: String(formValues.doi || "").trim(),

    judul_buku: toTitleCase(formValues.judul_buku),
    judul_book_chapter: toTitleCase(formValues.judul_book_chapter),
    halaman: normalizeText(formValues.halaman),
    isbn: normalizeText(formValues.isbn),
    link_buku: String(formValues.link_buku || "").trim(),

    tanggal_terbit: String(formValues.tanggal_terbit || "").trim(),
    penerbit: toTitleCase(formValues.penerbit),
  };
}
