function createOption(value, label) {
  return { value, label };
}

function createFileFormat(allowedExtensions, allowedMimeTypes) {
  return { allowedExtensions, allowedMimeTypes };
}

export const DOSEN_LAYANAN_OPTIONS = [
  createOption("TUGAS", "Surat Tugas"),
  createOption("KEMAJUAN", "Laporan Kemajuan"),
  createOption("PENGESAHAN", "Surat Pengesahan"),
];

export const DOSEN_KATEGORI_OPTIONS = [
  createOption("PENELITIAN", "Penelitian"),
  createOption("PKM", "Pengabdian Kepada Masyarakat"),
  createOption("ARTIKEL", "Artikel/Publikasi"),
  createOption("BUKU", "Buku"),
];

export const DOSEN_JENIS_PENGAJUAN_OPTIONS = [
  createOption("INDIVIDU", "Individu"),
  createOption("KELOMPOK", "Kelompok"),
];

export const JENIS_PKM_OPTIONS = [
  createOption("PEMBICARA", "Pembicara/Nara Sumber Seminar/Workshop/Pelatihan"),
  createOption("LAINNYA", "Lain-lain"),
];

export const CAKUPAN_JURNAL_OPTIONS = [
  createOption("JURNAL_NASIONAL", "Jurnal Nasional"),
  createOption("JURNAL_INTERNASIONAL", "Jurnal Internasional"),
  createOption("PROSIDING", "Prosiding"),
];

const TIDAK_TERINDEKS_OPTION = createOption(
  "TIDAK_TERINDEKS",
  "Tidak Terindeks",
);

export const PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN = {
  JURNAL_NASIONAL: [
    TIDAK_TERINDEKS_OPTION,
    createOption("SINTA_1", "Sinta 1"),
    createOption("SINTA_2", "Sinta 2"),
    createOption("SINTA_3", "Sinta 3"),
    createOption("SINTA_4", "Sinta 4"),
    createOption("SINTA_5", "Sinta 5"),
    createOption("SINTA_6", "Sinta 6"),
  ],
  JURNAL_INTERNASIONAL: [
    TIDAK_TERINDEKS_OPTION,
    createOption("SCOPUS_Q1", "Scopus Q1"),
    createOption("SCOPUS_Q2", "Scopus Q2"),
    createOption("SCOPUS_Q3", "Scopus Q3"),
    createOption("SCOPUS_Q4", "Scopus Q4"),
    createOption("SCOPUS_NO_Q", "Scopus No-Q"),
    createOption("WOS", "WoS"),
  ],
  PROSIDING: [
    createOption("NASIONAL", "Nasional"),
    createOption("INTERNASIONAL", "Internasional"),
  ],
};

export const MAX_ANGGOTA_KELOMPOK_DOSEN = 9;

export const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024;

export const FILE_FORMATS = {
  PDF_ONLY: createFileFormat(["pdf"], ["application/pdf"]),
  PDF_DOCX: createFileFormat(
    ["pdf", "docx"],
    [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  ),
  PDF_DOCX_PPT_PPTX: createFileFormat(
    ["pdf", "docx", "ppt", "pptx"],
    [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  ),
};

export const CREATE_FORM_DEFAULT_VALUES = {
  bidang_ilmu: "",
  judul_proposal: "",
  judul_penelitian: "",
  no_surat_tugas: "",
  tanggal_surat_tugas: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
  nama_institusi_pemohon: "",
  no_surat_permohonan: "",
  tanggal_surat_permohonan: "",
  jenis_pkm: "PEMBICARA",
  judul_pkm: "",
  judul_materi: "",
  tempat_pelaksanaan: "",
  waktu_pelaksanaan: "",
  tempat_pkm: "",
  sumber_dana: "Mandiri",
  besar_dana: "",
  judul_karya: "",
  judul_artikel: "",
  nama_jurnal: "",
  cakupan_jurnal: "",
  peringkat_jurnal: "",
  volume: "",
  nomor: "",
  doi: "",
  link_artikel: "",
  judul_buku: "",
  judul_book_chapter: "",
  halaman: "",
  isbn: "",
  link_buku: "",
  tanggal_terbit: "",
  penerbit: "",
};

export const FIELD_ERROR_MESSAGES = {
  bidang_ilmu: "Bidang Ilmu wajib diisi.",
  judul_penelitian: "Judul Penelitian wajib diisi.",
  no_surat_tugas: "Nomor Surat Tugas wajib diisi.",
  tanggal_surat_tugas_penelitian: "Tanggal Surat Tugas Penelitian wajib diisi.",
  tanggal_surat_tugas_pkm: "Tanggal Surat Tugas PKM wajib diisi.",
  no_surat_tugas_pkm: "Nomor Surat Tugas PKM wajib diisi.",
  tanggal_mulai_surat_tugas: "Tanggal Mulai / Tanggal Surat Tugas wajib diisi.",
  tanggal_selesai: "Tanggal Selesai wajib diisi.",
  nama_institusi_pemohon: "Nama Institusi Pemohon wajib diisi.",
  no_surat_permohonan: "No Surat Permohonan wajib diisi.",
  tanggal_surat_permohonan: "Tanggal Surat Permohonan wajib diisi.",
  jenis_pkm: "Jenis PKM wajib dipilih.",
  judul_pkm: "Judul PKM wajib diisi.",
  judul_materi: "Judul Materi yang Disampaikan wajib diisi.",
  waktu_pelaksanaan: "Waktu Pelaksanaan PKM wajib diisi.",
  sumber_dana: "Sumber Dana PKM wajib diisi.",
  besar_dana: "Besar Dana PKM wajib diisi.",
  tempat_pkm: "Tempat PKM wajib diisi.",
  tempat_pelaksanaan_pkm: "Tempat Pelaksanaan PKM wajib diisi.",
  tanggal_mulai: "Tanggal Mulai wajib diisi.",
  tanggal_mulai_menulis: "Tanggal Mulai Menulis wajib diisi.",
  tanggal_terbit_artikel: "Tanggal Terbit Artikel wajib diisi.",
  tanggal_terbit_buku: "Tanggal Terbit Buku wajib diisi.",
  penerbit_jurnal: "Penerbit Jurnal wajib diisi.",
  penerbit_buku: "Penerbit Buku wajib diisi.",
  link_artikel: "Link Jurnal/Artikel wajib diisi.",
  link_buku: "Link Buku wajib diisi.",
  nama_jurnal: "Nama Jurnal wajib diisi.",
  cakupan_jurnal: "Cakupan Jurnal/Prosiding wajib dipilih.",
  peringkat_jurnal: "Indeks/Peringkat wajib dipilih.",
  volume: "Volume Jurnal wajib diisi.",
  nomor: "Nomor Jurnal wajib diisi.",
  doi: "DOI wajib diisi.",
  judul_proposal_penelitian:
    "Judul Proposal Penelitian yang Sudah Disetujui wajib diisi.",
  judul_karya_artikel: "Judul Artikel/Jurnal Ilmiah wajib diisi.",
  judul_karya_buku: "Judul Buku wajib diisi.",
  judul_artikel: "Judul Artikel/Jurnal Ilmiah wajib diisi.",
  judul_buku: "Judul Buku wajib diisi.",
  judul_book_chapter: "Judul Book Chapter wajib diisi.",
  halaman: "Halaman wajib diisi.",
  isbn: "ISBN wajib diisi.",
};

export const DETAIL_TYPE_BY_TAHAP_KATEGORI = {
  TUGAS: {
    PENELITIAN: "detail_tugas_penelitian",
    PKM: "detail_tugas_pkm",
    ARTIKEL: "detail_tugas_publikasi",
    BUKU: "detail_tugas_publikasi",
  },
  KEMAJUAN: {
    PENELITIAN: "detail_kemajuan_penelitian",
    PKM: "detail_kemajuan_pkm",
  },
  PENGESAHAN: {
    PENELITIAN: "detail_pengesahan_penelitian",
    PKM: "detail_pengesahan_pkm",
    ARTIKEL: "detail_pengesahan_artikel",
    BUKU: "detail_pengesahan_buku",
  },
};
