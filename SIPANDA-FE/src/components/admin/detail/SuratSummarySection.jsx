import SectionCard from "../../ui/SectionCard";
import InfoItem from "../../ui/InfoItem";
import StatusBadge from "../../ui/StatusBadge";
import {
  getJudulPengajuan,
  formatKategori,
  getJenisPengajuanLabel,
  getPengajuanStatus,
  formatTahap,
} from "../../../utils/pengajuanHelpers";
import { formatDateTime } from "../../../utils/dateHelpers";
import { usePengajuan } from "../../../context/pengajuanContext";
import { getAkademikLabelById } from "../../../utils/akademikHelpers";

function getAnggotaNames(pengajuan) {
  return (pengajuan?.anggota || []).map((item) => item.nama).join(", ");
}

function SuratSummarySection({ pengajuan }) {
  const { akademikData } = usePengajuan();
  const anggotaNames = getAnggotaNames(pengajuan);
  const akademikLabel = getAkademikLabelById(
    akademikData,
    pengajuan.akademik_id,
  );
  const currentStatus = getPengajuanStatus(pengajuan);

  return (
    <SectionCard title="Ringkasan Surat">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoItem label="Status" value={<StatusBadge status={currentStatus} />} />
        <InfoItem label="Judul Pengajuan" value={getJudulPengajuan(pengajuan)} />
        <InfoItem label="Tahap" value={formatTahap(pengajuan?.tahap)} />
        <InfoItem label="Kategori" value={formatKategori(pengajuan?.kategori)} />
        <InfoItem
          label="Jenis Pengajuan"
          value={getJenisPengajuanLabel(pengajuan?.jenis_pengajuan)}
        />
        <InfoItem label="Periode Akademik" value={akademikLabel} />
        <InfoItem
          label="Tanggal Pengajuan"
          value={formatDateTime(pengajuan?.tanggal_pengajuan)}
        />
        <InfoItem label="Pemohon" value={pengajuan?.pemohon?.nama || "-"} />
        {anggotaNames ? <InfoItem label="Anggota" value={anggotaNames} /> : null}
      </div>
    </SectionCard>
  );
}

export default SuratSummarySection;