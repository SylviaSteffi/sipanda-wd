import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { usePengajuan } from "../../context/pengajuanContext";
import StatusBadge from "../../components/ui/StatusBadge";
import ListFilterSelect from "../../components/ui/ListFilterSelect";
import DosenSummaryCell from "../../components/pengajuan/shared/DosenSummaryCell";
import PengajuanSummaryCell from "../../components/pengajuan/shared/PengajuanSummaryCell";
import { getPengajuanStatus } from "../../utils/pengajuanHelpers";
import { getActiveAkademik } from "../../utils/akademikHelpers";
import {
  filterPengajuanByAkademik,
  getAdminDashboardMonthlyData,
  getAdminDashboardPieData,
  getAdminDashboardStats,
  getPendingDashboardPengajuan,
} from "../../utils/adminDashboardHelpers";
import { exportPendingDashboardData } from "../../utils/exportHelpers";

function StatCard({ label, value, color = "#D1D5DB" }) {
  return (
    <div
      className="rounded-xl border border-black-40 border-l-8 bg-white p-4"
      style={{ borderLeftColor: color }}
    >
      <div className="text-body-xxs-medium" style={{ color: color }}>
        {label}
      </div>
      <div className="mt-1 text-body-lg-medium  " style={{ color: color }}>
        {value}
      </div>
    </div>
  );
}

function DashboardSectionTitle({ children }) {
  return <h2 className="text-body-sm-medium text-black-100">{children}</h2>;
}

function PieLegend({ data, hiddenMap, onToggle }) {
  return (
    <ul className="space-y-2">
      {data.map((item) => {
        const isHidden = Boolean(hiddenMap[item.key]);

        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onToggle(item.key)}
              className="flex w-full items-center gap-2 text-left hover:opacity-90"
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  backgroundColor: item.color,
                  opacity: isHidden ? 0.3 : 1,
                }}
              />
              <span
                className={`text-body-xxs-regular ${
                  isHidden ? "text-black-60 line-through" : "text-black-100"
                }`}
              >
                {item.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function AdminDashboardPage() {
  const { pengajuanData, akademikData = [] } = usePengajuan();

  const activeAkademik = useMemo(
    () => getActiveAkademik(akademikData),
    [akademikData],
  );

  const [selectedAkademikId, setSelectedAkademikId] = useState(
    activeAkademik?.id || "",
  );

  const [hiddenStatusByAkademik, setHiddenStatusByAkademik] = useState({});

  const akademikOptions = useMemo(
    () =>
      akademikData.map((item) => ({
        value: item.id,
        label: item.nama_akademik,
      })),
    [akademikData],
  );

  const selectedAkademik = useMemo(
    () =>
      akademikData.find(
        (item) => String(item.id) === String(selectedAkademikId),
      ) || null,
    [akademikData, selectedAkademikId],
  );

  const dashboardPengajuan = useMemo(
    () => filterPengajuanByAkademik(pengajuanData, selectedAkademikId),
    [pengajuanData, selectedAkademikId],
  );

  const stats = useMemo(
    () => getAdminDashboardStats(dashboardPengajuan),
    [dashboardPengajuan],
  );

  const pieData = useMemo(
    () => getAdminDashboardPieData(dashboardPengajuan),
    [dashboardPengajuan],
  );

  const monthlyData = useMemo(
    () => getAdminDashboardMonthlyData(dashboardPengajuan),
    [dashboardPengajuan],
  );

  const pendingPengajuan = useMemo(
    () => getPendingDashboardPengajuan(dashboardPengajuan),
    [dashboardPengajuan],
  );

  const currentAkademikKey = useMemo(
    () => String(selectedAkademikId || "all"),
    [selectedAkademikId],
  );

  const hiddenStatus = useMemo(
    () => hiddenStatusByAkademik[currentAkademikKey] || {},
    [hiddenStatusByAkademik, currentAkademikKey],
  );

  const visiblePieData = useMemo(
    () => pieData.filter((item) => !hiddenStatus[item.key]),
    [pieData, hiddenStatus],
  );

  const toggleStatus = (statusKey) => {
    setHiddenStatusByAkademik((prev) => {
      const currentHiddenMap = prev[currentAkademikKey] || {};
      const isCurrentlyHidden = Boolean(currentHiddenMap[statusKey]);
      const currentlyVisible = pieData.filter(
        (item) => !currentHiddenMap[item.key],
      );

      if (!isCurrentlyHidden && currentlyVisible.length === 1) {
        return prev;
      }

      return {
        ...prev,
        [currentAkademikKey]: {
          ...currentHiddenMap,
          [statusKey]: !currentHiddenMap[statusKey],
        },
      };
    });
  };

  const handleExport = () => {
    if (!pendingPengajuan.length) {
      alert("Tidak ada data pengajuan belum selesai untuk diekspor.");
      return;
    }

    exportPendingDashboardData({
      periodeLabel: selectedAkademik?.nama_akademik || "",
      pengajuanList: pendingPengajuan,
    });
  };

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-black-100">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {stats.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-black-40 bg-white p-5">
          <div className="mb-4">
            <DashboardSectionTitle>
              Distribusi Status Pengajuan
            </DashboardSectionTitle>
          </div>

          {pieData.length > 0 ? (
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
              <div className="h-64 w-full xl:w-3/5">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visiblePieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {visiblePieData.map((item) => (
                        <Cell key={item.key} fill={item.color} />
                      ))}
                    </Pie>

                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;

                        const { name, value } = payload[0].payload;

                        return (
                          <div className="rounded-lg border border-black-40 bg-white px-3 py-2 text-body-xxs-regular">
                            <div className="font-semibold text-black-100">
                              {name}
                            </div>
                            <div className="text-black-80">{value}</div>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full xl:w-2/5">
                <PieLegend
                  data={pieData}
                  hiddenMap={hiddenStatus}
                  onToggle={toggleStatus}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-black-80">
              Belum ada data distribusi status pada periode ini.
            </div>
          )}
        </section>

        <section className="rounded-xl border border-black-40 bg-white p-5">
          <div className="mb-4">
            <DashboardSectionTitle>Pengajuan Per Bulan</DashboardSectionTitle>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                style={{ fontFamily: "Inter, ui-sans-serif", fontSize: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" interval={0} />
                <YAxis allowDecimals={false} />
                <RechartsTooltip
                  formatter={(value) => [value, "Jumlah Pengajuan"]}
                  labelFormatter={(label) => `Bulan: ${label}`}
                />
                <Bar dataKey="total" fill="#5E548E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="overflow-hidden rounded-xl border border-black-40 bg-white">
        <div className="flex flex-col gap-4 border-b border-black-40 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <DashboardSectionTitle>
              Daftar Pengajuan Belum Selesai
            </DashboardSectionTitle>

            <button
              type="button"
              onClick={handleExport}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-body-xxs-medium text-white ${
                pendingPengajuan.length > 0
                  ? "bg-success-100 hover:opacity-95"
                  : "cursor-not-allowed bg-black-60"
              }`}
            >
              Ekspor Data
            </button>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-sm">
              <ListFilterSelect
                label="Tahun Akademik"
                value={selectedAkademikId}
                onChange={setSelectedAkademikId}
                options={akademikOptions}
              />
            </div>

            <div className="text-body-xxs-regular text-black-100">
              Menampilkan {pendingPengajuan.length} pengajuan
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed text-left">
            <thead className="bg-black-20 text-body-xxs-medium text-black-80">
              <tr>
                <th className="w-12 px-4 py-4">ID</th>
                <th className="w-[28%] px-4 py-4">Dosen</th>
                <th className="w-[38%] px-4 py-4">Ringkasan</th>
                <th className="w-[18%] px-5 py-4">Status</th>
                <th className="w-[96px] px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-body-xxs-regular text-black-100">
              {pendingPengajuan.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-black-20 align-top"
                >
                  <td className="px-4 py-4 align-top">{item.id}</td>

                  <td className="px-4 py-4">
                    <DosenSummaryCell pengajuan={item} />
                  </td>

                  <td className="px-4 py-4">
                    <PengajuanSummaryCell pengajuan={item} />
                  </td>

                  <td className="px-5 py-4 align-top">
                    <StatusBadge status={getPengajuanStatus(item)} />
                  </td>

                  <td className="px-6 py-4 text-center align-top">
                    <Link
                      to={`/admin/pengajuan/${item.id}`}
                      className="inline-flex rounded-lg border border-black-40 px-3 py-2 text-center text-body-xxs-medium text-black-100 no-underline hover:bg-black-20"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}

              {pendingPengajuan.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-black-80">
                    Tidak ada data pengajuan belum selesai.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
