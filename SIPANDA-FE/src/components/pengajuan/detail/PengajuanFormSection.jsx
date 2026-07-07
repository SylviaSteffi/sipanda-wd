import SectionCard from "../../ui/SectionCard.jsx";
import InfoItem from "../../ui/InfoItem.jsx";
import { getFormulirFields } from "../../../utils/pengajuanDetailHelpers.js";

function renderFieldValue(field) {
  if (field.isLink) {
    return (
      <a
        href={field.value}
        target="_blank"
        rel="noreferrer"
        className="text-primary-100 underline break-all"
      >
        {field.value}
      </a>
    );
  }

  return field.value;
}

function PengajuanFormSection({ pengajuan }) {
  const fields = getFormulirFields(pengajuan);

  return (
    <SectionCard title="Data Formulir Pengajuan">
      {fields.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <InfoItem
              key={field.label}
              label={field.label}
              value={renderFieldValue(field)}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-black-80">
          Data formulir belum tersedia.
        </div>
      )}
    </SectionCard>
  );
}

export default PengajuanFormSection;