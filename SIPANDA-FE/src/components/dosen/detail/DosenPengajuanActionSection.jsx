import SectionCard from "../../ui/SectionCard";
import { getPengajuanStatus } from "../../../utils/pengajuanHelpers";

function DosenPengajuanActionSection({
  pengajuan,
  finalDocument,
  onOpenClarification,
}) {
  const currentStatus = getPengajuanStatus(pengajuan);

  return (
    <SectionCard title="Aksi">
      <div className="space-y-4">
        {currentStatus === "PERLU_KLARIFIKASI" ? (
          <>
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
          </>
        ) : null}

        {currentStatus === "SELESAI" && finalDocument ? (
          <div className="rounded-lg bg-success-20 px-4 py-3 text-sm font-medium text-success-100">
            Surat final sudah tersedia dan dapat diunduh.
          </div>
        ) : null}

        {currentStatus !== "PERLU_KLARIFIKASI" && currentStatus !== "SELESAI" ? (
          <div className="rounded-lg bg-black-20 px-4 py-3 text-sm text-black-80">
            Tidak ada aksi yang perlu dilakukan.
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

export default DosenPengajuanActionSection;