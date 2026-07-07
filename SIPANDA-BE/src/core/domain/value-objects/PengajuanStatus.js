import {
  PENGAJUAN_ALLOWED_TRANSITIONS,
  PENGAJUAN_STATUS,
  PENGAJUAN_STATUS_LIST,
} from "../../../config/constants/pengajuanStatus.js";

function normalizeStatus(value) {
  return String(value || "").trim().toUpperCase();
}

export function isValidPengajuanStatus(value) {
  return PENGAJUAN_STATUS_LIST.includes(normalizeStatus(value));
}

export function ensureValidPengajuanStatus(value) {
  const normalized = normalizeStatus(value);

  if (!isValidPengajuanStatus(normalized)) {
    throw new Error("Status pengajuan tidak valid.");
  }

  return normalized;
}

export function canTransitionPengajuanStatus(fromStatus, toStatus) {
  const normalizedFrom = ensureValidPengajuanStatus(fromStatus);
  const normalizedTo = ensureValidPengajuanStatus(toStatus);

  const allowedTargets = PENGAJUAN_ALLOWED_TRANSITIONS[normalizedFrom] || [];
  return allowedTargets.includes(normalizedTo);
}

export { PENGAJUAN_STATUS };