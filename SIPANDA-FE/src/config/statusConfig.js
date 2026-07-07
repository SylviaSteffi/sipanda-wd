const DEFAULT_STATUS_META = {
  label: "-",
  badgeClass: "bg-black-20 text-black-80",
  chartColor: "#9CA3AF",
};

export const STATUS_META = {
  DIAJUKAN: {
    label: "Diajukan",
    badgeClass: "bg-info-20 text-info-100",
    chartColor: "#2685CA",
  },
  DALAM_PEMERIKSAAN: {
    label: "Dalam Pemeriksaan",
    badgeClass: "bg-warning-20 text-warning-100",
    chartColor: "#E4C65B",
  },
  PERLU_KLARIFIKASI: {
    label: "Perlu Klarifikasi",
    badgeClass: "bg-secondary-20 text-secondary-100",
    chartColor: "#9F7A6C",
  },
  DITOLAK: {
    label: "Ditolak",
    badgeClass: "bg-error-20 text-error-100",
    chartColor: "#B51F17",
  },
  DISETUJUI: {
    label: "Disetujui",
    badgeClass: "bg-success-20 text-success-100",
    chartColor: "#3F845F",
  },
  SELESAI: {
    label: "Selesai",
    badgeClass: "bg-primary-20 text-primary-100",
    chartColor: "#5E548E",
  },
};

export const STATUS_ORDER = [
  "DIAJUKAN",
  "DALAM_PEMERIKSAAN",
  "PERLU_KLARIFIKASI",
  "DITOLAK",
  "DISETUJUI",
  "SELESAI",
];

export const PENDING_DASHBOARD_STATUSES = [
  "DIAJUKAN",
  "DALAM_PEMERIKSAAN",
  "PERLU_KLARIFIKASI",
  "DISETUJUI",
];

export const STATUS_LABELS = Object.fromEntries(
  Object.entries(STATUS_META).map(([key, value]) => [key, value.label]),
);

export const STATUS_STYLES = Object.fromEntries(
  Object.entries(STATUS_META).map(([key, value]) => [key, value.badgeClass]),
);

export function getStatusMeta(status) {
  return STATUS_META[status] || DEFAULT_STATUS_META;
}

export function getStatusLabel(status) {
  return getStatusMeta(status).label;
}