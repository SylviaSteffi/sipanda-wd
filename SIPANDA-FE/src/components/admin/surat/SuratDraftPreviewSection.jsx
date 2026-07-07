import { formatDateOnly } from "../../../utils/dateHelpers.js";
import { getFormulirFields } from "../../../utils/pengajuanDetailHelpers.js";

function renderFieldValue(field) {
  if (field.isLink) {
    return (
      <a
        href={field.value}
        target="_blank"
        rel="noreferrer"
        className="break-all text-primary-100 underline"
      >
        {field.value}
      </a>
    );
  }

  return field.value;
}

function renderPreviewFields(pengajuan, parentPengajuan, templateKey) {
  const fields = getFormulirFields(pengajuan, {
    parentPengajuan,
    templateKey,
  });

  if (!fields.length) {
    return <div className="text-sm text-black-80">Data formulir belum tersedia.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="space-y-1">
          <div className="text-sm font-medium text-black-80">{field.label}</div>
          <div className="break-words whitespace-pre-line text-sm leading-6 text-black-100">
            {renderFieldValue(field)}
          </div>
        </div>
      ))}
    </div>
  );
}

function SuratDraftPreviewSection({
  pengajuan,
  parentPengajuan,
  templateKey,
  nomorSurat,
  tanggalSurat,
  onDownloadDraft,
  isDownloadDisabled = false,
  downloadLabel = "Unduh Draf DOCX",
}) {
  return (
    <section className="space-y-4 rounded-xl border border-black-40 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-black-100">Draf Surat</h2>
        </div>

        {onDownloadDraft ? (
          <button
            type="button"
            onClick={onDownloadDraft}
            disabled={isDownloadDisabled}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-100 px-4 py-2 text-sm font-medium text-primary-100 hover:bg-primary-20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <img src="/icons/download.svg" alt="" className="h-4 w-4" />
            {downloadLabel}
          </button>
        ) : null}
      </div>

      <div className="rounded-lg border border-black-40 bg-white p-8">
        <div className="mx-auto max-w-4xl space-y-6 text-black-100">
          <div className="text-center">
            <div className="text-lg font-semibold uppercase">
              UNIVERSITAS WIDYA DHARMA PONTIANAK
            </div>
            <div className="text-sm">
              LPPM - Lembaga Penelitian dan Pengabdian kepada Masyarakat
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <div>Nomor: {nomorSurat || "-"}</div>
            <div>Tanggal: {formatDateOnly(tanggalSurat)}</div>
          </div>

          <div className="text-center text-base font-semibold uppercase underline">
            Draf Surat
          </div>

          {renderPreviewFields(pengajuan, parentPengajuan, templateKey)}
        </div>
      </div>
    </section>
  );
}

export default SuratDraftPreviewSection;