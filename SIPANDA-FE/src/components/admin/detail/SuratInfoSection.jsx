import SectionCard from "../../ui/SectionCard";
import SuratDatePicker from "../../ui/SuratDatePicker";

function SuratInfoSection({
  pengajuan,
  nomorSurat,
  displayedTanggalSurat,
  isTanggalEditable,
  onTanggalSuratChange,
  initialTanggalSuratMonth,
}) {
  return (
    <SectionCard title="Informasi Surat">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2 w-full">
          <label className="block text-sm font-medium text-black-100">
            Nomor Surat
          </label>
          <input
            type="text"
            value={nomorSurat}
            readOnly
            className="w-full rounded-lg border border-black-40 bg-black-10 px-4 py-3 text-sm text-black-100 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-black-100">
            Tanggal Surat
          </label>

          <SuratDatePicker
            value={displayedTanggalSurat}
            onChange={onTanggalSuratChange}
            disabled={!isTanggalEditable}
            initialMonth={initialTanggalSuratMonth}
            pengajuan={pengajuan}
          />
        </div>
      </div>
    </SectionCard>
  );
}

export default SuratInfoSection;