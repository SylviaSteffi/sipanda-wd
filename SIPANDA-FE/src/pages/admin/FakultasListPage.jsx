import { useMemo, useState } from "react";
import { usePengajuan } from "../../context/pengajuanContext";
import ListSearchInput from "../../components/ui/ListSearchInput";
import FullscreenModal from "../../components/ui/FullscreenModal";

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

function ModalFooter({ onClose }) {
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
        Simpan
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
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-black-100">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${
          disabled
            ? "cursor-not-allowed border-black-40 bg-black-20 text-black-80"
            : "border-black-40 bg-white text-black-100 focus:ring-1 focus:ring-primary-100"
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

function createEmptyFakultasForm() {
  return { kode_fakultas: "", nama_fakultas: "" };
}

function createFakultasForm(fakultas) {
  return {
    kode_fakultas: fakultas.kode_fakultas || "",
    nama_fakultas: fakultas.nama_fakultas || "",
  };
}

function validateFakultasForm(form, existingData, excludeId) {
  const errors = {};
  if (!form.kode_fakultas.trim()) {
    errors.kode_fakultas = "Kode fakultas wajib diisi.";
  } else {
    const duplicate = existingData.find(
      (f) =>
        f.kode_fakultas.toLowerCase() ===
          form.kode_fakultas.trim().toLowerCase() &&
        String(f.id) !== String(excludeId),
    );
    if (duplicate) errors.kode_fakultas = "Kode fakultas sudah digunakan.";
  }
  if (!form.nama_fakultas.trim())
    errors.nama_fakultas = "Nama fakultas wajib diisi.";
  return errors;
}

function FakultasFormModal({
  mode,
  fakultas,
  fakultasData,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() =>
    fakultas ? createFakultasForm(fakultas) : createEmptyFakultasForm(),
  );
  const [errors, setErrors] = useState({});

  const title = mode === "edit" ? "Edit Fakultas" : "Tambah Fakultas";

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateFakultasForm(form, fakultasData, fakultas?.id);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      kode_fakultas: form.kode_fakultas.trim().toUpperCase(),
      nama_fakultas: form.nama_fakultas.trim(),
    });
  };

  return (
    <FullscreenModal
      open
      title={title}
      onClose={onClose}
      panelClassName="max-w-lg"
    >
      <ModalHeader title={title} onClose={onClose} />
      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
        <div className="space-y-4">
          <FormField
            label="Kode Fakultas"
            value={form.kode_fakultas}
            onChange={(e) => updateField("kode_fakultas", e.target.value)}
            placeholder="Contoh: FT"
            error={errors.kode_fakultas}
            disabled={mode === "edit"}
          />
          <FormField
            label="Nama Fakultas"
            value={form.nama_fakultas}
            onChange={(e) => updateField("nama_fakultas", e.target.value)}
            placeholder="Contoh: Fakultas Teknik"
            error={errors.nama_fakultas}
          />
        </div>
        <ModalFooter onClose={onClose} />
      </form>
    </FullscreenModal>
  );
}

function DeleteConfirmModal({
  item,
  label,
  blockedReason,
  onClose,
  onConfirm,
}) {
  if (!item) return null;
  const isBlocked = Boolean(blockedReason);
  return (
    <FullscreenModal
      open
      title={`Hapus ${label}`}
      onClose={onClose}
      panelClassName="max-w-xl"
    >
      <ModalHeader title={`Hapus ${label}`} onClose={onClose} />
      <div className="space-y-5 px-6 py-6">
        <div className="rounded-lg border border-black-40 bg-white p-4">
          <div className="text-sm text-black-80">Data yang dipilih</div>
          <div className="mt-2 text-base font-semibold text-black-100">
            {item.nama_fakultas || "-"}
          </div>
          <div className="mt-1 text-sm text-black-80">
            Kode: {item.kode_fakultas || "-"}
          </div>
        </div>
        {isBlocked ? (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm text-warning-100">
            {blockedReason}
          </div>
        ) : (
          <div className="rounded-lg bg-error-20 px-4 py-3 text-sm text-error-100">
            Data fakultas akan dihapus permanen.
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

function FakultasTable({ list, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead className="bg-black-20">
          <tr>
            <th className={tableHeaderCellClass}>Kode</th>
            <th className={tableHeaderCellClass}>Nama Fakultas</th>
            <th className={`${tableHeaderCellClass} text-center`}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id} className="border-t border-black-20">
              <td className={tableBodyCellClass}>
                {item.kode_fakultas || "-"}
              </td>
              <td className={`${tableBodyCellClass} font-medium`}>
                {item.nama_fakultas || "-"}
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
          {list.length === 0 && (
            <tr>
              <td colSpan="3" className="p-6 text-center text-black-80">
                Tidak ada data fakultas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function FakultasListPage() {
  const {
    fakultasData = [],
    prodiData = [],
    createFakultas,
    updateFakultasById,
    deleteFakultasById,
  } = usePengajuan();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return fakultasData;
    return fakultasData.filter(
      (f) =>
        f.nama_fakultas?.toLowerCase().includes(keyword) ||
        f.kode_fakultas?.toLowerCase().includes(keyword),
    );
  }, [fakultasData, search]);

  const deleteBlockedReason = useMemo(() => {
    if (!deleteTarget) return "";
    const hasProdi = prodiData.some(
      (p) => String(p.fakultas_id) === String(deleteTarget.id),
    );
    return hasProdi
      ? "Fakultas tidak dapat dihapus karena masih memiliki program studi terdaftar."
      : "";
  }, [deleteTarget, prodiData]);

  const handleCreate = (payload) => {
    createFakultas(payload);
    setIsCreateOpen(false);
  };

  const handleSave = (payload) => {
    updateFakultasById(selectedItem.id, (prev) => ({ ...prev, ...payload }));
    setSelectedItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || deleteBlockedReason) return;
    deleteFakultasById(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-black-100">
          Master Data Fakultas
        </h1>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-lg bg-success-100 px-4 py-2.5 text-body-xxs-medium text-white hover:opacity-95"
        >
          Tambah Fakultas
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-black-100">
            Cari Fakultas
          </label>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="shrink-0 text-sm font-medium text-primary-100 hover:underline"
          >
            Reset
          </button>
        </div>
        <ListSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari kode atau nama fakultas"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-black-40 bg-white">
        <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-body-sm-medium text-black-100">
            Daftar Fakultas
          </h2>
          <div className="text-body-xxs-regular text-black-100">
            Menampilkan {filtered.length} dari {fakultasData.length} fakultas
          </div>
        </div>
        <FakultasTable
          list={filtered}
          onEdit={setSelectedItem}
          onDelete={setDeleteTarget}
        />
      </div>

      {isCreateOpen && (
        <FakultasFormModal
          mode="create"
          fakultasData={fakultasData}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}
      {selectedItem && (
        <FakultasFormModal
          mode="edit"
          fakultas={selectedItem}
          fakultasData={fakultasData}
          onClose={() => setSelectedItem(null)}
          onSubmit={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          label="Fakultas"
          blockedReason={deleteBlockedReason}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
