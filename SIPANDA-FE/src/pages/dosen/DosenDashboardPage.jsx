import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { usePengajuan } from "../../context/pengajuanContext";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import ListFilterSelect from "../../components/ui/ListFilterSelect";
import { getActiveAkademik } from "../../utils/akademikHelpers";
import {
  formatKategori,
  formatTahap,
  getJudulPengajuan,
  getPengajuanStatus,
} from "../../utils/pengajuanHelpers";
import {
  getDosenDashboardStats,
  getDosenDashboardSummary,
} from "../../utils/dosenDashboardHelpers";
import { filterPengajuanByUserId } from "../../utils/dosenPengajuanHelpers";

function StatCard({ label, value, color = "#D1D5DB" }) {
  return (
    <div
      className="rounded-xl border border-black-40 border-l-8 bg-white p-4"
      style={{ borderLeftColor: color }}
    >
      <div className="text-body-xxs-medium" style={{ color: color }}>
        {label}
      </div>
      <div className="mt-1 text-body-lg-medium" style={{ color: color }}>
        {value}
      </div>
    </div>
  );
}

function DashboardSectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-body-sm-medium text-black-100">{title}</h2>

      {to ? (
        <Link
          to={to}
          className="text-body-xxs-medium text-primary-100 no-underline hover:underline"
        >
          Lihat semua
        </Link>
      ) : null}
    </div>
  );
}

function PengajuanPreviewCard({ item, actionLabel = "Detail" }) {
  return (
    <div className="rounded-lg border border-black-40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-body-xxs-medium text-black-100">
              ID #{item.id}
            </span>
            <StatusBadge status={getPengajuanStatus(item)} />
          </div>

          <div className="mt-2 text-sm font-medium leading-6 text-black-100">
            {getJudulPengajuan(item)}
          </div>

          <div className="mt-1 text-body-xxs-regular leading-5 text-black-80">
            {formatTahap(item.tahap)} · {formatKategori(item.kategori)}
          </div>
        </div>

        <div className="self-end">
          <Link
            to={`/dosen/pengajuan/${item.id}`}
            className="inline-flex shrink-0 rounded-lg border border-black-40 px-3 py-1.5 text-body-xxs-medium text-black-100 no-underline hover:bg-black-20"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function DosenDashboardPage() {
  const { userId } = useAuth();
  const { pengajuanData, akademikData = [] } = usePengajuan();

  const activeAkademik = useMemo(
    () => getActiveAkademik(akademikData),
    [akademikData],
  );

  const [selectedAkademikId, setSelectedAkademikId] = useState(
    activeAkademik?.id || "",
  );

  const dosenPengajuan = useMemo(
    () => filterPengajuanByUserId(pengajuanData, userId),
    [pengajuanData, userId],
  );

  const akademikOptions = useMemo(
    () =>
      akademikData.map((item) => ({
        value: item.id,
        label: item.nama_akademik,
      })),
    [akademikData],
  );

  const effectiveAkademikId = selectedAkademikId || activeAkademik?.id || "";

  const filteredPengajuan = useMemo(
    () =>
      dosenPengajuan.filter(
        (item) => String(item.akademik_id) === String(effectiveAkademikId),
      ),
    [dosenPengajuan, effectiveAkademikId],
  );

  const stats = useMemo(
    () => getDosenDashboardStats(filteredPengajuan),
    [filteredPengajuan],
  );

  const summary = useMemo(
    () => getDosenDashboardSummary(filteredPengajuan),
    [filteredPengajuan],
  );

  const latestItems = summary.latestPengajuan.slice(0, 3);
  const pendingItems = summary.pendingPengajuan;

  const pengajuanListUrl = `/dosen/pengajuan?akademikId=${encodeURIComponent(
    effectiveAkademikId,
  )}`;

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

      <div className="w-full max-w-sm">
        <ListFilterSelect
          label="Tahun Akademik"
          value={selectedAkademikId}
          onChange={setSelectedAkademikId}
          options={akademikOptions}
          showAllOption={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SectionCard className="px-5 pb-5 pt-5">
          <DashboardSectionHeader title="Kegiatan Belum Selesai" />

          {pendingItems.length > 0 ? (
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <PengajuanPreviewCard
                  key={item.id}
                  item={item}
                  actionLabel="Lihat"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-black-40 p-4 text-body-xs-regular text-black-80">
              Tidak ada kegiatan yang masih berjalan.
            </div>
          )}
        </SectionCard>

        <SectionCard className="px-5 pb-5 pt-5">
          <DashboardSectionHeader
            title="Pengajuan Terbaru"
            to={pengajuanListUrl}
          />

          {latestItems.length > 0 ? (
            <div className="space-y-3">
              {latestItems.map((item) => (
                <PengajuanPreviewCard
                  key={item.id}
                  item={item}
                  actionLabel="Detail"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-black-40 p-4 text-body-xs-regular text-black-80">
              Belum ada pengajuan.
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default DosenDashboardPage;
