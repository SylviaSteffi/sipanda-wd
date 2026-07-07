import SectionCard from "../../ui/SectionCard";
import {
  previewStoredDoc,
  previewSelectedFile,
  canPreviewStoredDoc,
  canPreviewSelectedFile,
} from "../../../utils/documentHelpers";
import { getPengajuanStatus } from "../../../utils/pengajuanHelpers";

function formatFileSize(bytes) {
  const size = Number(bytes || 0);

  if (!size || size < 0) return "-";

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function IconActionButton({
  title,
  label,
  onClick,
  iconSrc,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black-40 bg-white transition hover:bg-black-20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <img src={iconSrc} alt="" className="h-5 w-5" />
    </button>
  );
}

function RemoveActionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Hapus file"
      aria-label="Hapus file"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black-40 bg-white text-black-100 transition hover:bg-black-20"
    >
      <span className="text-xl font-semibold leading-none">×</span>
    </button>
  );
}

function FileInfoRow({
  name,
  sizeLabel,
  onPreview,
  onRemove,
  canPreview = true,
  showRemove = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-black-40 bg-white px-5 py-4">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-black-100">
          {name}
        </div>
        <div className="mt-1 text-xs text-black-80">{sizeLabel}</div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {canPreview ? (
          <IconActionButton
            title="Lihat file"
            label="Lihat file"
            onClick={onPreview}
            iconSrc="/icons/eye.svg"
          />
        ) : null}

        {showRemove ? <RemoveActionButton onClick={onRemove} /> : null}
      </div>
    </div>
  );
}

function SuratFinalSection({
  pengajuan,
  existingFinalDoc,
  selectedFile,
  fileInputRef,
  onFileChange,
  onRemoveSelectedFile,
  onSimpanSuratFinal,
  isSaveDisabled,
  isUploadDisabled,
}) {
  const currentStatus = getPengajuanStatus(pengajuan);

  if (currentStatus === "SELESAI") {
    const fileName = existingFinalDoc?.original_name || "surat-final.pdf";
    const fileSize = formatFileSize(existingFinalDoc?.file_size_bytes);

    return (
      <SectionCard title="Surat Final">
        <div className="space-y-4">
          <div className="rounded-lg bg-success-20 px-4 py-3 text-sm font-medium text-success-100">
            Surat final sudah tersimpan dan proses pengajuan telah selesai.
          </div>

          <FileInfoRow
            name={fileName}
            sizeLabel={fileSize}
            canPreview={canPreviewStoredDoc(existingFinalDoc)}
            onPreview={
              canPreviewStoredDoc(existingFinalDoc)
                ? () => previewStoredDoc(existingFinalDoc)
                : undefined
            }
            showRemove={false}
          />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Surat Final">
      <div className="space-y-5">
        {isUploadDisabled ? (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm font-medium text-warning-100">
            Lengkapi informasi surat terlebih dahulu sebelum upload surat final.
          </div>
        ) : null}

        {!selectedFile ? (
          <label
            htmlFor={isUploadDisabled ? undefined : "surat-final-file"}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
              isUploadDisabled
                ? "pointer-events-none cursor-not-allowed border-black-40 bg-black-10 opacity-60"
                : "cursor-pointer border-black-40 hover:bg-black-10"
            }`}
            aria-disabled={isUploadDisabled}
          >
            <div className="text-lg font-semibold text-black-100">
              Upload Surat Final
            </div>

            <div className="mt-2 max-w-md text-sm leading-6 text-black-80">
              Pilih file surat final dalam format PDF yang sudah siap disimpan
              ke sistem.
            </div>

            <div
              className={`mt-5 rounded-lg px-4 py-2 text-sm font-medium ${
                isUploadDisabled
                  ? "bg-black-40 text-black-80"
                  : "bg-primary-100 text-white"
              }`}
            >
              Pilih File PDF
            </div>
          </label>
        ) : null}

        <input
          ref={fileInputRef}
          id="surat-final-file"
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept=".pdf,application/pdf"
          disabled={isUploadDisabled}
        />

        {selectedFile ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-primary-20 px-4 py-3 text-sm font-medium text-primary-100">
              File sudah dipilih dan siap diunggah sebagai surat final.
            </div>

            <FileInfoRow
              name={selectedFile.name}
              sizeLabel={formatFileSize(selectedFile.size)}
              canPreview={canPreviewSelectedFile(selectedFile)}
              onPreview={
                canPreviewSelectedFile(selectedFile)
                  ? () => previewSelectedFile(selectedFile)
                  : undefined
              }
              onRemove={onRemoveSelectedFile}
              showRemove
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={onSimpanSuratFinal}
          disabled={isSaveDisabled}
          className={`w-full rounded-lg px-5 py-3 text-sm font-medium text-white transition ${
            isSaveDisabled
              ? "cursor-not-allowed bg-black-60"
              : "bg-success-100 hover:opacity-95"
          }`}
        >
          Simpan Surat Final
        </button>
      </div>
    </SectionCard>
  );
}

export default SuratFinalSection;
