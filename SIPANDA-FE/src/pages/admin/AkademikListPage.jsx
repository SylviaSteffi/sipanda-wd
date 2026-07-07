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

const STATUS_OPTIONS = [
  { value: "1", label: "Aktif" },
  { value: "0", label: "Tidak Aktif" },
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

function createEmptyAkademikForm() {
  return { kode_akademik: "", nama_akademik: "" };
}

function createAkademikForm(akademik) {
  return {
    kode_akademik: akademik.kode_akademik || "",
    nama_akademik: akademik.nama_akademik || "",
  };
}

function validateAkademikForm(form, existingData, excludeId) {
  const errors = {};

  if (!form.kode_akademik.trim()) {
    errors.kode_akademik = "Kode akademik wajib diisi.";
  } else {
    const duplicate = existingData.find(
      (a) =>
        a.kode_akademik.toLowerCase() ===
          form.kode_akademik.trim().toLowerCase() &&
        String(a.id) !== String(excludeId),
    );
    if (duplicate) errors.kode_akademik = "Kode akademik sudah digunakan.";
  }

  if (!form.nama_akademik.trim())
    errors.nama_akademik = "Nama akademik wajib diisi.";

  return errors;
}

function AkademikFormModal({
  mode,
  akademik,
  akademikData,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() =>
    akademik ? createAkademikForm(akademik) : createEmptyAkademikForm(),
  );
  const [errors, setErrors] = useState({});

  const title = mode === "edit" ? "Edit Akademik" : "Tambah Akademik";

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAkademikForm(form, akademikData, akademik?.id);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      kode_akademik: form.kode_akademik.trim().toUpperCase(),
      nama_akademik: form.nama_akademik.trim(),
      is_aktif: akademik?.is_aktif ?? 0,
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
            label="Kode Akademik"
            value={form.kode_akademik}
            onChange={(e) => updateField("kode_akademik", e.target.value)}
            placeholder="Contoh: 20221"
            error={errors.kode_akademik}
            disabled={mode === "edit"}
          />
          <FormField
            label="Nama Akademik"
            value={form.nama_akademik}
            onChange={(e) => updateField("nama_akademik", e.target.value)}
            placeholder="Contoh: 2022 / 2023 Ganjil"
            error={errors.nama_akademik}
          />
        </div>
        <ModalFooter onClose={onClose} />
      </form>
    </FullscreenModal>
  );
}

function StatusBadge({ isAktif }) {
  return Number(isAktif) === 1 ? (
    <span className="inline-flex items-center rounded-md bg-success-20 px-2 py-0.5 text-xs font-medium text-success-100">
      Aktif
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md bg-black-20 px-2 py-0.5 text-xs font-medium text-black-60">
      Tidak Aktif
    </span>
  );
}

function AkademikTable({ list, onEdit, onToggleAktif }) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead className="bg-black-20">
          <tr>
            <th className={tableHeaderCellClass}>Kode</th>
            <th className={tableHeaderCellClass}>Nama Akademik</th>
            <th className={tableHeaderCellClass}>Status</th>
            <th className={`${tableHeaderCellClass} text-center`}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => {
            const isAktif = Number(item.is_aktif) === 1;
            return (
              <tr key={item.id} className="border-t border-black-20">
                <td className={tableBodyCellClass}>
                  {item.kode_akademik || "-"}
                </td>
                <td className={`${tableBodyCellClass} font-medium`}>
                  {item.nama_akademik || "-"}
                </td>
                <td className={tableBodyCellClass}>
                  <StatusBadge isAktif={item.is_aktif} />
                </td>
                <td className={`${tableBodyCellClass} text-center`}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleAktif(item)}
                      disabled={isAktif}
                      title={
                        isAktif
                          ? "Tidak dapat menonaktifkan periode yang sedang aktif"
                          : ""
                      }
                      className={`${actionButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {isAktif ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className={actionButtonClass}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {list.length === 0 && (
            <tr>
              <td colSpan="4" className="p-6 text-center text-black-80">
                Tidak ada data akademik.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AkademikListPage() {
  const {
    akademikData = [],
    createAkademik,
    updateAkademikById,
  } = usePengajuan();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return akademikData.filter((a) => {
      const matchSearch =
        !keyword ||
        a.nama_akademik?.toLowerCase().includes(keyword) ||
        a.kode_akademik?.toLowerCase().includes(keyword);
      const matchStatus = !filterStatus || String(a.is_aktif) === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [akademikData, search, filterStatus]);

  const handleResetFilters = () => {
    setSearch("");
    setFilterStatus("");
  };

  const handleCreate = (payload) => {
    createAkademik(payload);
    setIsCreateOpen(false);
  };

  const handleSave = (payload) => {
    updateAkademikById(selectedItem.id, (prev) => ({ ...prev, ...payload }));
    setSelectedItem(null);
  };

  // Only 1 aktif at a time — deactivate others when activating one
  const handleToggleAktif = (item) => {
    akademikData.forEach((a) => {
      if (Number(a.is_aktif) === 1) {
        updateAkademikById(a.id, (prev) => ({ ...prev, is_aktif: 0 }));
      }
    });
    updateAkademikById(item.id, (prev) => ({ ...prev, is_aktif: 1 }));
  };

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-black-100">
          Master Data Akademik
        </h1>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-lg bg-success-100 px-4 py-2.5 text-body-xxs-medium text-white hover:opacity-95"
        >
          Tambah Akademik
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-black-100">
            Filter Akademik
          </label>
          <button
            type="button"
            onClick={handleResetFilters}
            className="shrink-0 text-sm font-medium text-primary-100 hover:underline"
          >
            Reset Filter
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black-100">
              Cari Akademik
            </label>
            <ListSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari kode atau nama akademik"
            />
          </div>
          <ListFilterSelect
            label="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black-40 bg-white">
        <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-body-sm-medium text-black-100">
            Daftar Akademik
          </h2>
          <div className="text-body-xxs-regular text-black-100">
            Menampilkan {filtered.length} dari {akademikData.length} akademik
          </div>
        </div>
        <AkademikTable
          list={filtered}
          onEdit={setSelectedItem}
          onToggleAktif={handleToggleAktif}
        />
      </div>

      {isCreateOpen && (
        <AkademikFormModal
          mode="create"
          akademikData={akademikData}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}
      {selectedItem && (
        <AkademikFormModal
          mode="edit"
          akademik={selectedItem}
          akademikData={akademikData}
          onClose={() => setSelectedItem(null)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
