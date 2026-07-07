import { getAnggotaLabel } from "../../../utils/pengajuanListHelpers";

function DosenSummaryCell({ pengajuan }) {
  const anggotaLabel = getAnggotaLabel(pengajuan);

  return (
    <div>
      <div className="font-medium leading-6">{pengajuan?.pemohon?.nama}</div>

      <div className="mt-1 text-black-80">
        NIDN: {pengajuan?.pemohon?.nidn || "-"}
      </div>

      {anggotaLabel ? (
        <div className="mt-1 text-black-80">Anggota: {anggotaLabel}</div>
      ) : null}
    </div>
  );
}

export default DosenSummaryCell;