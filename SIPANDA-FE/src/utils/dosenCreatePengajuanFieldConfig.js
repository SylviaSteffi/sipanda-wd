import {
  CAKUPAN_JURNAL_OPTIONS,
  JENIS_PKM_OPTIONS,
} from "./dosenCreatePengajuanConfig";
import {
  createDateField,
  createDateTimeField,
  createSelectField,
  createTextField,
  createTextareaField,
  getPeringkatJurnalOptionsByCakupan,
  getTempatPkmLabel,
  getTempatPkmPlaceholder,
  isPkmPembicara,
} from "./dosenCreatePengajuanUtils";

function getTugasPenelitianFieldConfig() {
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createTextareaField({
      name: "judul_proposal",
      label: "Judul Proposal Penelitian yang Sudah Disetujui",
      placeholder: "Masukkan judul proposal penelitian",
    }),
  ];
}

function getKemajuanPenelitianFieldConfig() {
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createTextareaField({
      name: "judul_penelitian",
      label: "Judul Penelitian",
      placeholder: "Masukkan judul penelitian",
    }),
    createTextField({
      name: "no_surat_tugas",
      label: "Nomor Surat Tugas Penelitian",
      placeholder: "Masukkan nomor surat tugas penelitian",
    }),
    createDateField({
      name: "tanggal_surat_tugas",
      label: "Tanggal Surat Tugas Penelitian",
    }),
  ];
}

function getPengesahanPenelitianFieldConfig() {
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createTextareaField({
      name: "judul_penelitian",
      label: "Judul Penelitian",
      placeholder: "Masukkan judul penelitian",
    }),
    createTextField({
      name: "no_surat_tugas",
      label: "Nomor Surat Tugas",
      placeholder: "Masukkan nomor surat tugas",
      className: "md:col-span-2",
    }),
    createDateField({
      name: "tanggal_mulai",
      label: "Tanggal Mulai / Tanggal Surat Tugas",
    }),
    createDateField({
      name: "tanggal_selesai",
      label: "Tanggal Selesai",
    }),
  ];
}

function getTugasPkmFieldConfig(formValues = {}) {
  const isPembicara = isPkmPembicara(formValues.jenis_pkm);
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createTextField({
      name: "nama_institusi_pemohon",
      label: "Nama Institusi Pemohon",
      placeholder: "Masukkan nama institusi pemohon",
    }),
    createTextField({
      name: "no_surat_permohonan",
      label: "No Surat Permohonan",
      placeholder: "Masukkan nomor surat permohonan",
    }),
    createDateField({
      name: "tanggal_surat_permohonan",
      label: "Tanggal Surat Permohonan",
    }),
    createSelectField({
      name: "jenis_pkm",
      label: "Jenis PKM",
      options: JENIS_PKM_OPTIONS,
    }),
    createTextareaField({
      name: "judul_pkm",
      label: "Judul PKM",
      placeholder: "Masukkan judul PKM",
    }),
    ...(isPembicara
      ? [
          createTextareaField({
            name: "judul_materi",
            label: "Judul Materi yang Disampaikan",
            placeholder: "Masukkan judul materi yang disampaikan",
          }),
        ]
      : []),
    createTextField({
      name: "tempat_pelaksanaan",
      label: getTempatPkmLabel(isPembicara),
      placeholder: getTempatPkmPlaceholder(isPembicara),
    }),
    createDateTimeField({
      name: "waktu_pelaksanaan",
      label: "Waktu Pelaksanaan PKM",
    }),
    createTextField({
      name: "sumber_dana",
      label: "Sumber Dana PKM",
      placeholder: "Masukkan sumber dana PKM",
    }),
    {
      ...createTextField({
        name: "besar_dana",
        label: "Besar Dana PKM",
        placeholder: "Masukkan besar dana PKM",
      }),
      type: "number",
    },
  ];
}

function getKemajuanPkmFieldConfig() {
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createTextareaField({
      name: "judul_pkm",
      label: "Judul PKM",
      placeholder: "Masukkan judul PKM",
    }),
    createTextField({
      name: "no_surat_tugas",
      label: "Nomor Surat Tugas PKM",
      placeholder: "Masukkan nomor surat tugas PKM",
    }),
    createDateField({
      name: "tanggal_surat_tugas",
      label: "Tanggal Surat Tugas PKM",
    }),
    createTextField({
      name: "tempat_pkm",
      label: "Tempat PKM",
      placeholder: "Masukkan tempat PKM",
      className: "md:col-span-2",
    }),
  ];
}

function getPengesahanPkmFieldConfig(formValues = {}) {
  const isPembicara = isPkmPembicara(formValues.jenis_pkm);
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
    }),
    createTextField({
      name: "no_surat_tugas",
      label: "Nomor Surat Tugas PKM",
      placeholder: "Masukkan nomor surat tugas PKM",
    }),
    createSelectField({
      name: "jenis_pkm",
      label: "Jenis PKM",
      options: JENIS_PKM_OPTIONS,
      className: "md:col-span-2",
    }),
    ...(isPembicara
      ? [
          createTextareaField({
            name: "judul_materi",
            label: "Judul Materi yang Disampaikan",
            placeholder: "Masukkan judul materi yang disampaikan",
          }),
        ]
      : [
          createTextareaField({
            name: "judul_pkm",
            label: "Judul PKM",
            placeholder: "Masukkan judul PKM",
          }),
        ]),
    createTextField({
      name: "tempat_pelaksanaan",
      label: getTempatPkmLabel(isPembicara),
      placeholder: getTempatPkmPlaceholder(isPembicara),
    }),
    createDateTimeField({
      name: "waktu_pelaksanaan",
      label: "Waktu Pelaksanaan PKM",
    }),
  ];
}

function getTugasPublikasiFieldConfig(kategori) {
  const isBuku = kategori === "BUKU";
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createTextareaField({
      name: "judul_karya",
      label: isBuku ? "Judul Buku" : "Judul Artikel/Jurnal Ilmiah",
      placeholder: isBuku
        ? "Masukkan judul buku"
        : "Masukkan judul artikel/jurnal ilmiah",
    }),
    createDateField({
      name: "tanggal_mulai",
      label: isBuku ? "Tanggal Mulai Menulis Buku" : "Tanggal Mulai Menulis",
      className: "md:col-span-2",
    }),
  ];
}

function getPengesahanArtikelFieldConfig(formValues = {}) {
  const peringkatJurnalOptions = getPeringkatJurnalOptionsByCakupan(
    formValues.cakupan_jurnal,
  );

  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createDateField({
      name: "tanggal_mulai",
      label: "Tanggal Mulai Menulis Artikel",
    }),
    createTextField({
      name: "no_surat_tugas",
      label: "Nomor Surat Tugas",
      placeholder: "Masukkan nomor surat tugas",
      // helperText: "Opsional",
      // required: false,
    }),
    createTextareaField({
      name: "judul_artikel",
      label: "Judul Artikel/Jurnal Ilmiah",
      placeholder: "Masukkan judul artikel/jurnal ilmiah",
    }),
    createTextField({
      name: "nama_jurnal",
      label: "Nama Jurnal",
      placeholder: "Masukkan nama jurnal",
    }),
    createSelectField({
      name: "cakupan_jurnal",
      label: "Cakupan Jurnal/Prosiding",
      options: CAKUPAN_JURNAL_OPTIONS,
    }),
    createSelectField({
      name: "peringkat_jurnal",
      label: "Indeks/Peringkat",
      options: peringkatJurnalOptions,
    }),
    createTextField({
      name: "volume",
      label: "Volume Jurnal",
      placeholder: "Masukkan volume jurnal",
    }),
    createTextField({
      name: "nomor",
      label: "Nomor Jurnal",
      placeholder: "Masukkan nomor jurnal",
    }),
    createTextField({
      name: "doi",
      label: "DOI",
      placeholder: "Masukkan DOI",
    }),
    createDateField({
      name: "tanggal_terbit",
      label: "Tanggal Terbit Artikel",
    }),
    createTextField({
      name: "penerbit",
      label: "Penerbit Jurnal",
      placeholder: "Masukkan penerbit jurnal",
    }),
    {
      ...createTextField({
        name: "link_artikel",
        label: "Link Jurnal/Artikel",
        placeholder: "Masukkan link jurnal/artikel",
        className: "md:col-span-2",
      }),
      type: "url",
    },
  ];
}

function getPengesahanBukuFieldConfig() {
  return [
    createTextField({
      name: "bidang_ilmu",
      label: "Bidang Ilmu",
      placeholder: "Masukkan bidang ilmu",
      className: "md:col-span-2",
    }),
    createDateField({
      name: "tanggal_mulai",
      label: "Tanggal Mulai Menulis Buku",
    }),
    createTextField({
      name: "no_surat_tugas",
      label: "Nomor Surat Tugas",
      placeholder: "Masukkan nomor surat tugas",
      // helperText: "Opsional",
      // required: false,
    }),
    createTextareaField({
      name: "judul_buku",
      label: "Judul Buku",
      placeholder: "Masukkan judul buku",
    }),
    createTextField({
      name: "judul_book_chapter",
      label: "Judul Book Chapter",
      placeholder: "Masukkan judul book chapter",
    }),
    createTextField({
      name: "halaman",
      label: "Halaman",
      placeholder: "Contoh: 12-30",
    }),
    createTextField({
      name: "isbn",
      label: "ISBN",
      placeholder: "Masukkan ISBN",
    }),
    createDateField({
      name: "tanggal_terbit",
      label: "Tanggal Terbit Buku",
    }),
    createTextField({
      name: "penerbit",
      label: "Penerbit Buku",
      placeholder: "Masukkan penerbit buku",
    }),
    {
      ...createTextField({
        name: "link_buku",
        label: "Link Buku",
        placeholder: "Masukkan link buku",
        className: "",
        required: false,
        helperText: "Opsional",
      }),
      type: "url",
    },
  ];
}

const FIELD_CONFIG_REGISTRY = {
  TUGAS: {
    PENELITIAN: () => getTugasPenelitianFieldConfig(),
    PKM: (formValues) => getTugasPkmFieldConfig(formValues),
    ARTIKEL: (_formValues, kategori) => getTugasPublikasiFieldConfig(kategori),
    BUKU: (_formValues, kategori) => getTugasPublikasiFieldConfig(kategori),
  },
  KEMAJUAN: {
    PENELITIAN: () => getKemajuanPenelitianFieldConfig(),
    PKM: () => getKemajuanPkmFieldConfig(),
  },
  PENGESAHAN: {
    PENELITIAN: () => getPengesahanPenelitianFieldConfig(),
    PKM: (formValues) => getPengesahanPkmFieldConfig(formValues),
    ARTIKEL: (formValues) => getPengesahanArtikelFieldConfig(formValues),
    BUKU: () => getPengesahanBukuFieldConfig(),
  },
};

export function getCreatePengajuanFieldConfig(
  tahap,
  kategori,
  formValues = {},
) {
  const tahapRegistry = FIELD_CONFIG_REGISTRY[tahap];
  const builder = tahapRegistry?.[kategori];
  if (!builder) return [];
  return builder(formValues, kategori);
}
