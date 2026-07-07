function formatFileSize(size = 0) {
  const numericSize = Number(size || 0);

  if (numericSize >= 1024 * 1024) {
    return `${(numericSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (numericSize >= 1024) {
    return `${(numericSize / 1024).toFixed(1)} KB`;
  }

  return `${numericSize} B`;
}

function ClarificationDocumentInput({
  slot,
  file,
  error = "",
  onChange,
  onRemove,
}) {
  const inputId = `klarifikasi-upload-${slot.kode_dokumen}`;
  const hasSelectedFile = Boolean(file);

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-black-100"
      >
        {slot.uploadLabel}
      </label>

      <p className="text-sm text-black-80">
        {slot.helperText || "Format file: pdf. Maksimal 2 MB."}
      </p>

      <input
        id={inputId}
        type="file"
        accept={slot.accept || undefined}
        className="hidden"
        onChange={(event) =>
          onChange(slot.kode_dokumen, event.target.files?.[0] || null)
        }
      />

      <div
        className={`rounded-lg border p-4 ${
          error ? "border-error-100" : "border-black-40"
        }`}
      >
        {hasSelectedFile ? (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-black-100">
                {file.name}
              </div>
              <div className="mt-1 text-sm text-black-80">
                {formatFileSize(file.size)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemove(slot.kode_dokumen)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black-40 text-lg text-black-100 hover:bg-black-20"
              aria-label={`Batal pilih file ${slot.label}`}
              title="Batal pilih file"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer rounded-lg bg-primary-20 px-4 py-2.5 text-sm font-medium text-primary-100"
            >
              Pilih File
            </label>

            <div className="text-sm text-black-80">
              Upload hanya jika dokumen perlu diganti.
            </div>
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-error-100">{error}</p> : null}
    </div>
  );
}

export default ClarificationDocumentInput;