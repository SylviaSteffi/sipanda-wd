import { normalizeText } from "./dosenCreatePengajuanUtils";

export const FAKULTAS_OPTIONS = [
  {
    value: "88d5d80a-c751-488b-bd4e-709c6d92d5ca",
    label: "Fakultas Teknologi Informasi",
  },
  {
    value: "0ab853dd-4b60-4c3e-a6f6-11d774bcff83",
    label: "Fakultas Ekonomi dan Bisnis",
  },
  {
    value: "9b24676b-936e-4e6d-a462-b39a45f112c2",
    label: "Fakultas Bahasa",
  },
];

export const PRODI_OPTIONS = [
  {
    value: "fe973a37-53e0-495e-bafe-54c032e1ddf4",
    label: "Sistem Informasi",
    fakultas_id: "88d5d80a-c751-488b-bd4e-709c6d92d5ca",
  },
  {
    value: "f3ff8951-3fb2-4eb5-8668-17d47084b524",
    label: "Informatika",
    fakultas_id: "88d5d80a-c751-488b-bd4e-709c6d92d5ca",
  },
  {
    value: "4c432e28-fde7-4291-b13c-6d492514a8c3",
    label: "Bisnis Digital",
    fakultas_id: "88d5d80a-c751-488b-bd4e-709c6d92d5ca",
  },
  {
    value: "1c23bc5f-f060-4503-8c88-31980a68914e",
    label: "Akuntansi",
    fakultas_id: "0ab853dd-4b60-4c3e-a6f6-11d774bcff83",
  },
  {
    value: "66bfb1ba-d500-4269-9be7-c9477a085f42",
    label: "Manajemen",
    fakultas_id: "0ab853dd-4b60-4c3e-a6f6-11d774bcff83",
  },
  {
    value: "5ae3e67c-7982-4f07-8a13-df3dbf5609c6",
    label: "Bahasa dan Kebudayaan Inggris",
    fakultas_id: "9b24676b-936e-4e6d-a462-b39a45f112c2",
  },
  {
    value: "0cd9125c-fe1f-464d-bd3f-cadaae9e1219",
    label: "Bahasa Mandarin",
    fakultas_id: "9b24676b-936e-4e6d-a462-b39a45f112c2",
  },
];

export const JABATAN_OPTIONS = [
  { value: "DOSEN", label: "Dosen" },
  { value: "KAPRODI", label: "Kaprodi" },
  { value: "DEKAN", label: "Dekan" },
];

export function sanitizeNumericInput(value = "") {
  return String(value || "").replace(/\D/g, "");
}

function hasMinimumDigits(value = "", minimum = 10) {
  return sanitizeNumericInput(value).length >= minimum;
}

export function getJabatanLabel(value) {
  const found = JABATAN_OPTIONS.find((item) => item.value === value);
  return found?.label || value || "-";
}

export function getFakultasLabel(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value.nama_fakultas || "-";
  }

  return value || "-";
}

export function getProdiLabel(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value.nama_prodi || "-";
  }

  return value || "-";
}

export function getFakultasOptions() {
  return [...FAKULTAS_OPTIONS];
}

export function getProdiOptionsByFakultas(fakultasId = "") {
  if (!fakultasId) return [];

  return PRODI_OPTIONS.filter(
    (item) => String(item.fakultas_id) === String(fakultasId),
  );
}

export function getFakultasLabelById(fakultasId = "") {
  return (
    FAKULTAS_OPTIONS.find((item) => String(item.value) === String(fakultasId))
      ?.label || ""
  );
}

export function getProdiLabelById(prodiId = "") {
  return (
    PRODI_OPTIONS.find((item) => String(item.value) === String(prodiId))
      ?.label || ""
  );
}

export function matchesDosenSearch(dosen, keyword = "") {
  if (!keyword) return true;

  const normalizedKeyword = normalizeText(keyword).toLowerCase();

  const searchTargets = [
    dosen?.nidn,
    dosen?.nama,
    dosen?.email,
    dosen?.no_hp,
    dosen?.fakultas,
    dosen?.prodi,
    getJabatanLabel(dosen?.jabatan),
  ]
    .map((item) => String(item || "").toLowerCase())
    .join(" ");

  return searchTargets.includes(normalizedKeyword);
}

export function createEmptyDosenForm() {
  return {
    nama: "",
    nidn: "",
    email: "",
    no_hp: "",
    fakultas_id: "",
    prodi_id: "",
    jabatan: "DOSEN",
    password: "",
  };
}

export function createDosenForm(dosen = null) {
  if (!dosen) {
    return createEmptyDosenForm();
  }

  return {
    nama: dosen?.nama || "",
    nidn: dosen?.nidn || "",
    email: dosen?.email || "",
    no_hp: dosen?.no_hp || "",
    fakultas_id: dosen?.fakultas_id || "",
    prodi_id: dosen?.prodi_id || "",
    jabatan: dosen?.jabatan || "DOSEN",
  };
}

export function validateDosenForm(
  form = {},
  usersData = [],
  currentId = null,
  prodiOptions = [],
) {
  const errors = {};

  const nama = normalizeText(form.nama);
  const nidn = sanitizeNumericInput(form.nidn);
  const email = normalizeText(form.email).toLowerCase();
  const noHp = sanitizeNumericInput(form.no_hp);
  const fakultasId = normalizeText(form.fakultas_id);
  const prodiId = normalizeText(form.prodi_id);
  const jabatan = normalizeText(form.jabatan);

  if (!nama) {
    errors.nama = "Nama dosen wajib diisi.";
  }

  if (!nidn) {
    errors.nidn = "NIDN wajib diisi.";
  } else if (!/^\d+$/.test(nidn)) {
    errors.nidn = "NIDN hanya boleh berisi angka.";
  } else if (!hasMinimumDigits(nidn, 10)) {
    errors.nidn = "NIDN minimal 10 digit.";
  }

  if (!email) {
    errors.email = "Email wajib diisi.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!noHp) {
    errors.no_hp = "No HP wajib diisi.";
  } else if (!/^\d+$/.test(noHp)) {
    errors.no_hp = "No HP hanya boleh berisi angka.";
  } else if (!hasMinimumDigits(noHp, 10)) {
    errors.no_hp = "No HP minimal 10 digit.";
  }

  if (!fakultasId) {
    errors.fakultas_id = "Fakultas wajib dipilih.";
  }

  if (!jabatan) {
    errors.jabatan = "Jabatan wajib dipilih.";
  }

  if (!currentId) {
    const password = normalizeText(form.password);
    if (!password) {
      errors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      errors.password = "Password minimal 6 karakter.";
    }
  }

  const normalizedCurrentId = String(currentId || "");

  const duplicateNidn = usersData.find(
    (item) =>
      String(item.id) !== normalizedCurrentId &&
      sanitizeNumericInput(item.nidn) === nidn,
  );

  if (duplicateNidn) {
    errors.nidn = "NIDN sudah digunakan.";
  }

  const duplicateEmail = usersData.find(
    (item) =>
      String(item.id) !== normalizedCurrentId &&
      normalizeText(item.email).toLowerCase() === email,
  );

  if (duplicateEmail) {
    errors.email = "Email sudah digunakan.";
  }

  const isProdiValid = prodiOptions.some(
    (item) => String(item.value) === String(prodiId),
  );

  if (prodiId && !isProdiValid) {
    errors.prodi_id = "Program studi tidak sesuai dengan fakultas.";
  }

  return errors;
}

export function buildDosenPayload(form = {}, existingUser = null) {
  const fakultas_id = normalizeText(form.fakultas_id);
  const prodi_id = normalizeText(form.prodi_id);

  return {
    ...(existingUser || {}),
    role: "Dosen",
    jabatan: normalizeText(form.jabatan || "DOSEN"),
    nidn: sanitizeNumericInput(form.nidn),
    nama: normalizeText(form.nama),
    email: normalizeText(form.email).toLowerCase(),
    fakultas_id,
    fakultas: getFakultasLabelById(fakultas_id),
    prodi_id,
    prodi: getProdiLabelById(prodi_id),
    no_hp: sanitizeNumericInput(form.no_hp),
    password: form.password,
  };
}

export function hasDosenRelatedPengajuan(dosenId, pengajuanData = []) {
  return pengajuanData.some(
    (item) => String(item?.user_id) === String(dosenId),
  );
}
