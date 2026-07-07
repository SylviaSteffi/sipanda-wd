import { Link } from "react-router-dom";
import SectionCard from "../../ui/SectionCard";

function CreatePengajuanBlockedState({ createAvailability }) {
  return (
    <SectionCard>
      <div className="space-y-3">
        <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm font-medium text-warning-100">
          {createAvailability.message ||
            "Hari ini pengajuan tidak dapat dibuat."}
        </div>

        <div className="text-sm text-black-80">
          Pembuatan pengajuan ditutup untuk tanggal {createAvailability.dateKey}
          . Silakan buat pengajuan pada hari kerja berikutnya.
        </div>

        <div>
          <Link
            to="/dosen/pengajuan"
            className="inline-flex rounded-lg border border-black-40 px-4 py-2.5 text-sm font-medium text-black-100 no-underline hover:bg-black-20"
          >
            Kembali ke Pengajuan Saya
          </Link>
        </div>
      </div>
    </SectionCard>
  );
}

export default CreatePengajuanBlockedState;
