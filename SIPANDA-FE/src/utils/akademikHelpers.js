export function parseNamaAkademik(namaAkademik) {
  const raw = String(namaAkademik || "").trim();

  if (!raw) {
    return {
      tahunAkademik: "-",
      semester: "-",
      label: "-",
    };
  }

  const semester = raw.toUpperCase().includes("GENAP") ? "GENAP" : "GANJIL";
  const tahunAkademik = raw
    .replace(/ganjil/i, "")
    .replace(/genap/i, "")
    .trim();

  return {
    tahunAkademik,
    semester,
    label: raw,
  };
}

export function getAkademikById(akademikData = [], akademikId) {
  return (
    akademikData.find((item) => String(item.id) === String(akademikId)) || null
  );
}

export function getAkademikLabelById(akademikData = [], akademikId) {
  const found = getAkademikById(akademikData, akademikId);
  return found?.nama_akademik || "-";
}

export function getParsedAkademikById(akademikData = [], akademikId) {
  const found = getAkademikById(akademikData, akademikId);
  return parseNamaAkademik(found?.nama_akademik);
}

export function getActiveAkademik(akademikData = []) {
  return akademikData.find((item) => Number(item.is_aktif) === 1) || null;
}