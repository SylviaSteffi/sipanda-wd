export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // "data:image/png;base64,..."
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function prepareDokumenPayload(filesMap, dokumenConfig) {
  // filesMap: { [kode_dokumen]: File }
  // dokumenConfig: [{ code, label, ... }]
  const result = [];

  for (const item of dokumenConfig) {
    const file = filesMap[item.code];
    if (!file) continue;

    const base64 = await fileToBase64(file);

    result.push({
      kode_dokumen: item.code,
      original_name: file.name,
      mime_type: file.type,
      file_base64: base64, // full data URL — strip prefix on BE if needed
      file_size_bytes: file.size,
    });
  }

  return result;
}
