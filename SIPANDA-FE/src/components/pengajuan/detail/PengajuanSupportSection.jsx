import { useMemo } from "react";
import SectionCard from "../../ui/SectionCard";
import InfoItem from "../../ui/InfoItem";

function getDosenRows(pengajuan) {
  const pemohon = pengajuan?.pemohon ? [pengajuan.pemohon] : [];
  const anggota = Array.isArray(pengajuan?.anggota) ? pengajuan.anggota : [];

  if (pengajuan?.jenis_pengajuan === "KELOMPOK") {
    return [
      ...pemohon.map((item) => ({
        ...item,
        role_label: "Ketua Pengusul",
      })),
      ...anggota.map((item, index) => ({
        ...(item?.user ?? item),
        role_label: `Anggota ${index + 1}`,
      })),
    ];
  }

  return pemohon;
}

function DosenInfoGrid({ dosen }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InfoItem label="Nama Dosen" value={dosen.nama} />
      <InfoItem label="NIDN" value={dosen.nidn} />
      <InfoItem label="Email" value={dosen.email} />
      <InfoItem
        label="Fakultas"
        value={
          typeof dosen.fakultas === "object"
            ? dosen.fakultas?.nama_fakultas
            : dosen.fakultas
        }
      />
      <InfoItem
        label="Program Studi"
        value={
          typeof dosen.prodi === "object"
            ? dosen.prodi?.nama_prodi
            : dosen.prodi
        }
      />
      <InfoItem label="No WA / HP" value={dosen.no_hp} />
    </div>
  );
}

function PengajuanSupportSection({ pengajuan }) {
  const dosenRows = useMemo(() => getDosenRows(pengajuan), [pengajuan]);
  const isKelompok = pengajuan?.jenis_pengajuan === "KELOMPOK";

  return (
    <SectionCard title="Data Dosen Pengusul">
      {!isKelompok && dosenRows[0] ? (
        <DosenInfoGrid dosen={dosenRows[0]} />
      ) : (
        <div className="space-y-3">
          {dosenRows.map((dosen, index) => (
            <div
              key={`${dosen.id}-${index}`}
              className="rounded-lg border border-black-40 p-4"
            >
              <div className="mb-3 text-sm font-semibold text-black-100">
                {dosen.role_label}
              </div>

              <DosenInfoGrid dosen={dosen} />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export default PengajuanSupportSection;
