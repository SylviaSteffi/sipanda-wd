import SectionCard from "../../ui/SectionCard";
import StatusBadge from "../../ui/StatusBadge";
import { formatDateTime, sortByDateDesc } from "../../../utils/dateHelpers";

function StatusHistorySection({ pengajuan }) {
  const items = sortByDateDesc(
    pengajuan?.riwayat_status || [],
    (item) => item.created_at,
  );
  const dosenId = pengajuan?.user_id;
  return (
    <SectionCard title="Riwayat Status">
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => {
            const isDosen = +item.user_id === +dosenId;
            const roleLabel = isDosen ? "Dosen" : "Admin";
            const roleColorClass = isDosen
              ? "text-blue-600 font-semibold"
              : "text-red-600 font-semibold";

            return (
              <div
                key={item.id}
                className="rounded-lg border border-black-40 bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="shrink-0">
                      <StatusBadge status={item.status_baru} />
                    </div>

                    <div className="min-w-0 text-sm font-medium leading-6 text-black-80">
                      {/* Tampilkan Label Role dengan warna yang berbeda */}
                      <span className={`${roleColorClass} mr-1.5`}>
                        [{roleLabel}]
                      </span>
                      <span className="font-normal text-black-80">
                        {item.keterangan}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-xs text-black-60">
                    {formatDateTime(item.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-black-80">Belum ada riwayat status.</div>
      )}
    </SectionCard>
  );
}

export default StatusHistorySection;
