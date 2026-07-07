import FullscreenModal from "../../ui/FullscreenModal";
import ClarificationFieldInput from "./ClarificationFieldInput";
import ClarificationDocumentInput from "./ClarificationDocumentInput";

function DosenClarificationSection({
  open = false,
  editableFields = [],
  formValues = {},
  errors = {},
  documentFiles = {},
  documentSlots = [],
  isSubmitting = false,
  onClose,
  onFieldChange,
  onDocumentChange,
  onRemoveDocument,
  onSubmitRevision,
}) {
  if (!open) return null;

  return (
    <FullscreenModal
      open={open}
      title="Revisi Klarifikasi"
      onClose={onClose}
      panelClassName="w-full max-w-3xl"
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-center justify-between border-b border-black-40 px-5 py-4">
          <h2 className="text-lg font-semibold text-black-100">
            Revisi Klarifikasi
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            title="Tutup"
            className="inline-flex h-10 w-10 items-center justify-center text-2xl leading-none text-black-100 hover:text-black-80"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            {editableFields.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {editableFields.map((field) => (
                  <ClarificationFieldInput
                    key={field.key}
                    field={field}
                    value={formValues[field.key] ?? ""}
                    error={errors[field.key]}
                    onChange={onFieldChange}
                  />
                ))}
              </div>
            ) : null}

            {documentSlots.length > 0 ? (
              <div className="space-y-4 border-t border-black-20 pt-5">
                {documentSlots.map((slot) => (
                  <ClarificationDocumentInput
                    key={slot.kode_dokumen}
                    slot={slot}
                    file={documentFiles[slot.kode_dokumen]}
                    error={errors[`dokumen_${slot.kode_dokumen}`]}
                    onChange={onDocumentChange}
                    onRemove={onRemoveDocument}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-black-40 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black-40 px-4 py-2.5 text-sm font-medium text-black-100 hover:bg-black-20"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onSubmitRevision}
            disabled={isSubmitting}
            className="rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
    </FullscreenModal>
  );
}

export default DosenClarificationSection;