import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePengajuan } from "../../context/pengajuanContext";
import { updateStatusWithHistory } from "../../utils/pengajuanDetailHelpers.js";
import { getNowSqlDateTime } from "../../utils/dateHelpers";
import {
  getCurrentStageDocuments,
  getPreviousStageDocuments,
} from "../../utils/documentHelpers";
import { getPengajuanStatus } from "../../utils/pengajuanHelpers";
import {
  deduplicateDocuments,
  getRelatedStages,
} from "../../utils/pengajuanRelationHelpers";

import PengajuanInfoSection from "../../components/pengajuan/detail/PengajuanInfoSection";
import PengajuanFormSection from "../../components/pengajuan/detail/PengajuanFormSection";
import PengajuanSupportSection from "../../components/pengajuan/detail/PengajuanSupportSection";
import PengajuanDocumentsSection from "../../components/pengajuan/detail/PengajuanDocumentsSection";
import AdminNotesSection from "../../components/admin/detail/AdminNotesSection";
import AdminActionSection from "../../components/admin/detail/AdminActionSection";
import StatusHistorySection from "../../components/pengajuan/detail/StatusHistorySection";

function PengajuanDetailPage() {
  const { id } = useParams();
  const { pengajuanData, getPengajuanById, updatePengajuanById } =
    usePengajuan();

  const pengajuan = getPengajuanById(id);

  const [activeAction, setActiveAction] = useState("");
  const [klarifikasiInput, setKlarifikasiInput] = useState("");
  const [alasanTolak, setAlasanTolak] = useState("");

  const previousStagePengajuan = useMemo(() => {
    if (!pengajuan) return [];
    return getRelatedStages(pengajuan, pengajuanData);
  }, [pengajuan, pengajuanData]);

  const dokumenTahapIni = useMemo(() => {
    if (!pengajuan) return [];
    return getCurrentStageDocuments(pengajuan.dokumen || []);
  }, [pengajuan]);

  const dokumenTahapSebelumnya = useMemo(() => {
    const docs = previousStagePengajuan.flatMap((item) =>
      getPreviousStageDocuments(item.dokumen || []),
    );

    return deduplicateDocuments(docs);
  }, [previousStagePengajuan]);

  if (!pengajuan) {
    return (
      <div className="rounded-xl border border-black-40 bg-white p-6">
        <div className="text-base font-semibold text-black-100">
          Data pengajuan tidak ditemukan.
        </div>
        <p className="mt-2 text-sm text-black-80">
          Kembali ke halaman kelola pengajuan untuk memilih data lain.
        </p>
        <Link
          to="/admin/pengajuan"
          className="mt-4 inline-flex rounded-lg border border-black-40 px-4 py-2 text-sm font-medium text-black-100 no-underline hover:bg-black-20"
        >
          Kembali
        </Link>
      </div>
    );
  }

  const currentStatus = getPengajuanStatus(pengajuan);

  const handleMulaiPeriksa = () => {
    if (currentStatus !== "DIAJUKAN") return;

    updatePengajuanById(id, (prev) =>
      updateStatusWithHistory(
        prev,
        "DALAM_PEMERIKSAAN",
        "Admin mulai memeriksa pengajuan.",
        {},
        {
          userId: localStorage.getItem("userId") || 1,
        },
      ),
    );
  };

  const handleKirimKlarifikasi = () => {
    if (currentStatus !== "DALAM_PEMERIKSAAN") return;
    if (!klarifikasiInput.trim()) return;

    const pesan = klarifikasiInput.trim();
    const createdAt = getNowSqlDateTime();

    updatePengajuanById(id, (prev) =>
      updateStatusWithHistory(
        prev,
        "PERLU_KLARIFIKASI",
        "Admin mengirim klarifikasi.",
        {
          klarifikasi: [
            {
              id: -Date.now(),
              pengajuan_id: prev.id,
              pesan_admin: pesan,
              waktu_minta: createdAt,
              status_klarifikasi: "MENUNGGU",
              pesan_dosen: null,
              waktu_jawab: null,
            },
            ...(prev.klarifikasi || []),
          ],
        },
        { createdAt, userId: localStorage.getItem("userId") },
      ),
    );

    setKlarifikasiInput("");
    setActiveAction("");
  };

  const handleSetujui = () => {
    if (currentStatus !== "DALAM_PEMERIKSAAN") return;

    updatePengajuanById(id, (prev) =>
      updateStatusWithHistory(
        prev,
        "DISETUJUI",
        "Pengajuan disetujui.",
        {},
        {
          userId: localStorage.getItem("userId"),
        },
      ),
    );

    setActiveAction("");
  };

  const handleTolak = () => {
    if (currentStatus !== "DALAM_PEMERIKSAAN") return;
    if (!alasanTolak.trim()) return;

    const alasan = alasanTolak.trim();

    updatePengajuanById(id, (prev) =>
      updateStatusWithHistory(
        prev,
        "DITOLAK",
        `Pengajuan ditolak. Alasan: ${alasan}`,
        {
          catatan_admin: alasan,
        },
        {
          userId: localStorage.getItem("userId"),
        },
      ),
    );

    setAlasanTolak("");
    setActiveAction("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/pengajuan"
          aria-label="Kembali ke kelola pengajuan"
          title="Kembali"
          className="inline-flex items-center justify-center p-1 no-underline"
        >
          <img src="/icons/back.svg" alt="Kembali" className="h-5 w-5" />
        </Link>

        <h1 className="text-xl font-semibold text-black-100">
          Detail Pengajuan
        </h1>
      </div>

      <PengajuanInfoSection pengajuan={pengajuan} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <PengajuanFormSection pengajuan={pengajuan} />
        <PengajuanSupportSection pengajuan={pengajuan} />
      </div>

      <PengajuanDocumentsSection
        pengajuan={pengajuan}
        dokumenTahapSebelumnya={dokumenTahapSebelumnya}
        dokumenTahapIni={dokumenTahapIni}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AdminNotesSection pengajuan={pengajuan} />
        <AdminActionSection
          pengajuan={pengajuan}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          klarifikasiInput={klarifikasiInput}
          setKlarifikasiInput={setKlarifikasiInput}
          alasanTolak={alasanTolak}
          setAlasanTolak={setAlasanTolak}
          onMulaiPeriksa={handleMulaiPeriksa}
          onKirimKlarifikasi={handleKirimKlarifikasi}
          onSetujui={handleSetujui}
          onTolak={handleTolak}
        />
      </div>

      <StatusHistorySection pengajuan={pengajuan} />
    </div>
  );
}

export default PengajuanDetailPage;
