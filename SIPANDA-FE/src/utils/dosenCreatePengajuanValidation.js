import {
  FIELD_ERROR_MESSAGES,
  MAX_ANGGOTA_KELOMPOK_DOSEN,
} from "./dosenCreatePengajuanConfig";
import {
  getFileValidationError,
  isPkmPembicara,
  isPublikasiKategori,
} from "./dosenCreatePengajuanUtils";

function validateRequiredField(errors, key, value, message) {
  if (!value) {
    errors[key] = message;
  }
}

function validateFileSizeAndType(file, item, errors, errorKey) {
  if (!file) return;
  const validationError = getFileValidationError(file, item);
  if (validationError) {
    errors[errorKey] = validationError;
  }
}

function isDigitsOrDash(value) {
  return /^[0-9-]+$/.test(String(value || "").trim());
}

function validatePenelitianByTahap(tahap, formValues, errors) {
  validateRequiredField(
    errors,
    "bidang_ilmu",
    formValues.bidang_ilmu,
    FIELD_ERROR_MESSAGES.bidang_ilmu,
  );

  if (tahap === "TUGAS") {
    validateRequiredField(
      errors,
      "judul_proposal",
      formValues.judul_proposal,
      FIELD_ERROR_MESSAGES.judul_proposal_penelitian,
    );
  }

  if (tahap === "KEMAJUAN") {
    validateRequiredField(
      errors,
      "judul_penelitian",
      formValues.judul_penelitian,
      FIELD_ERROR_MESSAGES.judul_penelitian,
    );
    validateRequiredField(
      errors,
      "tanggal_surat_tugas",
      formValues.tanggal_surat_tugas,
      FIELD_ERROR_MESSAGES.tanggal_surat_tugas_penelitian,
    );
    validateRequiredField(
      errors,
      "no_surat_tugas",
      formValues.no_surat_tugas,
      FIELD_ERROR_MESSAGES.no_surat_tugas,
    );
  }

  if (tahap === "PENGESAHAN") {
    validateRequiredField(
      errors,
      "judul_penelitian",
      formValues.judul_penelitian,
      FIELD_ERROR_MESSAGES.judul_penelitian,
    );
    validateRequiredField(
      errors,
      "no_surat_tugas",
      formValues.no_surat_tugas,
      FIELD_ERROR_MESSAGES.no_surat_tugas,
    );
    validateRequiredField(
      errors,
      "tanggal_mulai",
      formValues.tanggal_mulai,
      FIELD_ERROR_MESSAGES.tanggal_mulai_surat_tugas,
    );
    validateRequiredField(
      errors,
      "tanggal_selesai",
      formValues.tanggal_selesai,
      FIELD_ERROR_MESSAGES.tanggal_selesai,
    );
  }
}

function validatePkmByTahap(tahap, formValues, errors) {
  const isPembicara = isPkmPembicara(formValues.jenis_pkm);

  validateRequiredField(
    errors,
    "bidang_ilmu",
    formValues.bidang_ilmu,
    FIELD_ERROR_MESSAGES.bidang_ilmu,
  );

  if (tahap === "TUGAS") {
    validateRequiredField(
      errors,
      "nama_institusi_pemohon",
      formValues.nama_institusi_pemohon,
      FIELD_ERROR_MESSAGES.nama_institusi_pemohon,
    );
    validateRequiredField(
      errors,
      "no_surat_permohonan",
      formValues.no_surat_permohonan,
      FIELD_ERROR_MESSAGES.no_surat_permohonan,
    );
    validateRequiredField(
      errors,
      "tanggal_surat_permohonan",
      formValues.tanggal_surat_permohonan,
      FIELD_ERROR_MESSAGES.tanggal_surat_permohonan,
    );
    validateRequiredField(
      errors,
      "jenis_pkm",
      formValues.jenis_pkm,
      FIELD_ERROR_MESSAGES.jenis_pkm,
    );
    validateRequiredField(
      errors,
      "judul_pkm",
      formValues.judul_pkm,
      FIELD_ERROR_MESSAGES.judul_pkm,
    );
    validateRequiredField(
      errors,
      "tempat_pelaksanaan",
      formValues.tempat_pelaksanaan,
      isPembicara
        ? FIELD_ERROR_MESSAGES.tempat_pelaksanaan_pkm
        : FIELD_ERROR_MESSAGES.tempat_pkm,
    );
    validateRequiredField(
      errors,
      "waktu_pelaksanaan",
      formValues.waktu_pelaksanaan,
      FIELD_ERROR_MESSAGES.waktu_pelaksanaan,
    );
    validateRequiredField(
      errors,
      "sumber_dana",
      formValues.sumber_dana,
      FIELD_ERROR_MESSAGES.sumber_dana,
    );
    if (
      formValues.besar_dana === "" ||
      formValues.besar_dana === null ||
      formValues.besar_dana === undefined
    ) {
      errors.besar_dana = FIELD_ERROR_MESSAGES.besar_dana;
    }
    if (isPembicara) {
      validateRequiredField(
        errors,
        "judul_materi",
        formValues.judul_materi,
        FIELD_ERROR_MESSAGES.judul_materi,
      );
    }
  }

  if (tahap === "KEMAJUAN") {
    validateRequiredField(
      errors,
      "judul_pkm",
      formValues.judul_pkm,
      FIELD_ERROR_MESSAGES.judul_pkm,
    );
    validateRequiredField(
      errors,
      "no_surat_tugas",
      formValues.no_surat_tugas,
      FIELD_ERROR_MESSAGES.no_surat_tugas_pkm,
    );
    validateRequiredField(
      errors,
      "tanggal_surat_tugas",
      formValues.tanggal_surat_tugas,
      FIELD_ERROR_MESSAGES.tanggal_surat_tugas_pkm,
    );
    validateRequiredField(
      errors,
      "tempat_pkm",
      formValues.tempat_pkm,
      FIELD_ERROR_MESSAGES.tempat_pkm,
    );
  }

  if (tahap === "PENGESAHAN") {
    validateRequiredField(
      errors,
      "no_surat_tugas",
      formValues.no_surat_tugas,
      FIELD_ERROR_MESSAGES.no_surat_tugas_pkm,
    );
    validateRequiredField(
      errors,
      "jenis_pkm",
      formValues.jenis_pkm,
      FIELD_ERROR_MESSAGES.jenis_pkm,
    );
    if (isPembicara) {
      validateRequiredField(
        errors,
        "judul_materi",
        formValues.judul_materi,
        FIELD_ERROR_MESSAGES.judul_materi,
      );
    } else {
      validateRequiredField(
        errors,
        "judul_pkm",
        formValues.judul_pkm,
        FIELD_ERROR_MESSAGES.judul_pkm,
      );
    }
    validateRequiredField(
      errors,
      "tempat_pelaksanaan",
      formValues.tempat_pelaksanaan,
      isPembicara
        ? FIELD_ERROR_MESSAGES.tempat_pelaksanaan_pkm
        : FIELD_ERROR_MESSAGES.tempat_pkm,
    );
    validateRequiredField(
      errors,
      "waktu_pelaksanaan",
      formValues.waktu_pelaksanaan,
      FIELD_ERROR_MESSAGES.waktu_pelaksanaan,
    );
  }
}

function validateArtikelByTahap(tahap, formValues, errors) {
  validateRequiredField(
    errors,
    "bidang_ilmu",
    formValues.bidang_ilmu,
    FIELD_ERROR_MESSAGES.bidang_ilmu,
  );

  if (tahap === "TUGAS") {
    validateRequiredField(
      errors,
      "judul_karya",
      formValues.judul_karya,
      FIELD_ERROR_MESSAGES.judul_karya_artikel,
    );
    validateRequiredField(
      errors,
      "tanggal_mulai",
      formValues.tanggal_mulai,
      FIELD_ERROR_MESSAGES.tanggal_mulai,
    );
  }

  if (tahap === "PENGESAHAN") {
    validateRequiredField(
      errors,
      "judul_artikel",
      formValues.judul_artikel,
      FIELD_ERROR_MESSAGES.judul_artikel,
    );
    validateRequiredField(
      errors,
      "tanggal_mulai",
      formValues.tanggal_mulai,
      FIELD_ERROR_MESSAGES.tanggal_mulai_menulis,
    );
    validateRequiredField(
      errors,
      "tanggal_terbit",
      formValues.tanggal_terbit,
      FIELD_ERROR_MESSAGES.tanggal_terbit_artikel,
    );
    validateRequiredField(
      errors,
      "penerbit",
      formValues.penerbit,
      FIELD_ERROR_MESSAGES.penerbit_jurnal,
    );
    validateRequiredField(
      errors,
      "link_artikel",
      formValues.link_artikel,
      FIELD_ERROR_MESSAGES.link_artikel,
    );
    validateRequiredField(
      errors,
      "nama_jurnal",
      formValues.nama_jurnal,
      FIELD_ERROR_MESSAGES.nama_jurnal,
    );
    validateRequiredField(
      errors,
      "cakupan_jurnal",
      formValues.cakupan_jurnal,
      FIELD_ERROR_MESSAGES.cakupan_jurnal,
    );
    validateRequiredField(
      errors,
      "peringkat_jurnal",
      formValues.peringkat_jurnal,
      FIELD_ERROR_MESSAGES.peringkat_jurnal,
    );
    validateRequiredField(
      errors,
      "volume",
      formValues.volume,
      FIELD_ERROR_MESSAGES.volume,
    );
    validateRequiredField(
      errors,
      "nomor",
      formValues.nomor,
      FIELD_ERROR_MESSAGES.nomor,
    );
    validateRequiredField(
      errors,
      "doi",
      formValues.doi,
      FIELD_ERROR_MESSAGES.doi,
    );
    validateRequiredField(
      errors,
      "no_surat_tugas",
      formValues.no_surat_tugas,
      FIELD_ERROR_MESSAGES.no_surat_tugas,
    );
  }
}

function validateBukuByTahap(tahap, formValues, errors) {
  validateRequiredField(
    errors,
    "bidang_ilmu",
    formValues.bidang_ilmu,
    FIELD_ERROR_MESSAGES.bidang_ilmu,
  );

  if (tahap === "TUGAS") {
    validateRequiredField(
      errors,
      "judul_karya",
      formValues.judul_karya,
      FIELD_ERROR_MESSAGES.judul_karya_buku,
    );
    validateRequiredField(
      errors,
      "tanggal_mulai",
      formValues.tanggal_mulai,
      FIELD_ERROR_MESSAGES.tanggal_mulai,
    );
  }

  if (tahap === "PENGESAHAN") {
    validateRequiredField(
      errors,
      "judul_buku",
      formValues.judul_buku,
      FIELD_ERROR_MESSAGES.judul_buku,
    );
    validateRequiredField(
      errors,
      "judul_book_chapter",
      formValues.judul_book_chapter,
      FIELD_ERROR_MESSAGES.judul_book_chapter,
    );
    validateRequiredField(
      errors,
      "tanggal_mulai",
      formValues.tanggal_mulai,
      FIELD_ERROR_MESSAGES.tanggal_mulai_menulis,
    );
    validateRequiredField(
      errors,
      "tanggal_terbit",
      formValues.tanggal_terbit,
      FIELD_ERROR_MESSAGES.tanggal_terbit_buku,
    );
    validateRequiredField(
      errors,
      "penerbit",
      formValues.penerbit,
      FIELD_ERROR_MESSAGES.penerbit_buku,
    );
    validateRequiredField(
      errors,
      "halaman",
      formValues.halaman,
      FIELD_ERROR_MESSAGES.halaman,
    );
    validateRequiredField(
      errors,
      "isbn",
      formValues.isbn,
      FIELD_ERROR_MESSAGES.isbn,
    );
    validateRequiredField(
      errors,
      "no_surat_tugas",
      formValues.no_surat_tugas,
      FIELD_ERROR_MESSAGES.no_surat_tugas,
    );

    if (formValues.halaman && !isDigitsOrDash(formValues.halaman)) {
      errors.halaman = "Halaman hanya boleh angka dan tanda -.";
    }
    if (formValues.isbn && !isDigitsOrDash(formValues.isbn)) {
      errors.isbn = "ISBN hanya boleh angka dan tanda -.";
    }
  }
}

function validatePublikasiByTahap(tahap, kategori, formValues, errors) {
  if (kategori === "ARTIKEL") {
    validateArtikelByTahap(tahap, formValues, errors);
    return;
  }
  if (kategori === "BUKU") {
    validateBukuByTahap(tahap, formValues, errors);
  }
}

export function validateCreatePengajuanForm({
  tahap,
  kategori,
  jenisPengajuan,
  formValues,
  memberEntries = [],
  requiredDocuments = [],
  documentFiles = {},
}) {
  const errors = {};

  if (!["TUGAS", "KEMAJUAN", "PENGESAHAN"].includes(tahap)) {
    errors.form = "Tahap pengajuan yang dipilih belum didukung.";
    return errors;
  }

  if (kategori === "PENELITIAN") {
    validatePenelitianByTahap(tahap, formValues, errors);
  }
  if (kategori === "PKM") {
    validatePkmByTahap(tahap, formValues, errors);
  }
  if (isPublikasiKategori(kategori)) {
    validatePublikasiByTahap(tahap, kategori, formValues, errors);
  }

  if (jenisPengajuan === "KELOMPOK") {
    const selectedMembers = memberEntries.filter((item) =>
      String(item?.user_id || "").trim(),
    );
    if (selectedMembers.length === 0) {
      errors.anggota =
        "Minimal 1 anggota dosen wajib dipilih untuk pengajuan kelompok.";
    } else if (selectedMembers.length > MAX_ANGGOTA_KELOMPOK_DOSEN) {
      errors.anggota = `Maksimal ${MAX_ANGGOTA_KELOMPOK_DOSEN} anggota dosen dapat dipilih.`;
    }
  }

  requiredDocuments.forEach((item) => {
    const file = documentFiles[item.code];
    if (item.required && !file) {
      errors[`doc_${item.code}`] =
        item.errorMessage || `${item.label} wajib diunggah.`;
      return;
    }
    validateFileSizeAndType(file, item, errors, `doc_${item.code}`);
  });

  return errors;
}
