import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import ListSearchInput from "../../components/ui/ListSearchInput";
import ListFilterSelect from "../../components/ui/ListFilterSelect";
import DosenSummaryCell from "../../components/pengajuan/shared/DosenSummaryCell";
import { usePengajuan } from "../../context/pengajuanContext";
import {
  canExportByFormSelection,
  exportPengajuanFormDataBySelection,
} from "../../utils/exportHelpers.js";
import {
  formatKategori,
  formatTahap,
  getJudulPengajuan,
  getPengajuanStatus,
} from "../../utils/pengajuanHelpers";
import { matchesPengajuanSearch } from "../../utils/pengajuanListHelpers";
import {
  getActiveAkademik,
  getAkademikLabelById,
} from "../../utils/akademikHelpers";
import {
  KATEGORI_OPTIONS,
  PENGAJUAN_STATUS_OPTIONS,
  TAHAP_OPTIONS,
} from "../../config/pengajuanFilterOptions";
import {
  getKategoriOptionsByTahap,
  normalizeKategoriByTahap,
} from "../../utils/pengajuanFilterHelpers";
import BaseTable from "../../lib/components/Table/BaseTable.jsx";

function hasAnsweredClarification(pengajuan) {
  if (getPengajuanStatus(pengajuan) !== "DIAJUKAN") return false;

  if (!Array.isArray(pengajuan?.klarifikasi)) return false;

  return pengajuan.klarifikasi.some(
    (item) => item?.status_klarifikasi === "TERJAWAB",
  );
}

function PengajuanRingkasanCell({ pengajuan }) {
  const isRevisedClarification = hasAnsweredClarification(pengajuan);

  return (
    <div className="space-y-1">
      <div className="text-body-xxs-medium leading-6 text-black-100">
        {getJudulPengajuan(pengajuan)}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-body-xxs-regular leading-5 text-black-80">
        <span>
          {formatTahap(pengajuan?.tahap)} ·{" "}
          {formatKategori(pengajuan?.kategori)}
        </span>

        {isRevisedClarification ? (
          <span className="inline-flex rounded-full border border-warning-100/30 bg-warning-20 px-2.5 py-0.5 text-xs font-semibold text-warning-100">
            Revisi klarifikasi
          </span>
        ) : null}
      </div>
    </div>
  );
}

function PengajuanListPage() {
  const { pengajuanData, akademikData = [] } = usePengajuan();

  const activeAkademik = useMemo(
    () => getActiveAkademik(akademikData),
    [akademikData],
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");
  const [tahap, setTahap] = useState("");
  const [selectedAkademikId, setSelectedAkademikId] = useState("");
  const effectiveAkademikId = selectedAkademikId;

  const akademikOptions = useMemo(
    () =>
      akademikData.map((item) => ({
        value: item.id,
        label: item.nama_akademik,
      })),
    [akademikData],
  );

  const kategoriOptions = useMemo(
    () => getKategoriOptionsByTahap(tahap, KATEGORI_OPTIONS),
    [tahap],
  );

  const periodeLabel = useMemo(
    () => getAkademikLabelById(akademikData, effectiveAkademikId),
    [akademikData, effectiveAkademikId],
  );

  const filteredPengajuan = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return pengajuanData.filter((item) => {
      const akademikLabel = getAkademikLabelById(
        akademikData,
        item.akademik_id,
      );
      const itemStatus = getPengajuanStatus(item);

      const matchSearch = matchesPengajuanSearch(item, keyword, akademikLabel);
      const matchStatus = !status || itemStatus === status;
      const matchKategori = !kategori || item.kategori === kategori;
      const matchTahap = !tahap || item.tahap === tahap;
      const matchAkademik =
        !effectiveAkademikId ||
        String(item.akademik_id) === String(effectiveAkademikId);

      return (
        matchSearch &&
        matchStatus &&
        matchKategori &&
        matchTahap &&
        matchAkademik
      );
    });
  }, [
    pengajuanData,
    akademikData,
    search,
    status,
    kategori,
    tahap,
    effectiveAkademikId,
  ]);

  const isTahapAndKategoriSelected = Boolean(tahap && kategori);

  const isExportCombinationSupported = useMemo(() => {
    if (!isTahapAndKategoriSelected) return false;
    return canExportByFormSelection({ tahap, kategori });
  }, [isTahapAndKategoriSelected, tahap, kategori]);

  const hasExportableData = filteredPengajuan.length > 0;
  const shouldShowExportWarning = !isTahapAndKategoriSelected;

  const isExportDisabled =
    !isTahapAndKategoriSelected ||
    !isExportCombinationSupported ||
    !hasExportableData;

  const handleTahapChange = (value) => {
    setTahap(value);
    setKategori((prev) =>
      normalizeKategoriByTahap(prev, value, KATEGORI_OPTIONS),
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setKategori("");
    setTahap("");
    setSelectedAkademikId("");
  };

  const handleExport = () => {
    if (!isTahapAndKategoriSelected) {
      alert("Pilih Tahap dan Kategori terlebih dahulu untuk ekspor Excel.");
      return;
    }

    if (!isExportCombinationSupported) {
      alert(
        "Kombinasi Tahap dan Kategori yang dipilih belum mendukung ekspor Excel.",
      );
      return;
    }

    if (!hasExportableData) {
      alert("Tidak ada data yang bisa diekspor.");
      return;
    }

    try {
      exportPengajuanFormDataBySelection({
        tahap,
        kategori,
        periodeLabel,
        pengajuanList: filteredPengajuan,
      });
    } catch (error) {
      alert(error.message || "Gagal mengekspor data.");
    }
  };

  const PENGAJUAN_COLUMNS = [
    {
      key: "id",
      label: "ID",
      headerClassName: "w-12 px-4 py-4",
      cellClassName: "px-4 py-4 align-top",
      render: (item) => item.id,
    },
    {
      key: "dosen",
      label: "Dosen",
      headerClassName: "w-[28%] px-4 py-4",
      cellClassName: "px-4 py-4",
      render: (item) => <DosenSummaryCell pengajuan={item} />,
    },
    {
      key: "ringkasan",
      label: "Ringkasan",
      headerClassName: "w-[40%] px-4 py-4",
      cellClassName: "px-4 py-4",
      render: (item) => <PengajuanRingkasanCell pengajuan={item} />,
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "w-[18%] px-5 py-4",
      cellClassName: "px-5 py-4 align-top",
      render: (item) => <StatusBadge status={getPengajuanStatus(item)} />,
    },
    {
      key: "aksi",
      label: "Aksi",
      headerClassName: "w-[96px] px-6 py-4 text-center",
      cellClassName: "px-6 py-4 text-center align-top",
      render: (item) => (
        <Link
          to={`/admin/pengajuan/${item.id}`}
          className="inline-flex rounded-lg border border-black-40 px-3 py-2 text-center text-body-xxs-medium text-black-100 no-underline hover:bg-black-20"
        >
          Detail
        </Link>
      ),
    },
  ];

  return (
    <div className="min-w-0 max-w-full">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-black-100">
          Kelola Pengajuan
        </h1>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExportDisabled}
          className={`shrink-0 rounded-lg px-4 py-2.5 text-body-xxs-medium text-white ${
            isExportDisabled
              ? "cursor-not-allowed bg-black-60"
              : "bg-success-100 hover:opacity-95"
          }`}
        >
          Ekspor Data
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-black-100">
            Cari Pengajuan
          </label>

          <button
            type="button"
            onClick={handleResetFilters}
            className="shrink-0 text-sm font-medium text-primary-100 hover:underline"
          >
            Reset Filter
          </button>
        </div>

        <ListSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari berdasarkan ID pengajuan, nama dosen, atau judul pengajuan"
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <ListFilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={PENGAJUAN_STATUS_OPTIONS}
          />

          <ListFilterSelect
            label="Jenis Layanan"
            value={tahap}
            onChange={handleTahapChange}
            options={TAHAP_OPTIONS}
          />

          <ListFilterSelect
            label="Kategori"
            value={kategori}
            onChange={setKategori}
            options={kategoriOptions}
          />

          <ListFilterSelect
            label="Tahun Akademik"
            value={selectedAkademikId}
            onChange={setSelectedAkademikId}
            options={akademikOptions}
          />
        </div>

        {shouldShowExportWarning ? (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm text-warning-100">
            Untuk ekspor Excel, pilih <span className="font-medium">Tahap</span>{" "}
            dan <span className="font-medium">Kategori</span> terlebih dahulu.
          </div>
        ) : null}
      </div>
      <BaseTable
        data={filteredPengajuan}
        columns={PENGAJUAN_COLUMNS}
        title="Antrian Pengajuan"
        countLabel={`Menampilkan ${filteredPengajuan.length} dari ${pengajuanData.length} pengajuan`}
        emptyMessage="Tidak ada data pengajuan."
      />

      {/*<div className="mt-6 overflow-hidden rounded-xl border border-black-40 bg-white">*/}
      {/*  <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">*/}
      {/*    <h2 className="text-body-sm-medium text-black-100">*/}
      {/*      Antrian Pengajuan*/}
      {/*    </h2>*/}

      {/*    <div className="text-body-xxs-regular text-black-100">*/}
      {/*      Menampilkan {filteredPengajuan.length} dari {pengajuanData.length}{" "}*/}
      {/*      pengajuan*/}
      {/*    </div>*/}
      {/*  </div>*/}

      {/*  <div className="w-full overflow-hidden">*/}
      {/*    <table className="w-full table-fixed text-left">*/}
      {/*      <thead className="bg-black-20 text-body-xxs-medium text-black-80">*/}
      {/*        <tr>*/}
      {/*          <th className="w-12 px-4 py-4">ID</th>*/}
      {/*          <th className="w-[28%] px-4 py-4">Dosen</th>*/}
      {/*          <th className="w-[40%] px-4 py-4">Ringkasan</th>*/}
      {/*          <th className="w-[18%] px-5 py-4">Status</th>*/}
      {/*          <th className="w-[96px] px-6 py-4 text-center">Aksi</th>*/}
      {/*        </tr>*/}
      {/*      </thead>*/}

      {/*      <tbody className="text-body-xxs-regular text-black-100">*/}
      {/*        {filteredPengajuan.map((item) => (*/}
      {/*          <tr*/}
      {/*            key={item.id}*/}
      {/*            className="border-t border-black-20 align-top"*/}
      {/*          >*/}
      {/*            <td className="px-4 py-4 align-top">{item.id}</td>*/}

      {/*            <td className="px-4 py-4">*/}
      {/*              <DosenSummaryCell pengajuan={item} />*/}
      {/*            </td>*/}

      {/*            <td className="px-4 py-4">*/}
      {/*              <PengajuanRingkasanCell pengajuan={item} />*/}
      {/*            </td>*/}

      {/*            <td className="px-5 py-4 align-top">*/}
      {/*              <StatusBadge status={getPengajuanStatus(item)} />*/}
      {/*            </td>*/}

      {/*            <td className="px-6 py-4 text-center align-top">*/}
      {/*              <Link*/}
      {/*                to={`/admin/pengajuan/${item.id}`}*/}
      {/*                className="inline-flex rounded-lg border border-black-40 px-3 py-2 text-center text-body-xxs-medium text-black-100 no-underline hover:bg-black-20"*/}
      {/*              >*/}
      {/*                Detail*/}
      {/*              </Link>*/}
      {/*            </td>*/}
      {/*          </tr>*/}
      {/*        ))}*/}

      {/*        {filteredPengajuan.length === 0 ? (*/}
      {/*          <tr>*/}
      {/*            <td colSpan="5" className="p-6 text-center text-black-80">*/}
      {/*              Tidak ada data pengajuan.*/}
      {/*            </td>*/}
      {/*          </tr>*/}
      {/*        ) : null}*/}
      {/*      </tbody>*/}
      {/*    </table>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

export default PengajuanListPage;
