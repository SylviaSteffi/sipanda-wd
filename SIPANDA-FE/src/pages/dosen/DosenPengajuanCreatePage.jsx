import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { usePengajuan } from "../../context/pengajuanContext";
import SectionCard from "../../components/ui/SectionCard";
import Button from "../../components/ui/Button";
import {
  buildCreatePengajuanPayload,
  getCreatePengajuanFieldConfig,
  getEffectiveJenisPengajuan,
  getInitialCreateFormValues,
  getInitialMemberItem,
  getKategoriOptionsByTahap,
  getRequiredDocumentConfig,
  getSupportedTahapMessage,
  isKelompokAllowed,
  normalizeCreateFormValues,
  validateCreatePengajuanForm,
  MAX_ANGGOTA_KELOMPOK_DOSEN,
} from "../../utils/dosenCreatePengajuanHelpers";
import { getCreatePengajuanAvailability } from "../../utils/pengajuanCreateAvailabilityHelpers";
import CreatePengajuanBlockedState from "../../components/dosen/create/CreatePengajuanBlockedState";
import CreatePengajuanServiceSection from "../../components/dosen/create/CreatePengajuanServiceSection";
import CreatePengajuanPemohonSection from "../../components/dosen/create/CreatePengajuanPemohonSection";
import CreatePengajuanMemberSection from "../../components/dosen/create/CreatePengajuanMemberSection";
import CreatePengajuanFormFieldsSection from "../../components/dosen/create/CreatePengajuanFormFieldsSection";
import CreatePengajuanDocumentsSection from "../../components/dosen/create/CreatePengajuanDocumentsSection";

function DosenPengajuanCreatePage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const {
    getUserById,
    getActiveAkademik,
    createPengajuan,
    usersData = [],
  } = usePengajuan();

  const pemohon = useMemo(() => getUserById(userId), [getUserById, userId]);
  const activeAkademik = useMemo(
    () => getActiveAkademik(),
    [getActiveAkademik],
  );
  const createAvailability = useMemo(
    () => getCreatePengajuanAvailability(),
    [],
  );

  const [tahap, setTahap] = useState("TUGAS");
  const [kategori, setKategori] = useState("PENELITIAN");
  const [jenisPengajuan, setJenisPengajuan] = useState("INDIVIDU");
  const [formValues, setFormValues] = useState(() =>
    getInitialCreateFormValues(),
  );
  const [memberEntries, setMemberEntries] = useState([]);
  const [documentFiles, setDocumentFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anggotaFakultasFilter, setAnggotaFakultasFilter] =
    useState("SAME_FAKULTAS");

  const unsupportedMessage = getSupportedTahapMessage(tahap);

  const kategoriOptions = useMemo(
    () => getKategoriOptionsByTahap(tahap),
    [tahap],
  );

  const kelompokAllowed = useMemo(
    () => isKelompokAllowed(tahap, kategori),
    [tahap, kategori],
  );

  const effectiveJenisPengajuan = useMemo(
    () => getEffectiveJenisPengajuan(tahap, kategori, jenisPengajuan),
    [tahap, kategori, jenisPengajuan],
  );

  const isMaxAnggotaReached =
    memberEntries.length >= MAX_ANGGOTA_KELOMPOK_DOSEN;

  const fieldConfig = useMemo(
    () => getCreatePengajuanFieldConfig(tahap, kategori, formValues),
    [tahap, kategori, formValues],
  );

  const requiredDocuments = useMemo(
    () => getRequiredDocumentConfig(tahap, kategori, formValues),
    [tahap, kategori, formValues],
  );

  if (!pemohon || !activeAkademik) {
    return <Navigate to="/dosen/pengajuan" replace />;
  }

  const isCreateBlocked = createAvailability.isBlocked;

  const clearErrors = (...keys) => {
    if (keys.length === 0) {
      setErrors({});
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };

      keys.forEach((key) => {
        next[key] = "";
      });

      return next;
    });
  };

  const resetKelompokState = (nextJenisPengajuan = "INDIVIDU") => {
    const normalizedJenisPengajuan =
      nextJenisPengajuan === "KELOMPOK" ? "KELOMPOK" : "INDIVIDU";

    setJenisPengajuan(normalizedJenisPengajuan);

    setMemberEntries(
      normalizedJenisPengajuan === "KELOMPOK" ? [getInitialMemberItem()] : [],
    );

    setAnggotaFakultasFilter("SAME_FAKULTAS");
  };

  const removeDocumentFile = (code) => {
    setDocumentFiles((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  };

  const syncJenisPengajuanState = (
    nextTahap,
    nextKategori,
    preferredJenisPengajuan = jenisPengajuan,
  ) => {
    const nextEffectiveJenisPengajuan = getEffectiveJenisPengajuan(
      nextTahap,
      nextKategori,
      preferredJenisPengajuan,
    );

    resetKelompokState(nextEffectiveJenisPengajuan);
  };

  const handleLayananChange = (value) => {
    if (isCreateBlocked) return;

    const nextTahap = value;
    const nextKategoriOptions = getKategoriOptionsByTahap(nextTahap);
    const isCurrentKategoriStillValid = nextKategoriOptions.some(
      (item) => item.value === kategori,
    );

    const nextKategori = isCurrentKategoriStillValid
      ? kategori
      : nextKategoriOptions[0]?.value || "PENELITIAN";

    setTahap(nextTahap);
    setKategori(nextKategori);
    syncJenisPengajuanState(nextTahap, nextKategori, jenisPengajuan);
    clearErrors();
  };

  const handleKategoriChange = (value) => {
    if (isCreateBlocked) return;

    const nextKategori = value;

    setKategori(nextKategori);
    syncJenisPengajuanState(tahap, nextKategori, jenisPengajuan);
    clearErrors();
  };

  const handleJenisPengajuanChange = (value) => {
    if (isCreateBlocked) return;

    const nextJenisPengajuan = getEffectiveJenisPengajuan(
      tahap,
      kategori,
      value,
    );

    resetKelompokState(nextJenisPengajuan);
    clearErrors("anggota", "form");
  };

  const handleFieldChange = (event) => {
    if (isCreateBlocked) return;

    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearErrors(name, "form");
  };

  const handleAddMember = () => {
    if (isCreateBlocked || isMaxAnggotaReached) return;

    setMemberEntries((prev) => [...prev, getInitialMemberItem()]);
    clearErrors("anggota", "form");
  };

  const handleMemberChange = (index, key, value) => {
    if (isCreateBlocked) return;

    setMemberEntries((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );

    clearErrors("anggota", "form");
  };

  const handleRemoveMember = (index) => {
    if (isCreateBlocked) return;

    setMemberEntries((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );

    clearErrors("anggota", "form");
  };

  const handleFileChange = (code, file) => {
    if (isCreateBlocked) return;

    const documentConfig = requiredDocuments.find((item) => item.code === code);

    if (!file) {
      removeDocumentFile(code);
      clearErrors(`doc_${code}`, "form");
      return;
    }

    const validationError = documentConfig
      ? validateCreatePengajuanForm({
          tahap,
          kategori,
          jenisPengajuan: effectiveJenisPengajuan,
          formValues: normalizeCreateFormValues(formValues),
          memberEntries,
          requiredDocuments: [documentConfig],
          documentFiles: { [code]: file },
        })[`doc_${code}`]
      : "";

    if (validationError) {
      removeDocumentFile(code);
      setErrors((prev) => ({
        ...prev,
        [`doc_${code}`]: validationError,
        form: "",
      }));
      return;
    }

    setDocumentFiles((prev) => ({
      ...prev,
      [code]: file,
    }));

    clearErrors(`doc_${code}`, "form");
  };

  const handleRemoveFile = (code) => {
    if (isCreateBlocked) return;

    removeDocumentFile(code);
    clearErrors(`doc_${code}`, "form");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isCreateBlocked) {
      setErrors({
        form:
          createAvailability.message ||
          "Hari ini pengajuan tidak dapat dibuat.",
      });
      return;
    }

    if (unsupportedMessage) {
      setErrors({ form: unsupportedMessage });
      return;
    }

    const normalizedValues = normalizeCreateFormValues(formValues);
    const nextErrors = validateCreatePengajuanForm({
      tahap,
      kategori,
      jenisPengajuan: effectiveJenisPengajuan,
      formValues: normalizedValues,
      memberEntries,
      requiredDocuments,
      documentFiles,
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = await buildCreatePengajuanPayload({
        tahap,
        kategori,
        jenisPengajuan: effectiveJenisPengajuan,
        akademikId: activeAkademik.id,
        pemohon,
        formValues: normalizedValues,
        memberEntries,
        requiredDocuments,
        documentFiles,
        usersData,
      });

      createPengajuan(payload)
        .then((created) => {
          console.log(created);
          navigate(`/dosen/pengajuan/${created.id}`, { replace: true });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      setErrors({
        form: error?.message || "Terjadi kesalahan saat membuat pengajuan.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-black-100">Buat Pengajuan</h1>
      </div>

      {isCreateBlocked ? (
        <CreatePengajuanBlockedState createAvailability={createAvailability} />
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <CreatePengajuanServiceSection
            tahap={tahap}
            kategori={kategori}
            jenisPengajuan={effectiveJenisPengajuan}
            kategoriOptions={kategoriOptions}
            kelompokAllowed={kelompokAllowed}
            onLayananChange={handleLayananChange}
            onKategoriChange={handleKategoriChange}
            onJenisPengajuanChange={handleJenisPengajuanChange}
          />

          <SectionCard>
            <div className="space-y-6">
              {unsupportedMessage ? (
                <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm text-warning-100">
                  {unsupportedMessage}
                </div>
              ) : null}

              <CreatePengajuanPemohonSection pemohon={pemohon} />

              {effectiveJenisPengajuan === "KELOMPOK" ? (
                <CreatePengajuanMemberSection
                  usersData={usersData}
                  userId={userId}
                  pemohon={pemohon}
                  memberEntries={memberEntries}
                  anggotaFakultasFilter={anggotaFakultasFilter}
                  setAnggotaFakultasFilter={setAnggotaFakultasFilter}
                  onAddMember={handleAddMember}
                  onMemberChange={handleMemberChange}
                  onRemoveMember={handleRemoveMember}
                  errors={errors}
                  isCreateBlocked={isCreateBlocked}
                  isMaxAnggotaReached={isMaxAnggotaReached}
                />
              ) : null}

              <CreatePengajuanFormFieldsSection
                fieldConfig={fieldConfig}
                formValues={formValues}
                errors={errors}
                onFieldChange={handleFieldChange}
              />

              <CreatePengajuanDocumentsSection
                requiredDocuments={requiredDocuments}
                documentFiles={documentFiles}
                errors={errors}
                onFileChange={handleFileChange}
                onRemoveFile={handleRemoveFile}
              />

              {errors.form ? (
                <div className="rounded-lg bg-error-20 px-4 py-3 text-sm text-error-100">
                  {errors.form}
                </div>
              ) : null}

              <div className="flex justify-start gap-3 pt-1">
                <Link
                  to="/dosen/pengajuan"
                  className="inline-flex rounded-lg border border-black-40 px-4 py-2.5 text-sm font-medium text-black-100 no-underline hover:bg-black-20"
                >
                  Batal
                </Link>

                <Button
                  type="submit"
                  disabled={isSubmitting || Boolean(unsupportedMessage)}
                  className="px-4 py-2.5 text-sm font-medium"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </Button>
              </div>
            </div>
          </SectionCard>
        </form>
      )}
    </div>
  );
}

export default DosenPengajuanCreatePage;
