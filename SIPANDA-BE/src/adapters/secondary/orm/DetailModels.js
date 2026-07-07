import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

// ─── Detail Tugas Penelitian ─────────────────────────────────────────────────
const DetailTugasPenelitian = sequelize.define(
  "DetailTugasPenelitian",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    judul_proposal: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "detail_tugas_penelitian", timestamps: false },
);

// ─── Detail Kemajuan Penelitian ──────────────────────────────────────────────
const DetailKemajuanPenelitian = sequelize.define(
  "DetailKemajuanPenelitian",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    judul_penelitian: { type: DataTypes.STRING, allowNull: true },
    no_surat_tugas: { type: DataTypes.STRING, allowNull: true },
    tanggal_surat_tugas: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { tableName: "detail_kemajuan_penelitian", timestamps: false },
);

// ─── Detail Pengesahan Penelitian ────────────────────────────────────────────
const DetailPengesahanPenelitian = sequelize.define(
  "DetailPengesahanPenelitian",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    judul_penelitian: { type: DataTypes.STRING, allowNull: true },
    no_surat_tugas: { type: DataTypes.STRING, allowNull: true },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: true },
    tanggal_selesai: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { tableName: "detail_pengesahan_penelitian", timestamps: false },
);

// ─── Detail Tugas PKM ────────────────────────────────────────────────────────
const DetailTugasPKM = sequelize.define(
  "DetailTugasPKM",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    nama_institusi_pemohon: { type: DataTypes.STRING, allowNull: true },
    no_surat_permohonan: { type: DataTypes.STRING, allowNull: true },
    tanggal_surat_permohonan: { type: DataTypes.DATEONLY, allowNull: true },
    jenis_pkm: {
      type: DataTypes.ENUM("Pembicara", "Lainnya"),
      allowNull: true,
    },
    judul_pkm: { type: DataTypes.STRING, allowNull: true },
    judul_materi: { type: DataTypes.STRING, allowNull: true },
    tempat_pelaksanaan: { type: DataTypes.STRING, allowNull: true },
    waktu_pelaksanaan: { type: DataTypes.DATE, allowNull: true },
    sumber_dana: { type: DataTypes.STRING, allowNull: true },
    besar_dana: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
  },
  { tableName: "detail_tugas_pkm", timestamps: false },
);

// ─── Detail Kemajuan PKM ─────────────────────────────────────────────────────
const DetailKemajuanPKM = sequelize.define(
  "DetailKemajuanPKM",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    judul_pkm: { type: DataTypes.STRING, allowNull: true },
    no_surat_tugas: { type: DataTypes.STRING, allowNull: true },
    tanggal_surat_tugas: { type: DataTypes.DATEONLY, allowNull: true },
    tempat_pkm: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "detail_kemajuan_pkm", timestamps: false },
);

// ─── Detail Pengesahan PKM ───────────────────────────────────────────────────
const DetailPengesahanPKM = sequelize.define(
  "DetailPengesahanPKM",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    no_surat_tugas: { type: DataTypes.STRING, allowNull: true },
    jenis_pkm: {
      type: DataTypes.ENUM("Pembicara", "Lainnya"),
      allowNull: true,
    },
    judul_materi: { type: DataTypes.STRING, allowNull: true },
    judul_pkm: { type: DataTypes.STRING, allowNull: true },
    tempat_pelaksanaan: { type: DataTypes.STRING, allowNull: true },
    waktu_pelaksanaan: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "detail_pengesahan_pkm", timestamps: false },
);

// ─── Detail Tugas Publikasi ──────────────────────────────────────────────────
const DetailTugasPublikasi = sequelize.define(
  "DetailTugasPublikasi",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    judul_karya: { type: DataTypes.STRING, allowNull: true },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { tableName: "detail_tugas_publikasi", timestamps: false },
);

// ─── Detail Pengesahan Publikasi ─────────────────────────────────────────────
const DetailPengesahanArtikel = sequelize.define(
  "DetailPengesahanPublikasi",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: true },
    no_surat_tugas: { type: DataTypes.STRING, allowNull: true },
    judul_artikel: { type: DataTypes.STRING, allowNull: true },
    nama_jurnal: { type: DataTypes.STRING, allowNull: true },
    cakupan_jurnal: {
      type: DataTypes.ENUM(
        "JURNAL_NASIONAL",
        "JURNAL_INTERNASIONAL",
        "PROSIDING",
      ),
      allowNull: false,
      defaultValue: "JURNAL_NASIONAL",
    },
    peringkat_jurnal: { type: DataTypes.STRING, allowNull: true },
    volume: { type: DataTypes.STRING, allowNull: true },
    nomor: { type: DataTypes.STRING, allowNull: true },
    tanggal_terbit: { type: DataTypes.DATEONLY, allowNull: true },
    penerbit: { type: DataTypes.STRING, allowNull: true },
    link_artikel: { type: DataTypes.STRING, allowNull: true },
    doi: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "detail_pengesahan_artikel", timestamps: false },
);

const DetailPengesahanBuku = sequelize.define(
  "DetailPengesahanBuku",
  {
    pengajuan_id: { type: DataTypes.INTEGER, primaryKey: true },
    bidang_ilmu: { type: DataTypes.STRING, allowNull: true },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: true },
    no_surat_tugas: { type: DataTypes.STRING, allowNull: true },
    judul_book_chapter: { type: DataTypes.STRING, allowNull: true },
    judul_buku: { type: DataTypes.STRING, allowNull: true },
    halaman: { type: DataTypes.STRING, allowNull: true },
    penerbit: { type: DataTypes.STRING, allowNull: true },
    isbn: { type: DataTypes.STRING, allowNull: true },
    tanggal_terbit: { type: DataTypes.DATEONLY, allowNull: true },
    link_buku: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "detail_pengesahan_buku", timestamps: false },
);

export {
  DetailTugasPenelitian,
  DetailKemajuanPenelitian,
  DetailPengesahanPenelitian,
  DetailTugasPKM,
  DetailKemajuanPKM,
  DetailPengesahanPKM,
  DetailTugasPublikasi,
  DetailPengesahanArtikel,
  DetailPengesahanBuku,
};
