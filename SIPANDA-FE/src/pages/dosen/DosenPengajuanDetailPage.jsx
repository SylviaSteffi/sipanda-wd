import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { usePengajuan } from "../../context/pengajuanContext";
import {
  getCurrentStageDocuments,
  getFinalDocument,
  getPreviousStageDocuments,
} from "../../utils/documentHelpers";
import {
  deduplicateDocuments,
  getRelatedStages,
} from "../../utils/pengajuanRelationHelpers";
import { canAccessDosenPengajuan } from "../../utils/dosenPengajuanHelpers";
import { getNowSqlDateTime } from "../../utils/dateHelpers";
import { getPengajuanStatus } from "../../utils/pengajuanHelpers";
import { updateStatusWithHistory } from "../../utils/pengajuanDetailHelpers";

import {
  buildClarificationResponseMessage,
  buildUpdatedClarificationDocuments,
  getClarificationDocumentSelectionError,
  getClarificationDocumentSlots,
  getClarificationEditableFields,
  getInitialClarificationFormValues,
  markLatestClarificationAnswered,
  normalizeClarificationFormValues,
  validateClarificationForm,
} from "../../utils/dosenClarificationHelpers";

import PengajuanInfoSection from "../../components/pengajuan/detail/PengajuanInfoSection";
import PengajuanFormSection from "../../components/pengajuan/detail/PengajuanFormSection";
import PengajuanSupportSection from "../../components/pengajuan/detail/PengajuanSupportSection";
import PengajuanDocumentsSection from "../../components/pengajuan/detail/PengajuanDocumentsSection";
import StatusHistorySection from "../../components/pengajuan/detail/StatusHistorySection";

import DosenNotesSection from "../../components/dosen/detail/DosenNotesSection";
import DosenFinalDocumentSection from "../../components/dosen/detail/DosenFinalDocumentSection";
import DosenClarificationSection from "../../components/dosen/detail/DosenClarificationSection";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createEmptyClarificationDraft() {
  return {
    sourceKey: "",
    values: {},
    files: {},
    errors: {},
  };
}

function DosenPengajuanDetailPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const { pengajuanData, getPengajuanById, updatePengajuanById } =
    usePengajuan();

  const pengajuan = getPengajuanById(id);

  const [clarificationDraft, setClarificationDraft] = useState(
    createEmptyClarificationDraft,
  );
  const [isSubmittingClarification, setIsSubmittingClarification] =
    useState(false);
  const [isClarificationOpen, setIsClarificationOpen] = useState(false);

  const clarificationSourceKey = useMemo(() => {
    if (!pengajuan) return "";
    return `${pengajuan.id}-${pengajuan.updated_at || pengajuan.created_at || ""}`;
  }, [pengajuan]);

  const initialClarificationValues = useMemo(() => {
    if (!pengajuan) return {};
    return getInitialClarificationFormValues(pengajuan);
  }, [pengajuan]);

  const clarificationValues =
    clarificationDraft.sourceKey === clarificationSourceKey
      ? clarificationDraft.values
      : initialClarificationValues;

  const clarificationFiles =
    clarificationDraft.sourceKey === clarificationSourceKey
      ? clarificationDraft.files
      : {};

  const clarificationErrors =
    clarificationDraft.sourceKey === clarificationSourceKey
      ? clarificationDraft.errors
      : {};

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

  const finalDocument = useMemo(() => {
    if (!pengajuan) return null;
    return getFinalDocument(pengajuan.dokumen || []);
  }, [pengajuan]);

  const clarificationEditableFields = useMemo(
    () => getClarificationEditableFields(pengajuan, clarificationValues),
    [pengajuan, clarificationValues],
  );

  const clarificationDocumentSlots = useMemo(
    () => getClarificationDocumentSlots(pengajuan, clarificationValues),
    [pengajuan, clarificationValues],
  );

  const canRevise = getPengajuanStatus(pengajuan) === "PERLU_KLARIFIKASI";

  const buildDraftState = (updater) => {
    setClarificationDraft((prev) => {
      const currentValues =
        prev.sourceKey === clarificationSourceKey
          ? prev.values
          : initialClarificationValues;
      const currentFiles =
        prev.sourceKey === clarificationSourceKey ? prev.files : {};
      const currentErrors =
        prev.sourceKey === clarificationSourceKey ? prev.errors : {};

      return updater({
        sourceKey: clarificationSourceKey,
        currentValues,
        currentFiles,
        currentErrors,
      });
    });
  };

  const handleOpenClarification = () => {
    if (!canRevise) return;
    setIsClarificationOpen(true);
  };

  const handleCloseClarification = () => {
    setIsClarificationOpen(false);
  };

  const handleClarificationFieldChange = (key, value) => {
    buildDraftState(
      ({ sourceKey, currentValues, currentFiles, currentErrors }) => ({
        sourceKey,
        values: { ...currentValues, [key]: value },
        files: currentFiles,
        errors: { ...currentErrors, [key]: "" },
      }),
    );
  };

  const handleClarificationDocumentChange = (kodeDokumen, file) => {
    const slot = clarificationDocumentSlots.find(
      (item) => item.kode_dokumen === kodeDokumen,
    );

    const selectionError = slot
      ? getClarificationDocumentSelectionError(slot, file)
      : "";

    if (selectionError) {
      buildDraftState(
        ({ sourceKey, currentValues, currentFiles, currentErrors }) => {
          const nextFiles = { ...currentFiles };
          delete nextFiles[kodeDokumen];
          return {
            sourceKey,
            values: currentValues,
            files: nextFiles,
            errors: {
              ...currentErrors,
              [`dokumen_${kodeDokumen}`]: selectionError,
            },
          };
        },
      );
      return;
    }

    buildDraftState(
      ({ sourceKey, currentValues, currentFiles, currentErrors }) => ({
        sourceKey,
        values: currentValues,
        files: { ...currentFiles, [kodeDokumen]: file },
        errors: { ...currentErrors, [`dokumen_${kodeDokumen}`]: "" },
      }),
    );
  };

  const handleClarificationDocumentRemove = (kodeDokumen) => {
    buildDraftState(
      ({ sourceKey, currentValues, currentFiles, currentErrors }) => {
        const nextFiles = { ...currentFiles };
        delete nextFiles[kodeDokumen];
        return {
          sourceKey,
          values: currentValues,
          files: nextFiles,
          errors: { ...currentErrors, [`dokumen_${kodeDokumen}`]: "" },
        };
      },
    );
  };

  const handleSubmitClarification = async () => {
    if (!pengajuan || !canRevise) return;

    const validationErrors = validateClarificationForm(
      pengajuan,
      clarificationValues,
      clarificationFiles,
    );

    if (Object.keys(validationErrors).length > 0) {
      buildDraftState(({ sourceKey, currentValues, currentFiles }) => ({
        sourceKey,
        values: currentValues,
        files: currentFiles,
        errors: validationErrors,
      }));
      return;
    }

    setIsSubmittingClarification(true);

    const base64Files = {};
    for (const [kode, file] of Object.entries(clarificationFiles)) {
      if (file instanceof File) {
        try {
          base64Files[kode] = await fileToBase64(file);
        } catch {
          base64Files[kode] = "";
        }
      }
    }

    const createdAt = getNowSqlDateTime();

    updatePengajuanById(id, (previous) => {
      const normalizedDetail = normalizeClarificationFormValues(
        previous,
        clarificationValues,
      );

      const updatedDokumen = buildUpdatedClarificationDocuments(
        previous,
        clarificationValues,
        clarificationFiles,
        createdAt,
        base64Files,
      );

      const pesanDosen = buildClarificationResponseMessage(
        previous,
        clarificationValues,
        clarificationFiles,
      );

      const updatedKlarifikasi = markLatestClarificationAnswered(
        previous.klarifikasi || [],
        {
          waktu_jawab: createdAt,
          pesan_dosen: pesanDosen,
        },
      );

      return updateStatusWithHistory(
        previous,
        "DIAJUKAN",
        "Dosen mengirim perbaikan klarifikasi.",
        {
          detail: normalizedDetail,
          dokumen: updatedDokumen,
          klarifikasi: updatedKlarifikasi,
          catatan_admin: null,
        },
        {
          userId,
          createdAt,
        },
      );
    });

    setClarificationDraft(createEmptyClarificationDraft());
    setIsClarificationOpen(false);
    setIsSubmittingClarification(false);

    alert(
      "Perbaikan berhasil dikirim. Pengajuan kembali masuk ke antrean pemeriksaan.",
    );
  };

  if (!pengajuan) {
    return (
      <div className="rounded-xl border border-black-40 bg-white p-6">
        <div className="text-base font-semibold text-black-100">
          Data pengajuan tidak ditemukan.
        </div>
        <p className="mt-2 text-sm text-black-80">
          Silakan kembali ke halaman pengajuan saya.
        </p>
        <Link
          to="/dosen/pengajuan"
          className="mt-4 inline-flex rounded-lg border border-black-40 px-4 py-2 text-sm font-medium text-black-100 no-underline hover:bg-black-20"
        >
          Kembali
        </Link>
      </div>
    );
  }

  if (!canAccessDosenPengajuan(pengajuan, userId)) {
    return <Navigate to="/dosen/pengajuan" replace />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/dosen/pengajuan"
          aria-label="Kembali ke pengajuan saya"
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

      {finalDocument ? (
        <DosenFinalDocumentSection finalDocument={finalDocument} />
      ) : null}

      <DosenNotesSection
        pengajuan={pengajuan}
        finalDocument={finalDocument}
        onOpenClarification={handleOpenClarification}
      />

      <StatusHistorySection pengajuan={pengajuan} />

      <DosenClarificationSection
        open={isClarificationOpen}
        editableFields={clarificationEditableFields}
        formValues={clarificationValues}
        errors={clarificationErrors}
        documentFiles={clarificationFiles}
        documentSlots={clarificationDocumentSlots}
        isSubmitting={isSubmittingClarification}
        onClose={handleCloseClarification}
        onFieldChange={handleClarificationFieldChange}
        onDocumentChange={handleClarificationDocumentChange}
        onRemoveDocument={handleClarificationDocumentRemove}
        onSubmitRevision={handleSubmitClarification}
      />
    </div>
  );
}

export default DosenPengajuanDetailPage;
