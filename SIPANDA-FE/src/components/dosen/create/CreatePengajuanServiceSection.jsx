import SectionCard from "../../ui/SectionCard";
import ListFilterSelect from "../../ui/ListFilterSelect";
import {
  DOSEN_JENIS_PENGAJUAN_OPTIONS,
  DOSEN_LAYANAN_OPTIONS,
} from "../../../utils/dosenCreatePengajuanHelpers";

function getJenisPengajuanOptions(kelompokAllowed) {
  return DOSEN_JENIS_PENGAJUAN_OPTIONS.map((item) => ({
    ...item,
    disabled: item.value === "KELOMPOK" && !kelompokAllowed,
  }));
}

function CreatePengajuanServiceSection({
  tahap,
  kategori,
  jenisPengajuan,
  kategoriOptions,
  kelompokAllowed,
  onLayananChange,
  onKategoriChange,
  onJenisPengajuanChange,
}) {
  const jenisPengajuanOptions = getJenisPengajuanOptions(kelompokAllowed);

  return (
    <SectionCard title="Pilihan Layanan">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ListFilterSelect
          label="Jenis Layanan"
          value={tahap}
          onChange={onLayananChange}
          options={DOSEN_LAYANAN_OPTIONS}
          showAllOption={false}
        />

        <ListFilterSelect
          label="Kategori"
          value={kategori}
          onChange={onKategoriChange}
          options={kategoriOptions}
          showAllOption={false}
        />

        <ListFilterSelect
          label="Jenis Pengajuan"
          value={jenisPengajuan}
          onChange={onJenisPengajuanChange}
          options={jenisPengajuanOptions}
          showAllOption={false}
          helperText={
            kelompokAllowed
              ? ""
              : "Pengajuan kelompok belum tersedia untuk pilihan layanan ini."
          }
        />
      </div>
    </SectionCard>
  );
}

export default CreatePengajuanServiceSection;