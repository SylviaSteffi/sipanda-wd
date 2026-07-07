export function getAncestorStages(pengajuan, pengajuanData = []) {
  const result = [];
  let currentParentId = pengajuan?.parent_id || null;

  while (currentParentId) {
    const found =
      pengajuanData.find(
        (item) => String(item.id) === String(currentParentId),
      ) || null;

    if (!found) break;

    result.push(found);
    currentParentId = found.parent_id || null;
  }

  return result;
}

const TAHAP_ORDER = { TUGAS: 1, KEMAJUAN: 2, PENGESAHAN: 3 };
export function getRelatedStages(pengajuan, pengajuanData = []) {
  if (!pengajuan?.root_pengajuan_id) return [];
  return pengajuanData
    .filter(
      (item) =>
        String(item.root_pengajuan_id) === String(pengajuan.root_pengajuan_id) &&
        String(item.id) !== String(pengajuan.id),
    )
    .sort(
      (a, b) =>
        (TAHAP_ORDER[a.tahap] || 0) - (TAHAP_ORDER[b.tahap] || 0),
    );
}

export function getNearestParentPengajuan(pengajuan, pengajuanData = []) {
  if (!pengajuan?.parent_id) return null;

  return (
    pengajuanData.find(
      (item) => String(item.id) === String(pengajuan.parent_id),
    ) || null
  );
}

export function deduplicateDocuments(dokumen = []) {
  const seen = new Set();

  return dokumen.filter((doc) => {
    const key = `${doc.pengajuan_id}-${doc.id}-${doc.kode_dokumen}`;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}