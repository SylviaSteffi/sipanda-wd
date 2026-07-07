import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { buildSuratTemplatePayload } from "./suratTemplateMapper";
import { getTemplateConfig } from "./suratTemplateRegistry";

async function loadTemplateBinary(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error("Template DOCX gagal dimuat.");
  }

  return response.arrayBuffer();
}

function renderTemplate(templateBinary, payload) {
  const zip = new PizZip(templateBinary);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(payload);

  return doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function normalizeUpper(value) {
  return String(value || "").trim().toUpperCase();
}

function sanitizeFileNamePart(value) {
  return String(value || "")
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getNomorFileSegment(nomorSurat) {
  const raw = String(nomorSurat || "").trim();
  if (!raw) return "0000X";

  const beforeSlash = raw.split("/")[0] || raw;
  return sanitizeFileNamePart(beforeSlash.replaceAll(".", ""));
}

function getJenisSuratFileLabel(pengajuan) {
  const tahap = normalizeUpper(pengajuan?.tahap);
  const kategori = normalizeUpper(pengajuan?.kategori);

  if (tahap === "TUGAS" && kategori === "PENELITIAN") {
    return "Surat Tugas Penelitian";
  }

  if (tahap === "TUGAS" && kategori === "ARTIKEL") {
    return "Surat Tugas Artikel";
  }

  if (tahap === "TUGAS" && kategori === "BUKU") {
    return "Surat Tugas Buku";
  }

  if (tahap === "TUGAS" && kategori === "PKM") {
    return "Surat Tugas PKM";
  }

  if (tahap === "KEMAJUAN" && kategori === "PENELITIAN") {
    return "Surat Kemajuan Penelitian";
  }

  if (tahap === "KEMAJUAN" && kategori === "PKM") {
    return "Surat Kemajuan PKM";
  }

  if (tahap === "PENGESAHAN" && kategori === "PENELITIAN") {
    return "Surat Pengesahan Penelitian";
  }

  if (tahap === "PENGESAHAN" && kategori === "ARTIKEL") {
    return "Surat Pengesahan Artikel";
  }

  if (tahap === "PENGESAHAN" && kategori === "BUKU") {
    return "Surat Pengesahan Buku";
  }

  if (tahap === "PENGESAHAN" && kategori === "PKM") {
    return "Surat Pengesahan PKM";
  }

  return "Surat";
}

function stripFrontTitleTokens(name) {
  const tokens = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const titleTokens = new Set([
    "dr",
    "dr.",
    "prof",
    "prof.",
    "ir",
    "ir.",
    "hj",
    "hj.",
    "drs",
    "drs.",
    "dra",
    "dra.",
  ]);

  let startIndex = 0;
  while (
    startIndex < tokens.length &&
    titleTokens.has(tokens[startIndex].toLowerCase())
  ) {
    startIndex += 1;
  }

  return tokens.slice(startIndex);
}

function getNamaDosenUtamaForFile(pengajuan) {
  const namaPemohon = String(pengajuan?.pemohon?.nama || "").trim();
  if (!namaPemohon) return "Dosen";

  const cleanedTokens = stripFrontTitleTokens(namaPemohon)
    .map(token => token.replace(/[.,]+$/, "")); 

  if (!cleanedTokens.length) return sanitizeFileNamePart(namaPemohon);

  return sanitizeFileNamePart(cleanedTokens[0]);
}

function getNamaDosenSegment(pengajuan) {
  const namaUtama = getNamaDosenUtamaForFile(pengajuan);
  const isKelompok = normalizeUpper(pengajuan?.jenis_pengajuan) === "KELOMPOK";

  return isKelompok ? `${namaUtama} dkk` : namaUtama;
}

function getTanggalFileSegment(tanggalSurat) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const raw = String(tanggalSurat || "").trim();
  if (!raw) return "1 Jan 26";

  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return "1 Jan 26";
  }

  const day = date.getDate();
  const month = monthNames[date.getMonth()] || "Jan";
  const year = String(date.getFullYear()).slice(-2);

  return `${day} ${month} ${year}`;
}

function buildFileName(pengajuan, nomorSurat, tanggalSurat) {
  const nomorSegment = getNomorFileSegment(nomorSurat);
  const jenisSuratSegment = getJenisSuratFileLabel(pengajuan);
  const namaDosenSegment = getNamaDosenSegment(pengajuan);
  const tanggalSegment = getTanggalFileSegment(tanggalSurat);

  const tailSegment = [
    jenisSuratSegment,
    namaDosenSegment,
    tanggalSegment,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return `${sanitizeFileNamePart(`${nomorSegment}-${tailSegment}`)}.docx`;
}

export async function downloadGeneratedSuratDocx({
  pengajuan,
  pengajuanData,
  usersData,
  nomorSurat,
  tanggalSurat,
}) {
  const config = getTemplateConfig(pengajuan);

  if (!config) {
    throw new Error("Template DOCX belum tersedia untuk surat ini.");
  }

  const payload = buildSuratTemplatePayload({
    pengajuan,
    pengajuanData,
    usersData,
    nomorSurat,
    tanggalSurat,
  });

  if (!payload) {
    throw new Error("Payload template tidak tersedia.");
  }

  const templateBinary = await loadTemplateBinary(config.path);
  const blob = renderTemplate(templateBinary, payload);

  saveAs(blob, buildFileName(pengajuan, nomorSurat, tanggalSurat));
}