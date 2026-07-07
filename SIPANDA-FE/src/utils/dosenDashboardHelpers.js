import { getPengajuanStatus } from "./pengajuanHelpers";
import {
  getLatestDosenPengajuan,
  getPendingDosenPengajuan,
} from "./dosenPengajuanHelpers";
import {
  STATUS_ORDER,
  getStatusLabel,
  getStatusMeta,
} from "../config/statusConfig";

const TOTAL_CARD_COLOR = "#1F2937";

function countByStatus(pengajuanData = [], status) {
  return pengajuanData.filter(
    (item) => getPengajuanStatus(item) === status,
  ).length;
}

export function getDosenDashboardStats(pengajuanData = []) {
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

export function getDosenDashboardSummary(pengajuanData = []) {
  return {
    latestPengajuan: getLatestDosenPengajuan(pengajuanData, 5),
    pendingPengajuan: getPendingDosenPengajuan(pengajuanData),
  };
}