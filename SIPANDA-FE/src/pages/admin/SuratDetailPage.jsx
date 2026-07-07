import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePengajuan } from "../../context/pengajuanContext";
import { updateStatusWithHistory } from "../../utils/pengajuanDetailHelpers";
import { getNowSqlDateTime } from "../../utils/dateHelpers";
import {
  generateNomorSurat,
  getDefaultTanggalSurat,
  getDisplayTanggalSurat,
  getBlockedSuratDateReason,
  findNextAvailableSuratDate,
  isBlockedSuratDate,
  getMinimumTanggalSurat,
} from "../../utils/suratHelpers";
import {
  getFinalDocument,
  getCurrentStageDocuments,
  getPreviousStageDocuments,
} from "../../utils/documentHelpers";
import {
  canGenerateTemplate,
  getTemplateConfig,
  getTemplateKey,
  getUnavailableTemplateMessage,
} from "../../utils/suratTemplateRegistry";
import { downloadGeneratedSuratDocx } from "../../utils/docxTemplateGenerator";
import { getPengajuanStatus } from "../../utils/pengajuanHelpers";
import {
  deduplicateDocuments,
  getRelatedStages,
  getNearestParentPengajuan,
} from "../../utils/pengajuanRelationHelpers";

import SuratSummarySection from "../../components/admin/detail/SuratSummarySection";
import SuratDocumentsSection from "../../components/admin/detail/SuratDocumentsSection";
import SuratInfoSection from "../../components/admin/detail/SuratInfoSection";
import SuratDraftPreviewSection from "../../components/admin/surat/SuratDraftPreviewSection";
import SuratFinalSection from "../../components/admin/surat/SuratFinalSection";
import StatusHistorySection from "../../components/pengajuan/detail/StatusHistorySection.jsx";
import { toBase64 } from "../../utils/dosenCreatePengajuanPayload.js";

function isPdfFile(file) {
  if (!file) return false;

  const fileName = String(file.name || "").toLowerCase();
  return file.type === "application/pdf" || fileName.endsWith(".pdf");
}

function formatWarningDate(value) {
  const [year, month, day] = String(value || "").split("-");
  if (!year || !month || !day) return value;

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

function isPreviousStageMinimumWarning(pengajuan, blockedReason = "") {
  if (!pengajuan || !blockedReason) return false;

  const tahap = String(pengajuan.tahap || "").toUpperCase();

  if (tahap !== "KEMAJUAN" && tahap !== "PENGESAHAN") {
    return false;
  }

  return blockedReason.includes("tidak boleh sebelum");
}

function buildTanggalSuratWarningMessage(
  pengajuan,
  blockedReason,
  nextAvailableDate,
) {
  const formattedNextDate = formatWarningDate(nextAvailableDate);
  const tahap = String(pengajuan?.tahap || "").toLowerCase();

  if (isPreviousStageMinimumWarning(pengajuan, blockedReason)) {
    return `Tanggal surat ${tahap} minimal ${formattedNextDate} karena mengikuti surat tahap sebelumnya. Sistem mengembalikan tanggal ke ${formattedNextDate}.`;
  }

  return `${blockedReason} Tanggal surat diubah ke ${formattedNextDate}.`;
}

function SuratDetailPage() {
  const { id } = useParams();
  const { pengajuanData, usersData, getPengajuanById, updatePengajuanById } =
    usePengajuan();

  const pengajuan = getPengajuanById(id);
  const fileInputRef = useRef(null);

  const parentPengajuan = useMemo(() => {
    if (!pengajuan) return null;
    return getNearestParentPengajuan(pengajuan, pengajuanData);
  }, [pengajuan, pengajuanData]);

  const ancestorStages = useMemo(() => {
    if (!pengajuan) return [];
    return getRelatedStages(pengajuan, pengajuanData);
  }, [pengajuan, pengajuanData]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [tanggalSurat, setTanggalSurat] = useState(() =>
    pengajuan ? getDefaultTanggalSurat(pengajuan, pengajuanData) : "2026-01-01",
  );

  const currentStatus = getPengajuanStatus(pengajuan);
  const isAllowed =
    currentStatus === "DISETUJUI" || currentStatus === "SELESAI";

  const displayedTanggalSurat = useMemo(() => {
    if (!pengajuan) return "";
    return getDisplayTanggalSurat(pengajuan, tanggalSurat, pengajuanData);
  }, [pengajuan, tanggalSurat, pengajuanData]);

  const nomorSurat = useMemo(() => {
    if (!pengajuan) return "";
    return generateNomorSurat(pengajuan, displayedTanggalSurat, pengajuanData);
  }, [pengajuan, displayedTanggalSurat, pengajuanData]);

  const minimumTanggalSurat = useMemo(() => {
    if (!pengajuan) return "";
    return getMinimumTanggalSurat(pengajuan, pengajuanData);
  }, [pengajuan, pengajuanData]);

  const existingFinalDoc = useMemo(() => {
    if (!pengajuan) return null;
    return getFinalDocument(pengajuan.dokumen || []);
  }, [pengajuan]);

  const dokumenTahapIni = useMemo(() => {
    if (!pengajuan) return [];
    return getCurrentStageDocuments(pengajuan.dokumen || []);
  }, [pengajuan]);

  const dokumenTahapSebelumnya = useMemo(() => {
    const docs = ancestorStages.flatMap((item) =>
      getPreviousStageDocuments(item.dokumen || []),
    );

    return deduplicateDocuments(docs);
  }, [ancestorStages]);

  const isTanggalEditable = currentStatus !== "SELESAI";
  const canPreviewDraf = Boolean(displayedTanggalSurat);
  const isTemplateAvailable = canGenerateTemplate(pengajuan);
  const templateKey = getTemplateKey(pengajuan);
  const templateConfig = useMemo(
    () => (pengajuan ? getTemplateConfig(pengajuan) : null),
    [pengajuan],
  );
  const unavailableTemplateMessage = getUnavailableTemplateMessage(pengajuan);

  const canUploadFinal =
    currentStatus === "DISETUJUI" &&
    Boolean(displayedTanggalSurat && nomorSurat);

  const resetSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTanggalSuratChange = (nextValue) => {
    if (!nextValue) {
      setTanggalSurat("");
      return;
    }

    const blockedReason = getBlockedSuratDateReason(
      nextValue,
      pengajuan,
      pengajuanData,
    );

    if (blockedReason) {
      const nextAvailableDate = findNextAvailableSuratDate(
        nextValue,
        pengajuan,
        pengajuanData,
      );

      const warningMessage = buildTanggalSuratWarningMessage(
        pengajuan,
        blockedReason,
        nextAvailableDate,
      );

      alert(warningMessage);
      setTanggalSurat(nextAvailableDate);
      return;
    }

    setTanggalSurat(nextValue);
  };

  const handleDownloadGeneratedDocx = async () => {
    if (!pengajuan || !isTemplateAvailable || !templateConfig) return;

    try {
      setIsGeneratingDocx(true);

      await downloadGeneratedSuratDocx({
        pengajuan,
        pengajuanData,
        usersData,
        nomorSurat,
        tanggalSurat: displayedTanggalSurat,
      });
    } catch (error) {
      alert(error.message || "Gagal mengunduh DOCX.");
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handleFileChange = (event) => {
    if (!canUploadFinal) return;

    const file = event.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!isPdfFile(file)) {
      alert("File surat final harus berformat PDF.");
      resetSelectedFile();
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveSelectedFile = () => {
    resetSelectedFile();
  };

  const handleSimpanSuratFinal = async () => {
    if (!pengajuan || currentStatus !== "DISETUJUI") return;
    if (!canUploadFinal || !selectedFile) return;

    if (isBlockedSuratDate(displayedTanggalSurat, pengajuan, pengajuanData)) {
      const blockedReason = getBlockedSuratDateReason(
        displayedTanggalSurat,
        pengajuan,
        pengajuanData,
      );
      const nextAvailableDate = findNextAvailableSuratDate(
        displayedTanggalSurat,
        pengajuan,
        pengajuanData,
      );

      alert(`${blockedReason} Silakan gunakan tanggal ${nextAvailableDate}.`);
      setTanggalSurat(nextAvailableDate);
      return;
    }

    try {
      const base64Data = await toBase64(selectedFile);
      const createdAt = getNowSqlDateTime();

      updatePengajuanById(id, (previous) => {
        const dokumenTanpaFinal = (previous.dokumen || []).filter(
          (doc) => doc.kode_dokumen !== "SURAT_FINAL",
        );

        const suratFinalBaru = {
          // id: Date.now(), // Omit if using DB auto-increment
          pengajuan_id: previous.id,
          kode_dokumen: "SURAT_FINAL",
          original_name: selectedFile.name,
          mime_type: "application/pdf",
          file_size_bytes: selectedFile.size || 0,
          file_base64: base64Data,
          created_at: createdAt,
          updated_at: createdAt,
        };

        return updateStatusWithHistory(
          previous,
          "SELESAI",
          "Surat final diunggah.",
          {
            nomor_surat: generateNomorSurat(
              previous,
              displayedTanggalSurat,
              pengajuanData,
            ),
            tanggal_surat: displayedTanggalSurat,
            dokumen: [...dokumenTanpaFinal, suratFinalBaru],
          },
          { createdAt, userId: localStorage.getItem("userId") },
        );
      });

      resetSelectedFile();
    } catch (error) {
      console.error("Gagal mengonversi file:", error);
      alert("Gagal memproses file. Silakan coba lagi.");
    }
  };

  if (!pengajuan) {
    return (
      <div className="rounded-xl border border-black-40 bg-white p-6">
        <div className="text-base font-semibold text-black-100">
          Data pengajuan tidak ditemukan.
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/surat"
            className="inline-flex items-center justify-center p-1 no-underline"
          >
            <img src="/icons/back.svg" alt="Kembali" className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-black-100">Detail Surat</h1>
        </div>

        <div className="rounded-xl border border-black-40 bg-white p-6">
          <div className="text-base font-semibold text-black-100">
            Pengajuan ini belum bisa diproses di halaman surat.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/surat"
          className="inline-flex items-center justify-center p-1 no-underline"
        >
          <img src="/icons/back.svg" alt="Kembali" className="h-5 w-5" />
        </Link>

        <h1 className="text-xl font-semibold text-black-100">Detail Surat</h1>
      </div>

      <SuratSummarySection pengajuan={pengajuan} />

      <SuratDocumentsSection
        dokumenTahapIni={dokumenTahapIni}
        dokumenTahapSebelumnya={dokumenTahapSebelumnya}
      />

      <SuratInfoSection
        nomorSurat={nomorSurat}
        displayedTanggalSurat={displayedTanggalSurat}
        isTanggalEditable={isTanggalEditable}
        onTanggalSuratChange={handleTanggalSuratChange}
        initialTanggalSuratMonth={
          pengajuan?.tanggal_pengajuan || minimumTanggalSurat
        }
      />

      {!isTemplateAvailable ? (
        <div className="rounded-xl border border-warning-100 bg-warning-20 px-4 py-3 text-sm font-medium text-warning-100">
          {unavailableTemplateMessage}
        </div>
      ) : null}

      {canPreviewDraf ? (
        <SuratDraftPreviewSection
          pengajuan={pengajuan}
          parentPengajuan={parentPengajuan}
          templateKey={templateKey}
          nomorSurat={nomorSurat}
          tanggalSurat={displayedTanggalSurat}
          onDownloadDraft={
            isTemplateAvailable ? handleDownloadGeneratedDocx : null
          }
          isDownloadDisabled={isGeneratingDocx}
          downloadLabel={
            isGeneratingDocx ? "Menyiapkan Draf DOCX..." : "Unduh Draf DOCX"
          }
        />
      ) : null}

      <SuratFinalSection
        pengajuan={pengajuan}
        existingFinalDoc={existingFinalDoc}
        selectedFile={selectedFile}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onRemoveSelectedFile={handleRemoveSelectedFile}
        onSimpanSuratFinal={handleSimpanSuratFinal}
        isSaveDisabled={!selectedFile || !canUploadFinal}
        isUploadDisabled={!canUploadFinal}
      />

      <StatusHistorySection pengajuan={pengajuan} />
    </div>
  );
}

export default SuratDetailPage;
