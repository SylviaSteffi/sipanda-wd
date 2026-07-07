import SectionCard from "../../ui/SectionCard";
import { formatDateTime, sortByDateDesc } from "../../../utils/dateHelpers";
import { getPengajuanStatus } from "../../../utils/pengajuanHelpers";

function buildDosenNotes(pengajuan) {
  const klarifikasiItems = Array.isArray(pengajuan?.klarifikasi)
    ? pengajuan.klarifikasi
        .filter((item) => item?.pesan_admin)
        .map((item) => ({
          id: `klarifikasi-${item.id}`,
          pesan: item.pesan_admin,
          waktu: item.waktu_minta,
          status: item.status_klarifikasi || null,
          tone: "warning",
        }))
    : [];

  if (klarifikasiItems.length > 0) {
    return sortByDateDesc(klarifikasiItems, (item) => item.waktu);
  }

  if (pengajuan?.catatan_admin) {
    return [
      {
        id: `catatan-${pengajuan.id}`,
        pesan: pengajuan.catatan_admin,
        waktu: pengajuan.updated_at,
        status: null,
        tone: "default",
      },
    ];
  }

  return [];
}

function getToneClass(tone) {
  if (tone === "warning") return "border-warning-100 bg-warning-20";
  return "border-black-40 bg-white";
}

function DosenNotesSection({ pengajuan, finalDocument, onOpenClarification }) {
  const items = buildDosenNotes(pengajuan);
  const currentStatus = getPengajuanStatus(pengajuan);

  const showRevisionAction = currentStatus === "PERLU_KLARIFIKASI";
  const showFinalInfo = currentStatus === "SELESAI" && Boolean(finalDocument);
  const shouldRenderSection =
    items.length > 0 || showRevisionAction || showFinalInfo;

  if (!shouldRenderSection) return null;

  return (
    <SectionCard title="Catatan Admin & Tindak Lanjut">
      <div className="space-y-4">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border p-4 ${getToneClass(item.tone)}`}
              >
                <div className="text-sm text-black-100">{item.pesan}</div>

                <div className="mt-2 text-sm text-black-80">
                  {formatDateTime(item.waktu)}
                  {item.status ? ` · ${item.status}` : ""}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {showRevisionAction ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm font-medium text-warning-100">
              Silakan perbaiki pengajuan sesuai catatan admin.
            </div>

            <button
              type="button"
              onClick={onOpenClarification}
              className="inline-flex rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
            >
              Mulai Revisi
            </button>
          </div>
        ) : null}

        {showFinalInfo ? (
          <div className="rounded-lg bg-success-20 px-4 py-3 text-sm font-medium text-success-100">
            Surat final sudah tersedia pada bagian dokumen hasil akhir.
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

export default DosenNotesSection;