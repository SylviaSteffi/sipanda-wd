import { getJudulPengajuan } from "../../../utils/pengajuanHelpers";
import { getRingkasanSubtitle } from "../../../utils/pengajuanListHelpers";

function PengajuanSummaryCell({ pengajuan }) {
  return (
    <div>
      <div className="break-words font-medium leading-6">
        {getJudulPengajuan(pengajuan)}
      </div>

      <div className="mt-1 text-black-80">
        {getRingkasanSubtitle(pengajuan)}
      </div>
    </div>
  );
}

export default PengajuanSummaryCell;