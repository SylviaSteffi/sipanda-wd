import { useMemo, useState } from "react";
import { usePengajuan } from "../../context/pengajuanContext";
import ListSearchInput from "../../components/ui/ListSearchInput";
import ListFilterSelect from "../../components/ui/ListFilterSelect";
import FullscreenModal from "../../components/ui/FullscreenModal";

const tableHeaderCellClass = "px-3 py-4 text-body-xxs-medium text-black-80";
const tableBodyCellClass =
  "px-3 py-4 align-top text-body-xxs-regular text-black-100";
const actionButtonClass =
  "inline-flex min-w-[60px] items-center justify-center rounded-lg border border-black-40 px-2.5 py-2 text-body-xxs-medium text-black-100 hover:bg-black-20";

const JENJANG_OPTIONS = [
  { value: "D3", label: "D3" },
  { value: "S1", label: "S1" },
  { value: "S2", label: "S2" },
  { value: "S3", label: "S3" },
];

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

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
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
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

function createEmptyProdiForm() {
  return { kode_prodi: "", nama_prodi: "", fakultas_id: "", jenjang: "" };
}

function createProdiForm(prodi) {
  return {
    kode_prodi: prodi.kode_prodi || "",
    nama_prodi: prodi.nama_prodi || "",
    fakultas_id: String(prodi.fakultas_id || ""),
    jenjang: prodi.jenjang || "",
  };
}

function validateProdiForm(form, existingData, excludeId) {
  const errors = {};
  if (!form.fakultas_id) errors.fakultas_id = "Fakultas wajib dipilih.";
  if (!form.kode_prodi.trim()) {
    errors.kode_prodi = "Kode prodi wajib diisi.";
  } else {
    const duplicate = existingData.find(
      (p) =>
        p.kode_prodi.toLowerCase() === form.kode_prodi.trim().toLowerCase() &&
        String(p.id) !== String(excludeId),
    );
    if (duplicate) errors.kode_prodi = "Kode prodi sudah digunakan.";
  }
  if (!form.nama_prodi.trim()) errors.nama_prodi = "Nama prodi wajib diisi.";
  return errors;
}

function ProdiFormModal({
  mode,
  prodi,
  prodiData,
  fakultasData,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() =>
    prodi ? createProdiForm(prodi) : createEmptyProdiForm(),
  );
  const [errors, setErrors] = useState({});

  const title = mode === "edit" ? "Edit Program Studi" : "Tambah Program Studi";

  const fakultasOptions = useMemo(
    () =>
      fakultasData.map((f) => ({
        value: String(f.id),
        label: f.nama_fakultas,
      })),
    [fakultasData],
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateProdiForm(form, prodiData, prodi?.id);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const selectedFakultas = fakultasData.find(
      (f) => String(f.id) === form.fakultas_id,
    );
    onSubmit({
      fakultas_id: Number(form.fakultas_id),
      fakultas: selectedFakultas?.nama_fakultas || "",
      kode_prodi: form.kode_prodi.trim().toUpperCase(),
      nama_prodi: form.nama_prodi.trim(),
      jenjang: form.jenjang || null,
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
          <SelectField
            label="Fakultas"
            value={form.fakultas_id}
            onChange={(e) => updateField("fakultas_id", e.target.value)}
            options={fakultasOptions}
            placeholder="Pilih fakultas"
            error={errors.fakultas_id}
            disabled={mode === "edit"}
          />
          <FormField
            label="Kode Program Studi"
            value={form.kode_prodi}
            onChange={(e) => updateField("kode_prodi", e.target.value)}
            placeholder="Contoh: 42"
            error={errors.kode_prodi}
            disabled={mode === "edit"}
          />
          <FormField
            label="Nama Program Studi"
            value={form.nama_prodi}
            onChange={(e) => updateField("nama_prodi", e.target.value)}
            placeholder="Contoh: Informatika"
            error={errors.nama_prodi}
          />
          <SelectField
            label="Jenjang"
            value={form.jenjang}
            onChange={(e) => updateField("jenjang", e.target.value)}
            options={JENJANG_OPTIONS}
            placeholder="Pilih jenjang (opsional)"
            error={errors.jenjang}
          />
        </div>
        <ModalFooter onClose={onClose} />
      </form>
    </FullscreenModal>
  );
}

function DeleteConfirmModal({ item, blockedReason, onClose, onConfirm }) {
  if (!item) return null;
  const isBlocked = Boolean(blockedReason);
  return (
    <FullscreenModal
      open
      title="Hapus Program Studi"
      onClose={onClose}
      panelClassName="max-w-xl"
    >
      <ModalHeader title="Hapus Program Studi" onClose={onClose} />
      <div className="space-y-5 px-6 py-6">
        <div className="rounded-lg border border-black-40 bg-white p-4">
          <div className="text-sm text-black-80">Data yang dipilih</div>
          <div className="mt-2 text-base font-semibold text-black-100">
            {item.nama_prodi || "-"}
          </div>
          <div className="mt-1 text-sm text-black-80">
            Kode: {item.kode_prodi || "-"}
          </div>
          {item.jenjang && (
            <div className="mt-1 text-sm text-black-80">
              Jenjang: {item.jenjang}
            </div>
          )}
        </div>
        {isBlocked ? (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm text-warning-100">
            {blockedReason}
          </div>
        ) : (
          <div className="rounded-lg bg-error-20 px-4 py-3 text-sm text-error-100">
            Data program studi akan dihapus permanen.
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

function ProdiTable({ list, fakultasData, onEdit, onDelete }) {
  const getFakultasName = (id) =>
    fakultasData.find((f) => String(f.id) === String(id))?.nama_fakultas || "-";

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead className="bg-black-20">
          <tr>
            <th className={tableHeaderCellClass}>Kode</th>
            <th className={tableHeaderCellClass}>Nama Program Studi</th>
            <th className={tableHeaderCellClass}>Fakultas</th>
            <th className={tableHeaderCellClass}>Jenjang</th>
            <th className={`${tableHeaderCellClass} text-center`}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id} className="border-t border-black-20">
              <td className={tableBodyCellClass}>{item.kode_prodi || "-"}</td>
              <td className={`${tableBodyCellClass} font-medium`}>
                {item.nama_prodi || "-"}
              </td>
              <td className={tableBodyCellClass}>
                {getFakultasName(item.fakultas_id)}
              </td>
              <td className={tableBodyCellClass}>{item.jenjang || "-"}</td>
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
              <td colSpan="5" className="p-6 text-center text-black-80">
                Tidak ada data program studi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ProdiListPage() {
  const {
    prodiData = [],
    fakultasData = [],
    usersData = [],
    createProdi,
    updateProdiById,
    deleteProdiById,
  } = usePengajuan();

  const [search, setSearch] = useState("");
  const [filterFakultasId, setFilterFakultasId] = useState("");
  const [filterJenjang, setFilterJenjang] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fakultasOptions = useMemo(
    () =>
      fakultasData.map((f) => ({
        value: String(f.id),
        label: f.nama_fakultas,
      })),
    [fakultasData],
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return prodiData.filter((p) => {
      const matchSearch =
        !keyword ||
        p.nama_prodi?.toLowerCase().includes(keyword) ||
        p.kode_prodi?.toLowerCase().includes(keyword);
      const matchFakultas =
        !filterFakultasId || String(p.fakultas_id) === filterFakultasId;
      const matchJenjang = !filterJenjang || p.jenjang === filterJenjang;
      return matchSearch && matchFakultas && matchJenjang;
    });
  }, [prodiData, search, filterFakultasId, filterJenjang]);

  const deleteBlockedReason = useMemo(() => {
    if (!deleteTarget) return "";
    const hasUsers = usersData.some(
      (u) => String(u.prodi_id) === String(deleteTarget.id),
    );
    return hasUsers
      ? "Program studi tidak dapat dihapus karena masih terhubung dengan data dosen."
      : "";
  }, [deleteTarget, usersData]);

  const handleResetFilters = () => {
    setSearch("");
    setFilterFakultasId("");
    setFilterJenjang("");
  };

  const handleCreate = (payload) => {
    createProdi(payload);
    setIsCreateOpen(false);
  };

  const handleSave = (payload) => {
    updateProdiById(selectedItem.id, (prev) => ({ ...prev, ...payload }));
    setSelectedItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || deleteBlockedReason) return;
    deleteProdiById(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-black-100">
          Master Data Program Studi
        </h1>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-lg bg-success-100 px-4 py-2.5 text-body-xxs-medium text-white hover:opacity-95"
        >
          Tambah Program Studi
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-black-100">
            Filter Program Studi
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
              Cari Program Studi
            </label>
            <ListSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari kode atau nama prodi"
            />
          </div>
          <ListFilterSelect
            label="Fakultas"
            value={filterFakultasId}
            onChange={setFilterFakultasId}
            options={fakultasOptions}
          />
          <ListFilterSelect
            label="Jenjang"
            value={filterJenjang}
            onChange={setFilterJenjang}
            options={JENJANG_OPTIONS}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black-40 bg-white">
        <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-body-sm-medium text-black-100">
            Daftar Program Studi
          </h2>
          <div className="text-body-xxs-regular text-black-100">
            Menampilkan {filtered.length} dari {prodiData.length} program studi
          </div>
        </div>
        <ProdiTable
          list={filtered}
          fakultasData={fakultasData}
          onEdit={setSelectedItem}
          onDelete={setDeleteTarget}
        />
      </div>

      {isCreateOpen && (
        <ProdiFormModal
          mode="create"
          prodiData={prodiData}
          fakultasData={fakultasData}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}
      {selectedItem && (
        <ProdiFormModal
          mode="edit"
          prodi={selectedItem}
          prodiData={prodiData}
          fakultasData={fakultasData}
          onClose={() => setSelectedItem(null)}
          onSubmit={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          blockedReason={deleteBlockedReason}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
