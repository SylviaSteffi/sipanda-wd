export function nowIsoString() {
  return new Date().toISOString();
}

export function normalizeNullableString(value) {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

export function normalizeRequiredString(value, fieldName, fieldlabels) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    const label = fieldlabels[fieldName] || fieldName;
    throw new Error(`${label} wajib diisi.`);
  }

  return normalized;
}

export function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function clonePlainArray(items = []) {
  return items.map((item) =>
    item && typeof item === "object" ? { ...item } : item,
  );
}
