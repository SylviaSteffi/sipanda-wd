const TEMPLATE_CONFIGS = {
  "tugas-penelitian-individu": {
    key: "tugas-penelitian-individu",
    path: "/templates/tugas/tugas_penelitian_individu.docx",
  },
  "tugas-penelitian-kelompok": {
    key: "tugas-penelitian-kelompok",
    path: "/templates/tugas/tugas_penelitian_kelompok.docx",
  },
  "kemajuan-penelitian-individu": {
    key: "kemajuan-penelitian-individu",
    path: "/templates/kemajuan/kemajuan_penelitian_individu.docx",
  },
  "kemajuan-penelitian-kelompok": {
    key: "kemajuan-penelitian-kelompok",
    path: "/templates/kemajuan/kemajuan_penelitian_kelompok.docx",
  },
  "kemajuan-pkm-individu": {
    key: "kemajuan-pkm-individu",
    path: "/templates/kemajuan/kemajuan_pkm_individu.docx",
  },
  "kemajuan-pkm-kelompok": {
    key: "kemajuan-pkm-kelompok",
    path: "/templates/kemajuan/kemajuan_pkm_kelompok.docx",
  },
  "pengesahan-penelitian-individu": {
    key: "pengesahan-penelitian-individu",
    path: "/templates/pengesahan/pengesahan_penelitian_individu.docx",
  },
  "pengesahan-penelitian-kelompok": {
    key: "pengesahan-penelitian-kelompok",
    path: "/templates/pengesahan/pengesahan_penelitian_kelompok.docx",
  },
  "pengesahan-artikel-individu": {
    key: "pengesahan-artikel-individu",
    path: "/templates/pengesahan/pengesahan_artikel_individu.docx",
  },
  "pengesahan-artikel-kelompok": {
    key: "pengesahan-artikel-kelompok",
    path: "/templates/pengesahan/pengesahan_artikel_kelompok.docx",
  },
  "pengesahan-buku-individu": {
    key: "pengesahan-buku-individu",
    path: "/templates/pengesahan/pengesahan_buku_individu.docx",
  },
  "pengesahan-buku-kelompok": {
    key: "pengesahan-buku-kelompok",
    path: "/templates/pengesahan/pengesahan_buku_kelompok.docx",
  },
  "pengesahan-pkm-individu": {
    key: "pengesahan-pkm-individu",
    path: "/templates/pengesahan/pengesahan_pkm_individu.docx",
  },
  "pengesahan-pkm-kelompok": {
    key: "pengesahan-pkm-kelompok",
    path: "/templates/pengesahan/pengesahan_pkm_kelompok.docx",
  },
  "tugas-artikel-individu": {
    key: "tugas-artikel-individu",
    path: "/templates/tugas/tugas_artikel_individu.docx",
  },
  "tugas-artikel-kelompok": {
    key: "tugas-artikel-kelompok",
    path: "/templates/tugas/tugas_artikel_kelompok.docx",
  },
  "tugas-buku-individu": {
    key: "tugas-buku-individu",
    path: "/templates/tugas/tugas_buku_individu.docx",
  },
  "tugas-buku-kelompok": {
    key: "tugas-buku-kelompok",
    path: "/templates/tugas/tugas_buku_kelompok.docx",
  },
  "tugas-pkm-individu": {
    key: "tugas-pkm-individu",
    path: "/templates/tugas/tugas_pkm_individu.docx",
  },
  "tugas-pkm-kelompok": {
    key: "tugas-pkm-kelompok",
    path: "/templates/tugas/tugas_pkm_kelompok.docx",
  },
};

const TEMPLATE_KEY_MAP = {
  TUGAS: {
    PENELITIAN: {
      INDIVIDU: "tugas-penelitian-individu",
      KELOMPOK: "tugas-penelitian-kelompok",
    },
    PKM: {
      INDIVIDU: "tugas-pkm-individu",
      KELOMPOK: "tugas-pkm-kelompok",
    },
    ARTIKEL: {
      INDIVIDU: "tugas-artikel-individu",
      KELOMPOK: "tugas-artikel-kelompok",
    },
    BUKU: {
      INDIVIDU: "tugas-buku-individu",
      KELOMPOK: "tugas-buku-kelompok",
    },
  },
  KEMAJUAN: {
    PENELITIAN: {
      INDIVIDU: "kemajuan-penelitian-individu",
      KELOMPOK: "kemajuan-penelitian-kelompok",
    },
    PKM: {
      INDIVIDU: "kemajuan-pkm-individu",
      KELOMPOK: "kemajuan-pkm-kelompok",
    },
  },
  PENGESAHAN: {
    PENELITIAN: {
      INDIVIDU: "pengesahan-penelitian-individu",
      KELOMPOK: "pengesahan-penelitian-kelompok",
    },
    PKM: {
      INDIVIDU: "pengesahan-pkm-individu",
      KELOMPOK: "pengesahan-pkm-kelompok",
    },
    ARTIKEL: {
      INDIVIDU: "pengesahan-artikel-individu",
      KELOMPOK: "pengesahan-artikel-kelompok",
    },
    BUKU: {
      INDIVIDU: "pengesahan-buku-individu",
      KELOMPOK: "pengesahan-buku-kelompok",
    },
  },
};

function normalize(value) {
  return String(value || "").trim().toUpperCase();
}

export function getTemplateKey(pengajuan) {
  const tahap = normalize(pengajuan?.tahap);
  const kategori = normalize(pengajuan?.kategori);
  const jenisPengajuan = normalize(pengajuan?.jenis_pengajuan || "INDIVIDU");

  return TEMPLATE_KEY_MAP[tahap]?.[kategori]?.[jenisPengajuan] || null;
}

export function getTemplateConfig(pengajuan) {
  const key = getTemplateKey(pengajuan);
  return key ? TEMPLATE_CONFIGS[key] || null : null;
}

export function getTemplatePath(pengajuan) {
  return getTemplateConfig(pengajuan)?.path || null;
}

export function canGenerateTemplate(pengajuan) {
  return Boolean(getTemplateConfig(pengajuan));
}

export function getUnavailableTemplateMessage() {
  return "Template DOCX belum tersedia untuk jenis surat ini, tetapi upload surat final tetap bisa dilakukan.";
}