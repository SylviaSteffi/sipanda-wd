import InfoItem from "../../ui/InfoItem";

function CreatePengajuanPemohonSection({ pemohon }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InfoItem label="Email" value={pemohon.email} />
      <InfoItem label="Nama Lengkap dengan Gelar" value={pemohon.nama} />
      <InfoItem label="NIDN / NUPTK" value={pemohon.nidn} />
      <InfoItem
        label="Fakultas"
        value={
          typeof pemohon.fakultas === "object" && pemohon.fakultas !== null
            ? pemohon.fakultas.nama_fakultas
            : pemohon.fakultas
        }
      />
      <InfoItem
        label="Program Studi"
        value={
          typeof pemohon.prodi === "object" && pemohon.prodi !== null
            ? pemohon.prodi.nama_prodi
            : pemohon.prodi
        }
      />
      <InfoItem label="No WA / HP" value={pemohon.no_hp} />
    </div>
  );
}

export default CreatePengajuanPemohonSection;
