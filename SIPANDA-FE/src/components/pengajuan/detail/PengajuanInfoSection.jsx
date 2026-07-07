import SectionCard from "../../ui/SectionCard";
import InfoItem from "../../ui/InfoItem";
import StatusBadge from "../../ui/StatusBadge";
import {
  formatKategori,
  formatTahap,
  getPengajuanStatus,
} from "../../../utils/pengajuanHelpers";
import { formatDateOnly, formatDateTime } from "../../../utils/dateHelpers";
import { usePengajuan } from "../../../context/pengajuanContext";
import { getAkademikLabelById } from "../../../utils/akademikHelpers";

function getDisplaySuratValue(value, formatter) {
  if (!value) return "Belum tersedia";
  return formatter ? formatter(value) : value;
}

function PengajuanInfoSection({ pengajuan }) {
  const { akademikData } = usePengajuan();
  const currentStatus = getPengajuanStatus(pengajuan);
  const akademikLabel = getAkademikLabelById(
    akademikData,
    pengajuan.akademik_id,
  );

  return (
    <SectionCard title="Informasi Pengajuan">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoItem
          label="Status"
          value={<StatusBadge status={currentStatus} />}
        />
        <InfoItem label="ID Pengajuan" value={pengajuan.id} />
        <InfoItem label="Tahap" value={formatTahap(pengajuan.tahap)} />

        <InfoItem label="Kategori" value={formatKategori(pengajuan.kategori)} />
        <InfoItem label="Periode Akademik" value={akademikLabel} />
        <InfoItem
          label="Tanggal Pengajuan"
          value={formatDateTime(pengajuan.tanggal_pengajuan)}
        />

        <InfoItem
          label="Nomor Surat"
          value={getDisplaySuratValue(pengajuan.nomor_surat)}
        />
        <InfoItem
          label="Tanggal Surat"
          value={getDisplaySuratValue(pengajuan.tanggal_surat, formatDateOnly)}
        />
      </div>
    </SectionCard>
  );
}

export default PengajuanInfoSection;