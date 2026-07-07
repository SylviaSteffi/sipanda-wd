import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const Pengajuan = sequelize.define(
  "Pengajuan",
  {
    pengajuan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    root_pengajuan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nomor_urut_harian: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tahap: {
      type: DataTypes.ENUM("TUGAS", "KEMAJUAN", "PENGESAHAN"),
      allowNull: false,
    },
    kategori: {
      type: DataTypes.ENUM("PENELITIAN", "PKM", "ARTIKEL", "BUKU"),
      allowNull: false,
    },
    jenis_pengajuan: {
      type: DataTypes.ENUM("INDIVIDU", "KELOMPOK"),
      allowNull: false,
    },
    akademik_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status_pengajuan: {
      type: DataTypes.ENUM(
        "DIAJUKAN",
        "DALAM_PEMERIKSAAN",
        "PERLU_KLARIFIKASI",
        "DISETUJUI",
        "DITOLAK",
        "SELESAI",
      ),
      allowNull: false,
      defaultValue: "DIAJUKAN",
    },
    tanggal_pengajuan: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nomor_surat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tanggal_surat: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    catatan_admin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "pengajuan",
  },
);

export default Pengajuan;
