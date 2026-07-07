const DOCUMENT_LABELS = {
  PROPOSAL: "Proposal Penelitian",
  LAPORAN_KEMAJUAN: "Laporan Kemajuan Penelitian",
  LAPORAN_KEMAJUAN_PKM: "Laporan Kemajuan PKM",
  LAPORAN_AKHIR: "Laporan Akhir Penelitian",
  LAPORAN_AKHIR_PKM_SERTIFIKAT:
    "Laporan Akhir PKM beserta Surat Keterangan/Sertifikat",
  ARTIKEL: "Draft Artikel/Jurnal Ilmiah",
  NASKAH_BUKU: "Naskah Buku",
  MATERI_DISAMPAIKAN: "Materi yang Disampaikan",
  MATERI_SERTIFIKAT:
    "Materi yang Disampaikan dan Surat Keterangan/Sertifikat",
  SURAT_TUGAS_PENELITIAN: "Surat Tugas Penelitian",
  SURAT_TUGAS_PKM: "Surat Tugas PKM",
  SURAT_TUGAS_ARTIKEL: "Surat Tugas Artikel",
  SURAT_TUGAS_BUKU: "Surat Tugas Buku",
  SURAT_PERMOHONAN:
    "Surat Permohonan atau Surat Persetujuan dari Masyarakat/Organisasi",
  SURAT_UNDANGAN_PKM:
    "Surat Undangan atau Surat Persetujuan dari Masyarakat/Organisasi",
  PROPOSAL_PKM: "Proposal PKM",
  SURAT_FINAL: "Surat Final",
};

const PUBLIKASI_DOCUMENT_LABELS = {
  ARTIKEL:
    "Artikel/Jurnal yang Sudah Dipublikasikan beserta Bukti Tampil Publikasi",
  BUKU:
    "Buku yang Sudah Dipublikasikan beserta Bukti Tampil Publikasi",
};

function normalizeKey(value) {
  return String(value || "").trim().toUpperCase();
}

export function getDocumentLabel(code, pengajuan = null) {
  const normalizedCode = normalizeKey(code);

  if (!normalizedCode) return "-";

  if (normalizedCode === "ARTIKEL_PUBLIKASI") {
    const kategori = normalizeKey(pengajuan?.kategori);

    return (
      PUBLIKASI_DOCUMENT_LABELS[kategori] ||
      "Artikel/Jurnal/Buku yang Sudah Dipublikasikan beserta Bukti Tampil Publikasi"
    );
  }

  return DOCUMENT_LABELS[normalizedCode] || code || "-";
}