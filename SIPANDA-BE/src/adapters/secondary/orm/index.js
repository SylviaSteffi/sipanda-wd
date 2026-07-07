import { sequelize } from "../../../config/database/index.js";
import Fakultas from "./Fakultas.js";
import Prodi from "./Prodi.js";
import User from "./User.js";
import Akademik from "./Akademik.js";
import Pengajuan from "./Pengajuan.js";
import PengajuanAnggota from "./PengajuanAnggota.js";
import Dokumen from "./Dokumen.js";
import Klarifikasi from "./Klarifikasi.js";
import RiwayatStatus from "./RiwayatStatus.js";
import {
  DetailTugasPenelitian,
  DetailKemajuanPenelitian,
  DetailPengesahanPenelitian,
  DetailTugasPKM,
  DetailKemajuanPKM,
  DetailPengesahanPKM,
  DetailTugasPublikasi,
  DetailPengesahanArtikel,
  DetailPengesahanBuku,
} from "./DetailModels.js";

// Fakultas <-> Prodi
Fakultas.hasMany(Prodi, { foreignKey: "fakultas_id", as: "prodis" });
Prodi.belongsTo(Fakultas, { foreignKey: "fakultas_id", as: "fakultas" });

// Fakultas <-> User
Fakultas.hasMany(User, { foreignKey: "fakultas_id", as: "users" });
User.belongsTo(Fakultas, { foreignKey: "fakultas_id", as: "fakultas" });

// Prodi <-> User
Prodi.hasMany(User, { foreignKey: "prodi_id", as: "users" });
User.belongsTo(Prodi, { foreignKey: "prodi_id", as: "prodi" });

// User <-> Pengajuan (ketua / pemilik)
User.hasMany(Pengajuan, { foreignKey: "user_id", as: "pengajuans" });
Pengajuan.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Akademik <-> Pengajuan
Akademik.hasMany(Pengajuan, { foreignKey: "akademik_id", as: "pengajuans" });
Pengajuan.belongsTo(Akademik, { foreignKey: "akademik_id", as: "akademik" });

// Pengajuan self-referential (parent / child / root)
Pengajuan.hasMany(Pengajuan, { foreignKey: "parent_id", as: "children" });
Pengajuan.belongsTo(Pengajuan, { foreignKey: "parent_id", as: "parent" });
Pengajuan.hasMany(Pengajuan, {
  foreignKey: "root_pengajuan_id",
  as: "revisions",
});
Pengajuan.belongsTo(Pengajuan, { foreignKey: "root_pengajuan_id", as: "root" });

// Pengajuan <-> PengajuanAnggota
Pengajuan.hasMany(PengajuanAnggota, {
  foreignKey: "pengajuan_id",
  as: "anggota",
});
PengajuanAnggota.belongsTo(Pengajuan, {
  foreignKey: "pengajuan_id",
  as: "pengajuan",
});

// User <-> PengajuanAnggota
User.hasMany(PengajuanAnggota, { foreignKey: "user_id", as: "keanggotaan" });
PengajuanAnggota.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Pengajuan <-> Dokumen
Pengajuan.hasMany(Dokumen, { foreignKey: "pengajuan_id", as: "dokumen" });
Dokumen.belongsTo(Pengajuan, { foreignKey: "pengajuan_id", as: "pengajuan" });

// Pengajuan <-> Klarifikasi
Pengajuan.hasMany(Klarifikasi, {
  foreignKey: "pengajuan_id",
  as: "klarifikasis",
});
Klarifikasi.belongsTo(Pengajuan, {
  foreignKey: "pengajuan_id",
  as: "pengajuan",
});

// Pengajuan <-> RiwayatStatus
Pengajuan.hasMany(RiwayatStatus, {
  foreignKey: "pengajuan_id",
  as: "riwayatStatuses",
});
RiwayatStatus.belongsTo(Pengajuan, {
  foreignKey: "pengajuan_id",
  as: "pengajuan",
});
User.hasMany(RiwayatStatus, { foreignKey: "user_id", as: "riwayatStatuses" });
RiwayatStatus.belongsTo(User, { foreignKey: "user_id", as: "user" });


// ── Detail 1-to-1 with Pengajuan ─────────────────────────────────────────────
const detailModels = [
  { model: DetailTugasPenelitian, as: "detailTugasPenelitian" },
  { model: DetailKemajuanPenelitian, as: "detailKemajuanPenelitian" },
  { model: DetailPengesahanPenelitian, as: "detailPengesahanPenelitian" },
  { model: DetailTugasPKM, as: "detailTugasPKM" },
  { model: DetailKemajuanPKM, as: "detailKemajuanPKM" },
  { model: DetailPengesahanPKM, as: "detailPengesahanPKM" },
  { model: DetailTugasPublikasi, as: "detailTugasPublikasi" },
  { model: DetailPengesahanArtikel, as: "detailPengesahanArtikel" },
  { model: DetailPengesahanBuku, as: "detailPengesahanBuku" },
];

detailModels.forEach(({ model, as }) => {
  Pengajuan.hasOne(model, { foreignKey: "pengajuan_id", as });
  model.belongsTo(Pengajuan, { foreignKey: "pengajuan_id", as: "pengajuan" });
});

// ── Exports ───────────────────────────────────────────────────────────────────
export {
  sequelize,
  User,
  Fakultas,
  Prodi,
  Akademik,
  Pengajuan,
  PengajuanAnggota,
  Dokumen,
  Klarifikasi,
  RiwayatStatus,
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
