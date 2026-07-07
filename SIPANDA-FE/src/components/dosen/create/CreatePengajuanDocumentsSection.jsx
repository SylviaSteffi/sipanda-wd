import {
  canPreviewSelectedFile,
  previewSelectedFile,
} from "../../../utils/documentHelpers";
import { getFileAcceptValue } from "../../../utils/dosenCreatePengajuanHelpers";
import { useRef } from "react";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-body-xxs-regular text-error-100">{message}</p>;
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);

  if (!size || size < 0) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

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

function RemoveActionButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="Hapus file"
      aria-label="Hapus file"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black-40 bg-white text-black-100 transition hover:bg-black-20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="text-xl font-semibold leading-none">×</span>
    </button>
  );
}

function getDocumentHelperText(item) {
  const formatLabel = (item?.allowedExtensions || []).join("/");

  if (!item?.required) {
    return `Opsional. Format file: ${formatLabel}. Maksimal 2 MB.`;
  }

  return `Format file: ${formatLabel}. Maksimal 2 MB.`;
}

function DocumentUploadField({
  item,
  file,
  error,
  onFileChange,
  onRemove,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const canPreview = file ? canPreviewSelectedFile(file) : false;
  const helperText = getDocumentHelperText(item);

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(item.code, selectedFile);
    event.target.value = "";
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove(item.code);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="text-sm font-medium text-black-100">{item.label}</div>
        <div className="text-xs text-black-80">{helperText}</div>
      </div>

      <div
        className={`rounded-lg border px-5 py-4 ${
          disabled
            ? "border-black-40 bg-black-10 opacity-70"
            : "border-black-40 bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={getFileAcceptValue(item)}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {!file ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="inline-flex w-fit rounded-lg bg-primary-20 px-4 py-2 text-sm font-medium text-primary-100 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Pilih File
            </button>

            <span className="text-sm text-black-80">
              Belum ada file yang dipilih
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-black-100">
                {file.name}
              </div>
              <div className="mt-1 text-xs text-black-80">
                {formatFileSize(file.size)}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {canPreview ? (
                <IconActionButton
                  title="Lihat file"
                  label="Lihat file"
                  onClick={() => previewSelectedFile(file)}
                  iconSrc="/icons/eye.svg"
                  disabled={disabled}
                />
              ) : null}

              <RemoveActionButton onClick={handleRemove} disabled={disabled} />
            </div>
          </div>
        )}
      </div>

      <FieldError message={error} />
    </div>
  );
}

function CreatePengajuanDocumentsSection({
  requiredDocuments,
  documentFiles,
  errors,
  onFileChange,
  onRemoveFile,
}) {
  return (
    <div className="space-y-4">
      {requiredDocuments.map((item) => (
        <DocumentUploadField
          key={item.code}
          item={item}
          file={documentFiles[item.code]}
          error={errors[`doc_${item.code}`]}
          onFileChange={onFileChange}
          onRemove={onRemoveFile}
        />
      ))}
    </div>
  );
}

export default CreatePengajuanDocumentsSection;