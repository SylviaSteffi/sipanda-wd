import { useMemo, useState } from "react";
import { usePengajuan } from "../../context/pengajuanContext";
import ListFilterSelect from "../../components/ui/ListFilterSelect";
import ListSearchInput from "../../components/ui/ListSearchInput";
import FullscreenModal from "../../components/ui/FullscreenModal";
import {
  buildDosenPayload,
  createDosenForm,
  createEmptyDosenForm,
  getFakultasLabel,
  // getFakultasOptions,
  getJabatanLabel,
  getProdiLabel,
  // getProdiOptionsByFakultas,
  hasDosenRelatedPengajuan,
  JABATAN_OPTIONS,
  matchesDosenSearch,
  sanitizeNumericInput,
  validateDosenForm,
} from "../../utils/dosenHelpers";

const tableHeaderCellClass = "px-3 py-4 text-body-xxs-medium text-black-80";
const tableBodyCellClass =
  "px-3 py-4 align-top text-body-xxs-regular text-black-100";
const actionButtonClass =
  "inline-flex min-w-[60px] items-center justify-center rounded-lg border border-black-40 px-2.5 py-2 text-body-xxs-medium text-black-100 hover:bg-black-20";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-sm text-error-100">{message}</p>;
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-black-40 px-6 py-4">
      <h2 className="text-body-sm-medium text-black-100">{title}</h2>

      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-black-80 hover:bg-black-20"
        aria-label="Tutup"
      >
        ✕
      </button>
    </div>
  );
}

function ModalFooter({ onClose, submitLabel = "Simpan" }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-black-40 pt-5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-black-40 px-4 py-3 text-sm font-medium text-black-100 hover:bg-black-20"
      >
        Batal
      </button>

      <button
        type="submit"
        className="rounded-lg bg-primary-100 px-4 py-3 text-sm font-medium text-white hover:opacity-95"
      >
        {submitLabel}
      </button>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  type = "text", // Can be "text", "password", "email", etc.
  inputMode,
  name, // Added name for accessibility/forms
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const actualType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-black-100"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={inputMode}
          className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all ${
            disabled
              ? "cursor-not-allowed border-black-40 bg-black-20 text-black-80"
              : "border-black-40 bg-white text-black-100 focus:ring-1 focus:ring-primary-100"
          } ${isPassword ? "pr-12" : ""}`} // Add padding if eye icon exists
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            <img
              src={`/icons/${showPassword ? "eye.svg" : "eye-off.svg"}`}
              alt=""
              className="w-5 h-5"
            />
          </button>
        )}
      </div>

      {/* Reusing your FieldError component */}
      {error && <FieldError message={error} />}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi",
  error,
  disabled = false,
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-black-100">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full appearance-none rounded-lg border px-4 py-3 text-sm outline-none ${
          disabled
            ? "cursor-not-allowed border-black-40 bg-black-20 text-black-80"
            : "border-black-40 bg-white text-black-100 focus:ring-1 focus:ring-primary-100"
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <FieldError message={error} />
    </div>
  );
}

function DosenFormModal({ mode, dosen, usersData, onClose, onSubmit }) {
  const [form, setForm] = useState(() =>
    dosen ? createDosenForm(dosen) : createEmptyDosenForm(),
  );
  const [errors, setErrors] = useState({});

  // const fakultasOptions = useMemo(() => getFakultasOptions(), []);
  // const prodiOptions = useMemo(
  //   () => getProdiOptionsByFakultas(form.fakultas_id),
  //   [form.fakultas_id],
  // );

  const { fakultasData, prodiData } = usePengajuan();
  const fakultasOptions = useMemo(
    () =>
      fakultasData.map((f) => ({
        value: f.id ?? f.value,
        label: f.nama_fakultas ?? f.label,
      })),
    [fakultasData],
  );
  const prodiOptions = useMemo(() => {
    return prodiData
      .filter((d) => String(d.fakultas_id) === String(form.fakultas_id))
      .map((d) => ({
        value: d.id ?? d.value,
        label: d.nama_prodi ?? d.label,
      }));
  }, [prodiData, form.fakultas_id]);

  const modalTitle = mode === "edit" ? "Edit Dosen" : "Tambah Dosen";

  const updateField = (key, value) => {
    const nextValue =
      key === "nidn" || key === "no_hp" ? sanitizeNumericInput(value) : value;

    setForm((prev) => ({
      ...prev,
      [key]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleFakultasChange = (event) => {
    const nextFakultasId = event.target.value;

    setForm((prev) => ({
      ...prev,
      fakultas_id: nextFakultasId,
      prodi_id: "",
    }));

    setErrors((prev) => ({
      ...prev,
      fakultas_id: "",
      prodi_id: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateDosenForm(
      form,
      usersData,
      dosen?.id,
      prodiOptions,
    );

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(buildDosenPayload(form, dosen));
  };

  return (
    <FullscreenModal
      open
      title={modalTitle}
      onClose={onClose}
      panelClassName="max-w-3xl"
    >
      <ModalHeader title={modalTitle} onClose={onClose} />

      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Nama Dosen"
            value={form.nama}
            onChange={(event) => updateField("nama", event.target.value)}
            placeholder="Masukkan nama dosen"
            error={errors.nama}
          />

          <FormField
            label="NIDN"
            value={form.nidn}
            onChange={(event) => updateField("nidn", event.target.value)}
            placeholder="Masukkan NIDN"
            error={errors.nidn}
            disabled={mode === "edit"}
            inputMode="numeric"
          />

          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Masukkan email"
            error={errors.email}
          />

          <FormField
            label="No HP"
            value={form.no_hp}
            onChange={(event) => updateField("no_hp", event.target.value)}
            placeholder="Masukkan no HP"
            error={errors.no_hp}
            inputMode="numeric"
          />

          <SelectField
            label="Fakultas"
            value={form.fakultas_id}
            onChange={handleFakultasChange}
            options={fakultasOptions}
            placeholder="Pilih fakultas"
            error={errors.fakultas_id}
          />

          <SelectField
            label="Program Studi"
            value={form.prodi_id}
            onChange={(event) => updateField("prodi_id", event.target.value)}
            options={prodiOptions}
            placeholder="Pilih program studi"
            error={errors.prodi_id}
            disabled={!form.fakultas_id}
          />

          <div className="md:col-span-2">
            <SelectField
              label="Jabatan"
              value={form.jabatan}
              onChange={(event) => updateField("jabatan", event.target.value)}
              options={JABATAN_OPTIONS}
              placeholder="Pilih jabatan"
              error={errors.jabatan}
            />
          </div>

          {mode !== "edit" && (
            <div className="md:col-span-2">
              <FormField
                label="Password Awal"
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                placeholder="Masukkan password"
                error={errors.password}
                type={"password"}
              />
            </div>
          )}
        </div>

        <ModalFooter onClose={onClose} submitLabel="Simpan" />
      </form>
    </FullscreenModal>
  );
}

function DeleteConfirmModal({ dosen, onClose, onConfirm, blockedReason }) {
  if (!dosen) return null;

  const isBlocked = Boolean(blockedReason);

  return (
    <FullscreenModal
      open
      title="Hapus Dosen"
      onClose={onClose}
      panelClassName="max-w-xl"
    >
      <ModalHeader title="Hapus Dosen" onClose={onClose} />

      <div className="space-y-5 px-6 py-6">
        <div className="rounded-lg border border-black-40 bg-white p-4">
          <div className="text-sm text-black-80">Data yang dipilih</div>
          <div className="mt-2 text-base font-semibold text-black-100">
            {dosen.nama || "-"}
          </div>
          <div className="mt-1 text-sm text-black-80">
            NIDN: {dosen.nidn || "-"}
          </div>
        </div>

        {isBlocked ? (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm text-warning-100">
            {blockedReason}
          </div>
        ) : (
          <div className="rounded-lg bg-error-20 px-4 py-3 text-sm text-error-100">
            Data dosen akan dihapus dari data dummy saat ini.
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black-40 px-4 py-3 text-sm font-medium text-black-100 hover:bg-black-20"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isBlocked}
            className="rounded-lg bg-error-100 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hapus
          </button>
        </div>
      </div>
    </FullscreenModal>
  );
}

function DosenTable({ dosenList, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead className="bg-black-20">
          <tr>
            <th className={tableHeaderCellClass}>NIDN</th>
            <th className={tableHeaderCellClass}>Nama Dosen</th>
            <th className={tableHeaderCellClass}>Fakultas</th>
            <th className={tableHeaderCellClass}>Program Studi</th>
            <th className={tableHeaderCellClass}>Jabatan</th>
            <th className={tableHeaderCellClass}>No HP</th>
            <th className={`${tableHeaderCellClass} text-center`}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {dosenList.map((item) => (
            <tr key={item.id} className="border-t border-black-20">
              <td className={tableBodyCellClass}>{item.nidn || "-"}</td>
              <td className={`${tableBodyCellClass} font-medium`}>
                <div className="break-words">{item.nama || "-"}</div>
              </td>
              <td className={tableBodyCellClass}>
                <div className="break-words">
                  {getFakultasLabel(item.fakultas)}
                </div>
              </td>
              <td className={tableBodyCellClass}>
                <div className="break-words">{getProdiLabel(item.prodi)}</div>
              </td>
              <td className={tableBodyCellClass}>
                {getJabatanLabel(item.jabatan)}
              </td>
              <td className={tableBodyCellClass}>
                <div className="break-words">{item.no_hp || "-"}</div>
              </td>
              <td className={`${tableBodyCellClass} text-center`}>
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className={actionButtonClass}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className={actionButtonClass}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {dosenList.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-6 text-center text-black-80">
                Tidak ada data dosen.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function DosenListPage() {
  const {
    usersData = [],
    pengajuanData = [],
    updateUserById,
    createUser,
    deleteUserById,
  } = usePengajuan();

  const [search, setSearch] = useState("");
  const [fakultasId, setFakultasId] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // const fakultasOptions = useMemo(() => getFakultasOptions(), []);
  // const prodiOptions = useMemo(
  //   () => getProdiOptionsByFakultas(fakultasId),
  //   [fakultasId],
  // );

  const { fakultasData, prodiData } = usePengajuan();
  const fakultasOptions = useMemo(
    () =>
      fakultasData.map((f) => ({
        value: f.id ?? f.value,
        label: f.nama_fakultas ?? f.label,
      })),
    [fakultasData],
  );
  const prodiOptions = useMemo(() => {
    return prodiData
      .filter((d) => String(d.fakultas_id) === String(fakultasId))
      .map((d) => ({
        value: d.id ?? d.value,
        label: d.nama_prodi ?? d.label,
      }));
  }, [prodiData, fakultasId]);

  const dosenData = useMemo(() => {
    return usersData.filter(
      (item) =>
        item.role?.toUpperCase() === "DOSEN" &&
        item.jabatan?.toUpperCase() !== "KETUA_LPPM",
    );
  }, [usersData]);

  const filteredDosen = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return dosenData.filter((item) => {
      const matchSearch = matchesDosenSearch(item, keyword);
      const matchFakultas =
        !fakultasId || String(item.fakultas_id) === String(fakultasId);
      const matchProdi = !prodiId || String(item.prodi_id) === String(prodiId);

      return matchSearch && matchFakultas && matchProdi;
    });
  }, [dosenData, search, fakultasId, prodiId]);

  const deleteBlockedReason = useMemo(() => {
    if (!deleteTarget) return "";

    return hasDosenRelatedPengajuan(deleteTarget.id, pengajuanData)
      ? "Data dosen tidak dapat dihapus karena sudah terhubung dengan data pengajuan."
      : "";
  }, [deleteTarget, pengajuanData]);

  const handleResetFilters = () => {
    setSearch("");
    setFakultasId("");
    setProdiId("");
  };

  const handleFakultasChange = (value) => {
    setFakultasId(value);
    setProdiId("");
  };

  const handleCreateDosen = async (payload) => {
    try {
      const newUser = await createUser(payload);

      if (newUser) {
        setIsCreateOpen(false);
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleSaveDosen = (payload) => {
    updateUserById(selectedDosen.id, (prev) => ({
      ...prev,
      ...payload,
      nidn: prev.nidn,
    }));
    setSelectedDosen(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || deleteBlockedReason) return;

    deleteUserById(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-black-100">
          Master Data Dosen
        </h1>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-lg bg-success-100 px-4 py-2.5 text-body-xxs-medium text-white hover:opacity-95"
        >
          Tambah Dosen
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-black-100">
            Filter Dosen
          </label>

          <button
            type="button"
            onClick={handleResetFilters}
            className="shrink-0 text-sm font-medium text-primary-100 hover:underline"
          >
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black-100">
              Cari Dosen
            </label>
            <ListSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari nama, NIDN, email, atau no HP"
            />
          </div>

          <ListFilterSelect
            label="Fakultas"
            value={fakultasId}
            onChange={handleFakultasChange}
            options={fakultasOptions}
          />

          <ListFilterSelect
            label="Program Studi"
            value={prodiId}
            onChange={setProdiId}
            options={prodiOptions}
            disabled={!fakultasId}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black-40 bg-white">
        <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-body-sm-medium text-black-100">Daftar Dosen</h2>

          <div className="text-body-xxs-regular text-black-100">
            Menampilkan {filteredDosen.length} dari {dosenData.length} dosen
          </div>
        </div>

        <DosenTable
          dosenList={filteredDosen}
          onEdit={setSelectedDosen}
          onDelete={setDeleteTarget}
        />
      </div>

      {isCreateOpen ? (
        <DosenFormModal
          mode="create"
          usersData={usersData}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateDosen}
        />
      ) : null}

      {selectedDosen ? (
        <DosenFormModal
          mode="edit"
          dosen={selectedDosen}
          usersData={usersData}
          onClose={() => setSelectedDosen(null)}
          onSubmit={handleSaveDosen}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmModal
          dosen={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          blockedReason={deleteBlockedReason}
        />
      ) : null}
    </div>
  );
}

export default DosenListPage;
