import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePengajuan } from "../../context/pengajuanContext";
import StatusBadge from "../../components/ui/StatusBadge";
import ListSearchInput from "../../components/ui/ListSearchInput";
import ListFilterSelect from "../../components/ui/ListFilterSelect";
import DosenSummaryCell from "../../components/pengajuan/shared/DosenSummaryCell";
import PengajuanSummaryCell from "../../components/pengajuan/shared/PengajuanSummaryCell";
import {
  getCakupanJurnalLabel,
  getPeringkatJurnalLabel,
  getPengajuanStatus,
} from "../../utils/pengajuanHelpers";
import { matchesPengajuanSearch } from "../../utils/pengajuanListHelpers";
import {
  getActiveAkademik,
  getAkademikLabelById,
} from "../../utils/akademikHelpers";
import {
  KATEGORI_OPTIONS,
  SURAT_STATUS_OPTIONS,
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

const SURAT_READY_STATUSES = ["DISETUJUI", "SELESAI"];

function getDisplayValue(value) {
  return value || "-";
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

function SuratListPage() {
  const { pengajuanData, akademikData = [] } = usePengajuan();

  const activeAkademik = useMemo(
    () => getActiveAkademik(akademikData),
    [akademikData],
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");
  const [tahap, setTahap] = useState("");
  const [cakupanArtikel, setCakupanArtikel] = useState("");
  const [indeksArtikel, setIndeksArtikel] = useState("");
  const [selectedAkademikId, setSelectedAkademikId] = useState("");

  const effectiveAkademikId = selectedAkademikId || activeAkademik?.id || "";
  const isArtikelMode = isPengesahanArtikel(tahap, kategori);

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

  const suratReadyPengajuan = useMemo(
    () =>
      pengajuanData.filter((item) =>
        SURAT_READY_STATUSES.includes(getPengajuanStatus(item)),
      ),
    [pengajuanData],
  );

  const filteredPengajuan = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return suratReadyPengajuan.filter((item) => {
      const itemStatus = getPengajuanStatus(item);
      const akademikLabel = getAkademikLabelById(
        akademikData,
        item.akademik_id,
      );

      const matchSearch = matchesPengajuanSearch(item, keyword, akademikLabel);
      const matchStatus = !status || itemStatus === status;
      const matchKategori = !kategori || item.kategori === kategori;
      const matchTahap = !tahap || item.tahap === tahap;
      const matchAkademik =
        !effectiveAkademikId ||
        String(item.akademik_id) === String(effectiveAkademikId);

      const matchCakupanArtikel =
        !isArtikelMode ||
        !cakupanArtikel ||
        item.detail?.cakupan_jurnal === cakupanArtikel;

      const matchIndeksArtikel =
        !isArtikelMode ||
        !indeksArtikel ||
        item.detail?.peringkat_jurnal === indeksArtikel;

      return (
        matchSearch &&
        matchStatus &&
        matchKategori &&
        matchTahap &&
        matchAkademik &&
        matchCakupanArtikel &&
        matchIndeksArtikel
      );
    });
  }, [
    suratReadyPengajuan,
    akademikData,
    search,
    status,
    kategori,
    tahap,
    effectiveAkademikId,
    isArtikelMode,
    cakupanArtikel,
    indeksArtikel,
  ]);

  const exportablePengajuan = useMemo(
    () => filteredPengajuan.filter(isSelesaiPengesahanArtikel),
    [filteredPengajuan],
  );

  const canExportData = isArtikelMode && exportablePengajuan.length > 0;

  const handleTahapChange = (value) => {
    setTahap(value);
    setKategori((prev) =>
      normalizeKategoriByTahap(prev, value, KATEGORI_OPTIONS),
    );

    if (value !== "PENGESAHAN") {
      setCakupanArtikel("");
      setIndeksArtikel("");
    }
  };

  const handleKategoriChange = (value) => {
    setKategori(value);

    if (value !== "ARTIKEL") {
      setCakupanArtikel("");
      setIndeksArtikel("");
    }
  };

  const handleCakupanArtikelChange = (value) => {
    setCakupanArtikel(value);
    setIndeksArtikel("");
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setKategori("");
    setTahap("");
    setCakupanArtikel("");
    setIndeksArtikel("");
    setSelectedAkademikId(activeAkademik?.id || "");
  };

  const handleExport = () => {
    if (!isArtikelMode) {
      alert(
        "Untuk ekspor data, pilih Tahap Pengesahan dan Kategori Artikel terlebih dahulu.",
      );
      return;
    }

    if (!exportablePengajuan.length) {
      alert(
        "Belum ada data pengesahan artikel berstatus selesai yang bisa diekspor.",
      );
      return;
    }

    try {
      exportPengesahanArtikelSuratData({
        periodeLabel,
        pengajuanList: exportablePengajuan,
      });
    } catch (error) {
      alert(error.message || "Gagal mengekspor data.");
    }
  };

  return (
    <div className="min-w-0 max-w-full">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-black-100">Kelola Surat</h1>

        <button
          type="button"
          onClick={handleExport}
          disabled={!canExportData}
          className={`shrink-0 rounded-lg px-4 py-2.5 text-body-xxs-medium text-white ${
            canExportData
              ? "bg-success-100 hover:opacity-95"
              : "cursor-not-allowed bg-black-60"
          }`}
        >
          Ekspor Data
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-black-100">
            Cari Surat
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
          placeholder="Cari berdasarkan ID pengajuan, nama dosen, judul, atau periode akademik"
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <ListFilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={SURAT_STATUS_OPTIONS}
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
            onChange={setSelectedAkademikId}
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
        ) : (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm text-warning-100">
            Filter cakupan/indeks tersedia untuk{" "}
            <span className="font-medium">Pengesahan Artikel</span>. Ekspor data
            hanya dapat dilakukan jika terdapat data berstatus{" "}
            <span className="font-medium">Selesai</span>.
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-black-40 bg-white">
        <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-body-sm-medium text-black-100">Daftar Surat</h2>

          <div className="text-body-xxs-regular text-black-100">
            Menampilkan {filteredPengajuan.length} dari{" "}
            {suratReadyPengajuan.length} surat
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed text-left">
            <thead className="bg-black-20 text-body-xxs-medium text-black-80">
              <tr>
                <th className="w-12 px-4 py-4">ID</th>
                <th className="w-[24%] px-4 py-4">Dosen</th>
                <th className="w-[34%] px-4 py-4">Ringkasan</th>
                <th className="w-[18%] px-5 py-4">No Surat Final</th>
                <th className="w-[14%] px-5 py-4">Status</th>
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
                    <DosenSummaryCell pengajuan={item} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <PengajuanSummaryCell pengajuan={item} />

                      {item.tahap === "PENGESAHAN" &&
                      item.kategori === "ARTIKEL" ? (
                        <div className="text-body-xxs-regular leading-5 text-black-80">
                          {getDisplayValue(
                            getCakupanJurnalLabel(item.detail?.cakupan_jurnal),
                          )}{" "}
                          ·{" "}
                          {getDisplayValue(
                            getPeringkatJurnalLabel(
                              item.detail?.peringkat_jurnal,
                            ),
                          )}
                        </div>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="break-words text-body-xxs-regular leading-5 text-black-100">
                      {getDisplayValue(item.nomor_surat)}
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <StatusBadge status={getPengajuanStatus(item)} />
                  </td>

                  <td className="px-6 py-4 text-center align-top">
                    <Link
                      to={`/admin/surat/${item.id}`}
                      className="inline-flex rounded-lg border border-black-40 px-3 py-2 text-center text-body-xxs-medium text-black-100 no-underline hover:bg-black-20"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredPengajuan.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-black-80">
                    Tidak ada data surat.
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

export default SuratListPage;
