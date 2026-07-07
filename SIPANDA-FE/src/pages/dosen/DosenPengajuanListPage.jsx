import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { usePengajuan } from "../../context/pengajuanContext";
import StatusBadge from "../../components/ui/StatusBadge";
import ListSearchInput from "../../components/ui/ListSearchInput";
import ListFilterSelect from "../../components/ui/ListFilterSelect";
import PengajuanSummaryCell from "../../components/pengajuan/shared/PengajuanSummaryCell";
import {
  getCakupanJurnalLabel,
  getPengajuanStatus,
  getPeringkatJurnalLabel,
} from "../../utils/pengajuanHelpers";
import {
  getActiveAkademik,
  getAkademikLabelById,
} from "../../utils/akademikHelpers";
import {
  filterDosenPengajuan,
  getBkdJenisSuratLabel,
  isBkdReadyPengajuan,
} from "../../utils/dosenPengajuanHelpers";
import {
  KATEGORI_OPTIONS,
  PENGAJUAN_STATUS_OPTIONS,
  TAHAP_OPTIONS,
} from "../../config/pengajuanFilterOptions";
import {
  getKategoriOptionsByTahap,
  normalizeKategoriByTahap,
} from "../../utils/pengajuanFilterHelpers";
import {
  CAKUPAN_JURNAL_OPTIONS,
  PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN,
} from "../../utils/dosenCreatePengajuanConfig";
import { exportPengesahanArtikelSuratData } from "../../utils/suratExportHelpers";

const BKD_STATUS_OPTIONS = [{ value: "SELESAI", label: "Selesai" }];

function ModeToggleButton({ active = false, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        active
          ? "bg-primary-20 text-primary-100"
          : "bg-black-20 text-black-80 hover:bg-black-40"
      }`}
    >
      {children}
    </button>
  );
}

function getPeringkatOptionsByCakupan(cakupanArtikel) {
  const allOptions = Object.values(PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN)
    .flat()
    .filter(
      (item, index, self) =>
        self.findIndex((option) => option.value === item.value) === index,
    );

  if (!cakupanArtikel) {
    return allOptions;
  }

  return PERINGKAT_JURNAL_OPTIONS_BY_CAKUPAN[cakupanArtikel] || [];
}

function isPengesahanArtikel(tahap, kategori) {
  return tahap === "PENGESAHAN" && kategori === "ARTIKEL";
}

function isSelesaiPengesahanArtikel(item) {
  return (
    item?.tahap === "PENGESAHAN" &&
    item?.kategori === "ARTIKEL" &&
    getPengajuanStatus(item) === "SELESAI"
  );
}

function getArtikelIndexInfo(pengajuan) {
  const detail = pengajuan?.detail || {};
  const cakupanLabel = getCakupanJurnalLabel(detail.cakupan_jurnal);
  const peringkatLabel = getPeringkatJurnalLabel(detail.peringkat_jurnal);

  if (cakupanLabel === "-" && peringkatLabel === "-") {
    return "";
  }

  if (cakupanLabel === "-") {
    return peringkatLabel;
  }

  if (peringkatLabel === "-") {
    return cakupanLabel;
  }

  return `${cakupanLabel} · ${peringkatLabel}`;
}

function PengajuanBkdSummaryCell({ pengajuan, showArtikelIndexInfo }) {
  const artikelIndexInfo = showArtikelIndexInfo
    ? getArtikelIndexInfo(pengajuan)
    : "";

  return (
    <div>
      <PengajuanSummaryCell pengajuan={pengajuan} />

      {artikelIndexInfo ? (
        <div className="mt-3 text-body-xxs-regular leading-5 text-black-80">
          {artikelIndexInfo}
        </div>
      ) : null}
    </div>
  );
}

function DosenPengajuanListPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { pengajuanData, akademikData = [] } = usePengajuan();
  const [searchParams] = useSearchParams();

  const activeAkademik = useMemo(
    () => getActiveAkademik(akademikData),
    [akademikData],
  );

  const akademikIdFromQuery = searchParams.get("akademikId") || "";
  const defaultAkademikId = activeAkademik?.id || "";
  const initialAkademikId = akademikIdFromQuery || defaultAkademikId;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");
  const [tahap, setTahap] = useState("");
  const [cakupanArtikel, setCakupanArtikel] = useState("");
  const [indeksArtikel, setIndeksArtikel] = useState("");
  const [selectedAkademikId, setSelectedAkademikId] = useState("");
  const [onlyBkdReady, setOnlyBkdReady] = useState(false);

  const effectiveAkademikId = selectedAkademikId;
  const effectiveStatus = onlyBkdReady ? "SELESAI" : status;
  const isArtikelMode = onlyBkdReady && isPengesahanArtikel(tahap, kategori);

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

  const indeksArtikelOptions = useMemo(
    () => getPeringkatOptionsByCakupan(cakupanArtikel),
    [cakupanArtikel],
  );

  const periodeLabel = useMemo(
    () => getAkademikLabelById(akademikData, effectiveAkademikId),
    [akademikData, effectiveAkademikId],
  );

  const filteredPengajuan = useMemo(
    () =>
      filterDosenPengajuan({
        pengajuanData,
        akademikData,
        userId,
        search,
        status: effectiveStatus,
        tahap,
        kategori,
        akademikId: effectiveAkademikId,
        onlyBkdReady,
        cakupanArtikel: isArtikelMode ? cakupanArtikel : "",
        indeksArtikel: isArtikelMode ? indeksArtikel : "",
      }),
    [
      pengajuanData,
      akademikData,
      userId,
      search,
      effectiveStatus,
      tahap,
      kategori,
      effectiveAkademikId,
      onlyBkdReady,
      isArtikelMode,
      cakupanArtikel,
      indeksArtikel,
    ],
  );

  const exportablePengajuan = useMemo(
    () => filteredPengajuan.filter(isSelesaiPengesahanArtikel),
    [filteredPengajuan],
  );

  const totalOwnedPengajuan = useMemo(
    () =>
      pengajuanData.filter(
        (item) =>
          String(item.user_id) === String(userId || "") &&
          String(item.akademik_id) === String(effectiveAkademikId),
      ).length,
    [pengajuanData, userId, effectiveAkademikId],
  );

  const totalBkdReadyPengajuan = useMemo(
    () =>
      pengajuanData.filter(
        (item) =>
          String(item.user_id) === String(userId || "") &&
          String(item.akademik_id) === String(effectiveAkademikId) &&
          isBkdReadyPengajuan(item),
      ).length,
    [pengajuanData, userId, effectiveAkademikId],
  );

  const handleAkademikChange = (value) => {
    setSelectedAkademikId(value);
  };

  const handleTahapChange = (value) => {
    setTahap(value);
    setKategori((prev) =>
      normalizeKategoriByTahap(prev, value, KATEGORI_OPTIONS),
    );
    setCakupanArtikel("");
    setIndeksArtikel("");
  };

  const handleKategoriChange = (value) => {
    setKategori(value);
    setCakupanArtikel("");
    setIndeksArtikel("");
  };

  const handleCakupanArtikelChange = (value) => {
    setCakupanArtikel(value);
    setIndeksArtikel("");
  };

  const handleBkdModeChange = (nextOnlyBkdReady) => {
    setOnlyBkdReady(nextOnlyBkdReady);

    if (nextOnlyBkdReady) {
      setStatus("SELESAI");
      return;
    }

    setStatus("");
    setCakupanArtikel("");
    setIndeksArtikel("");
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setKategori("");
    setTahap("");
    setCakupanArtikel("");
    setIndeksArtikel("");
    setSelectedAkademikId("");
    setOnlyBkdReady(false);

    navigate("/dosen/pengajuan", { replace: true });
  };

  const handleExportData = () => {
    try {
      exportPengesahanArtikelSuratData({
        periodeLabel,
        pengajuanList: filteredPengajuan,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const listTitle = onlyBkdReady ? "Dokumen BKD Semester" : "Daftar Pengajuan";
  const statusOptions = onlyBkdReady
    ? BKD_STATUS_OPTIONS
    : PENGAJUAN_STATUS_OPTIONS;

  const totalBaseCount = onlyBkdReady
    ? totalBkdReadyPengajuan
    : totalOwnedPengajuan;

  const isExportDisabled =
    !onlyBkdReady || !isArtikelMode || exportablePengajuan.length === 0;

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-black-100">Pengajuan Saya</h1>

        <button
          type="button"
          onClick={handleExportData}
          disabled={isExportDisabled}
          className={`inline-flex w-fit rounded-lg px-5 py-3 text-body-xxs-medium text-white transition ${
            isExportDisabled
              ? "cursor-not-allowed bg-black-60"
              : "bg-success-100 hover:opacity-95"
          }`}
        >
          Ekspor Data
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="flex flex-wrap gap-2">
          <ModeToggleButton
            active={!onlyBkdReady}
            onClick={() => handleBkdModeChange(false)}
          >
            Semua Pengajuan
          </ModeToggleButton>

          <ModeToggleButton
            active={onlyBkdReady}
            onClick={() => handleBkdModeChange(true)}
          >
            Dokumen BKD Semester
          </ModeToggleButton>
        </div>

        <ListSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari berdasarkan ID pengajuan, judul, atau periode akademik"
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <ListFilterSelect
            label="Status"
            value={effectiveStatus}
            onChange={setStatus}
            options={statusOptions}
            disabled={onlyBkdReady}
            showAllOption={!onlyBkdReady}
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
            onChange={handleKategoriChange}
            options={kategoriOptions}
          />

          <ListFilterSelect
            label="Tahun Akademik"
            value={selectedAkademikId}
            onChange={handleAkademikChange}
            options={akademikOptions}
          />
        </div>

        {isArtikelMode ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ListFilterSelect
              label="Cakupan Artikel"
              value={cakupanArtikel}
              onChange={handleCakupanArtikelChange}
              options={CAKUPAN_JURNAL_OPTIONS}
            />

            <ListFilterSelect
              label="Indeks Artikel"
              value={indeksArtikel}
              onChange={setIndeksArtikel}
              options={indeksArtikelOptions}
            />
          </div>
        ) : null}

        {onlyBkdReady && !isArtikelMode ? (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm font-medium text-warning-100">
            Filter cakupan/indeks tersedia untuk Pengesahan Artikel. Ekspor data
            hanya dapat dilakukan jika terdapat data berstatus Selesai.
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-black-40 bg-white">
        <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-body-sm-medium text-black-100">{listTitle}</h2>

          <div className="text-body-xxs-regular text-black-100">
            Menampilkan {filteredPengajuan.length} dari{" "}
            {filteredPengajuan.length} pengajuan
          </div>
        </div>

        <div className="w-full overflow-hidden">
          {onlyBkdReady ? (
            <table className="w-full table-fixed text-left">
              <thead className="bg-black-20 text-body-xxs-medium text-black-80">
                <tr>
                  <th className="w-12 px-4 py-4">ID</th>
                  <th className="w-[48%] px-4 py-4">Ringkasan</th>
                  <th className="w-[16%] px-5 py-4">Status</th>
                  <th className="w-[16%] px-5 py-4">Jenis Surat</th>
                  <th className="w-[96px] px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-body-xxs-regular text-black-100">
                {filteredPengajuan.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-black-20 align-top"
                  >
                    <td className="px-4 py-4 align-top">{item.id}</td>

                    <td className="px-4 py-4">
                      <PengajuanBkdSummaryCell
                        pengajuan={item}
                        showArtikelIndexInfo={isArtikelMode}
                      />
                    </td>

                    <td className="px-5 py-4 align-top">
                      <StatusBadge status={getPengajuanStatus(item)} />
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="text-body-xxs-regular leading-5 text-black-80">
                        {getBkdJenisSuratLabel(item)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center align-top">
                      <Link
                        to={`/dosen/pengajuan/${item.id}`}
                        className="inline-flex rounded-lg border border-black-40 px-3 py-2 text-center text-body-xxs-medium text-black-100 no-underline hover:bg-black-20"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredPengajuan.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-black-80">
                      Belum ada kegiatan pada semester ini yang dokumennya siap
                      ditelusuri untuk BKD.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          ) : (
            <table className="w-full table-fixed text-left">
              <thead className="bg-black-20 text-body-xxs-medium text-black-80">
                <tr>
                  <th className="w-12 px-4 py-4">ID</th>
                  <th className="w-[56%] px-4 py-4">Ringkasan</th>
                  <th className="w-[20%] px-5 py-4">Status</th>
                  <th className="w-[96px] px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-body-xxs-regular text-black-100">
                {filteredPengajuan.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-black-20 align-top"
                  >
                    <td className="px-4 py-4 align-top">{item.id}</td>

                    <td className="px-4 py-4">
                      <PengajuanSummaryCell pengajuan={item} />
                    </td>

                    <td className="px-5 py-4 align-top">
                      <StatusBadge status={getPengajuanStatus(item)} />
                    </td>

                    <td className="px-6 py-4 text-center align-top">
                      <Link
                        to={`/dosen/pengajuan/${item.id}`}
                        className="inline-flex rounded-lg border border-black-40 px-3 py-2 text-center text-body-xxs-medium text-black-100 no-underline hover:bg-black-20"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredPengajuan.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-black-80">
                      Belum ada data pengajuan yang sesuai filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DosenPengajuanListPage;
