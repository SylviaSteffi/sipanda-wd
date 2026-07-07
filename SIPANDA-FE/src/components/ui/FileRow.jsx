import ActionIconButton from "./ActionIconButton";

function FileRow({ name, subtitle, onPreview, onDownload, onRemove }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-black-40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-black-100">{name}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-black-80">{subtitle}</div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {onPreview ? (
          <ActionIconButton
            title="Lihat dokumen"
            onClick={onPreview}
            iconSrc="/icons/eye.svg"
          />
        ) : null}

        {onDownload ? (
          <ActionIconButton
            title="Download dokumen"
            onClick={onDownload}
            iconSrc="/icons/download.svg"
          />
        ) : null}

        {onRemove ? (
          <ActionIconButton title="Hapus file" onClick={onRemove}>
            <span className="text-lg font-semibold leading-none">×</span>
          </ActionIconButton>
        ) : null}
      </div>
    </div>
  );
}

export default FileRow;