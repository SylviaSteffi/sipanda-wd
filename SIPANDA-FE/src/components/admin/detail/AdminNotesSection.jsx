import SectionCard from "../../ui/SectionCard";
import { formatDateTime, sortByDateDesc } from "../../../utils/dateHelpers";

function buildClarificationTimeline(pengajuan) {
  const klarifikasiItems = Array.isArray(pengajuan?.klarifikasi)
    ? pengajuan.klarifikasi.flatMap((item) => {
        const timelineItems = [];

        if (item?.pesan_admin) {
          timelineItems.push({
            id: `klarifikasi-admin-${item.id}`,
            actor: "Admin LPPM",
            pesan: item.pesan_admin,
            waktu: item.waktu_minta,
            tone: "warning",
          });
        }

        if (item?.status_klarifikasi === "TERJAWAB") {
          timelineItems.push({
            id: `klarifikasi-dosen-${item.id}`,
            actor: "Dosen",
            pesan: item.pesan_dosen || "Dosen mengirim revisi klarifikasi.",
            waktu: item.waktu_jawab || item.waktu_minta,
            tone: "success",
          });
        }

        return timelineItems;
      })
    : [];

  if (klarifikasiItems.length > 0) {
    return sortByDateDesc(klarifikasiItems, (item) => item.waktu);
  }

  if (pengajuan?.catatan_admin) {
    return [
      {
        id: `catatan-${pengajuan.id}`,
        actor: "Admin LPPM",
        pesan: pengajuan.catatan_admin,
        waktu: pengajuan.updated_at,
        tone: "default",
      },
    ];
  }

  return [];
}

function getToneClass(tone) {
  if (tone === "warning") {
    return "border-warning-100 bg-warning-20";
  }

  if (tone === "success") {
    return "border-success-100 bg-success-20";
  }

  return "border-black-40 bg-white";
}

function AdminNotesSection({ pengajuan }) {
  const items = buildClarificationTimeline(pengajuan);

  return (
    <SectionCard title="Riwayat Klarifikasi">
      {items.length > 0 ? (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg border px-4 py-3 ${getToneClass(
                item.tone,
              )}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-medium text-black-100">
                  {item.actor}
                </div>

                <div className="shrink-0 text-xs text-black-80">
                  {formatDateTime(item.waktu)}
                </div>
              </div>

              <div className="mt-2 text-sm leading-6 text-black-100">
                {item.pesan}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-black-80">
          Belum ada riwayat klarifikasi.
        </div>
      )}
    </SectionCard>
  );
}

export default AdminNotesSection;