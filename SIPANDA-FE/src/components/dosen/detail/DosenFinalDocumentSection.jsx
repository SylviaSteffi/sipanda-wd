import SectionCard from "../../ui/SectionCard";
import FileRow from "../../ui/FileRow";
import {
  downloadStoredDoc,
  previewStoredDoc,
  canPreviewStoredDoc,
} from "../../../utils/documentHelpers";

function DosenFinalDocumentSection({ finalDocument }) {
  return (
    <SectionCard title="Dokumen Hasil Akhir / Surat Final">
      {finalDocument ? (
        <FileRow
          name={finalDocument.original_name}
          subtitle="Dokumen final layanan"
          onPreview={
            canPreviewStoredDoc(finalDocument)
              ? () => previewStoredDoc(finalDocument)
              : undefined
          } 
          onDownload={() => downloadStoredDoc(finalDocument)}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-black-40 p-4 text-sm text-black-80">
          Dokumen final belum tersedia.
        </div>
      )}
    </SectionCard>
  );
}

export default DosenFinalDocumentSection;