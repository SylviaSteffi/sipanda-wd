import { KATEGORI_OPTIONS } from "../config/pengajuanFilterOptions";

export function getKategoriOptionsByTahap(
  tahap,
  kategoriOptions = KATEGORI_OPTIONS,
) {
  if (tahap === "KEMAJUAN") {
    return kategoriOptions.filter(
      (item) => item.value === "PENELITIAN" || item.value === "PKM",
    );
  }

  return kategoriOptions;
}

export function normalizeKategoriByTahap(
  kategori,
  tahap,
  kategoriOptions = KATEGORI_OPTIONS,
) {
  if (!kategori) return "";

  const allowedOptions = getKategoriOptionsByTahap(tahap, kategoriOptions);
  const isValid = allowedOptions.some((item) => item.value === kategori);

  return isValid ? kategori : "";
}