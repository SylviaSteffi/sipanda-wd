import { getPengajuanStatus } from "./pengajuanHelpers";
import { parseDateValue } from "./dateHelpers";
import {
  PENDING_DASHBOARD_STATUSES,
  STATUS_ORDER,
  getStatusLabel,
  getStatusMeta,
} from "../config/statusConfig";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agt",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const TOTAL_CARD_COLOR = "#1F2937";

function countByStatus(pengajuanData = [], status) {
  return pengajuanData.filter(
    (item) => getPengajuanStatus(item) === status,
  ).length;
}

export function filterPengajuanByAkademik(pengajuanData = [], akademikId = "") {
  if (!akademikId) return pengajuanData;

  return pengajuanData.filter(
    (item) => String(item?.akademik_id) === String(akademikId),
  );
}

export function isPendingDashboardPengajuan(item) {
  return PENDING_DASHBOARD_STATUSES.includes(getPengajuanStatus(item));
}

export function getPendingDashboardPengajuan(pengajuanData = []) {
  return pengajuanData.filter(isPendingDashboardPengajuan);
}

export function getAdminDashboardStats(pengajuanData = []) {
  return [
    {
      key: "TOTAL",
      label: "Total Pengajuan",
      value: pengajuanData.length,
      color: TOTAL_CARD_COLOR,
    },
    ...STATUS_ORDER.map((statusKey) => ({
      key: statusKey,
      label: getStatusLabel(statusKey),
      value: countByStatus(pengajuanData, statusKey),
      color: getStatusMeta(statusKey).chartColor,
    })),
  ];
}

export function getAdminDashboardPieData(pengajuanData = []) {
  return STATUS_ORDER.map((statusKey) => ({
    key: statusKey,
    name: getStatusLabel(statusKey),
    value: countByStatus(pengajuanData, statusKey),
    color: getStatusMeta(statusKey).chartColor,
  })).filter((item) => item.value > 0);
}

export function getAdminDashboardMonthlyData(pengajuanData = []) {
  const rows = MONTH_LABELS.map((month) => ({
    month,
    total: 0,
  }));

  pengajuanData.forEach((item) => {
    const date = parseDateValue(item?.tanggal_pengajuan);
    if (!date) return;

    rows[date.getMonth()].total += 1;
  });

  return rows;
}