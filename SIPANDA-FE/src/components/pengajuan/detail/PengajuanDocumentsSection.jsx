import SectionCard from "../../ui/SectionCard";
import FileRow from "../../ui/FileRow";
import {
  previewStoredDoc,
  downloadStoredDoc,
  canPreviewStoredDoc,
} from "../../../utils/documentHelpers";
import { getDocumentLabel } from "../../../utils/documentLabelHelpers";

function DocumentColumn({ title, dokumen, emptyLabel, pengajuan }) {
  return (
    <div className="space-y-3 rounded-lg border border-black-40 p-4">
      <h3 className="text-sm font-semibold text-black-100">{title}</h3>

      {dokumen.length > 0 ? (
        <div className="space-y-3">
          {dokumen.map((doc) => (
            <FileRow
              key={`${doc.pengajuan_id}-${doc.id}`}
              name={doc.original_name}
              subtitle={getDocumentLabel(doc.kode_dokumen, pengajuan)}
              onPreview={
                canPreviewStoredDoc(doc)
                  ? () => previewStoredDoc(doc)
                  : undefined
              } 
              onDownload={() => downloadStoredDoc(doc)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-black-40 p-4 text-sm text-black-80">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

function PengajuanDocumentsSection({
  pengajuan,
  dokumenTahapSebelumnya = [],
  dokumenTahapIni = [],
}) {
  return (
    <SectionCard title="Dokumen Pengajuan">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DocumentColumn
          title="Dokumen Tahap Sebelumnya"
          dokumen={dokumenTahapSebelumnya}
          emptyLabel="Belum ada dokumen dari tahap sebelumnya."
          pengajuan={pengajuan}
        />

        <DocumentColumn
          title="Dokumen Tahap Saat Ini"
          dokumen={dokumenTahapIni}
          emptyLabel="Belum ada dokumen pada tahap ini."
          pengajuan={pengajuan}
        />
      </div>
    </SectionCard>
  );
}

export default PengajuanDocumentsSection;