import { FILE_FORMATS } from "./dosenCreatePengajuanConfig";
import { isPkmPembicara } from "./dosenCreatePengajuanUtils";

function createDocumentConfig({
  code,
  label,
  errorMessage,
  required = true,
  format,
}) {
  return {
    code,
    label,
    errorMessage,
    required,
    ...format,
  };
}

const DOCUMENT_CONFIG_REGISTRY = {
  TUGAS: {
    PENELITIAN: () => [
      createDocumentConfig({
        code: "PROPOSAL",
        label:
          "Silakan upload proposal penelitian yang sudah disetujui dalam format pdf/docx",
        errorMessage:
          "Proposal Penelitian yang Sudah Disetujui wajib diunggah.",
        format: FILE_FORMATS.PDF_DOCX,
      }),
    ],

    PKM: (formValues) => {
      const isPembicara = isPkmPembicara(formValues.jenis_pkm);

      return [
        createDocumentConfig({
          code: "SURAT_PERMOHONAN",
          label:
            "Upload surat permohonan/surat persetujuan dari masyarakat/organisasi",
          required: false,
          format: FILE_FORMATS.PDF_DOCX,
        }),
        ...(isPembicara
          ? [
              createDocumentConfig({
                code: "MATERI_DISAMPAIKAN",
                label: "Silakan upload materi yang disampaikan",
                errorMessage: "Materi yang Disampaikan wajib diunggah.",
                format: FILE_FORMATS.PDF_DOCX_PPT_PPTX,
              }),
            ]
          : [
              createDocumentConfig({
                code: "SURAT_UNDANGAN_PKM",
                label:
                  "Upload surat undangan/surat persetujuan dari masyarakat/organisasi",
                errorMessage:
                  "Surat Undangan/Surat Persetujuan dari Masyarakat/Organisasi wajib diunggah.",
                format: FILE_FORMATS.PDF_DOCX,
              }),
              createDocumentConfig({
                code: "PROPOSAL_PKM",
                label: "Upload proposal PKM",
                errorMessage: "Proposal PKM wajib diunggah.",
                format: FILE_FORMATS.PDF_DOCX,
              }),
            ]),
      ];
    },

    ARTIKEL: () => [
      createDocumentConfig({
        code: "ARTIKEL",
        label: "Silakan upload artikel/jurnal ilmiah dalam format pdf/docx",
        errorMessage: "Artikel/Jurnal Ilmiah wajib diunggah.",
        format: FILE_FORMATS.PDF_DOCX,
      }),
    ],

    BUKU: () => [
      createDocumentConfig({
        code: "NASKAH_BUKU",
        label: "Silakan upload naskah buku",
        errorMessage: "Naskah Buku wajib diunggah.",
        format: FILE_FORMATS.PDF_DOCX,
      }),
    ],
  },

  KEMAJUAN: {
    PENELITIAN: () => [
      createDocumentConfig({
        code: "LAPORAN_KEMAJUAN",
        label: "Upload laporan kemajuan penelitian dalam format pdf",
        errorMessage: "Laporan Kemajuan Penelitian wajib diunggah.",
        format: FILE_FORMATS.PDF_ONLY,
      }),
    ],

    PKM: () => [
      createDocumentConfig({
        code: "LAPORAN_KEMAJUAN_PKM",
        label: "Upload laporan kemajuan PKM dalam format pdf",
        errorMessage: "Laporan Kemajuan PKM wajib diunggah.",
        format: FILE_FORMATS.PDF_ONLY,
      }),
    ],
  },

  PENGESAHAN: {
    PENELITIAN: () => [
      createDocumentConfig({
        code: "LAPORAN_AKHIR",
        label: "Silakan upload laporan akhir penelitian dalam format pdf/docx",
        errorMessage: "Laporan Akhir Penelitian wajib diunggah.",
        format: FILE_FORMATS.PDF_DOCX,
      }),
    ],

    PKM: (formValues) => {
      const isPembicara = isPkmPembicara(formValues.jenis_pkm);

      return [
        createDocumentConfig({
          code: isPembicara
            ? "MATERI_SERTIFIKAT"
            : "LAPORAN_AKHIR_PKM_SERTIFIKAT",
          label: isPembicara
            ? "Silakan upload materi yang disampaikan dan surat keterangan/sertifikat yang diperoleh dalam satu file pdf"
            : "Silakan upload laporan akhir PKM beserta surat keterangan telah melaksanakan PKM/sertifikat dalam satu file pdf",
          errorMessage: isPembicara
            ? "Materi yang Disampaikan dan Surat Keterangan/Sertifikat yang Diperoleh wajib diunggah."
            : "Laporan Akhir PKM beserta Surat Keterangan Telah Melaksanakan PKM/Sertifikat wajib diunggah.",
          format: FILE_FORMATS.PDF_ONLY,
        }),
      ];
    },

    ARTIKEL: () => [
      createDocumentConfig({
        code: "ARTIKEL_PUBLIKASI",
        label:
          "Silakan upload artikel/jurnal yang sudah dipublikasikan beserta printscreen tampilan web dalam satu file pdf",
        errorMessage:
          "Artikel/Jurnal yang Sudah Dipublikasikan beserta Printscreen dari Layar Tampilan Web wajib diunggah.",
        format: FILE_FORMATS.PDF_ONLY,
      }),
    ],

    BUKU: () => [
      createDocumentConfig({
        code: "BUKU_PUBLIKASI",
        label:
          "Silakan upload buku yang sudah diterbitkan beserta printscreen tempat diterbitkan dalam satu file pdf",
        errorMessage:
          "Buku yang Sudah Diterbitkan beserta Printscreen dari Tempat Diterbitkan wajib diunggah.",
        format: FILE_FORMATS.PDF_ONLY,
      }),
    ],
  },
};

export function getRequiredDocumentConfig(tahap, kategori, formValues = {}) {
  const builder = DOCUMENT_CONFIG_REGISTRY[tahap]?.[kategori];
  return builder ? builder(formValues) : [];
}