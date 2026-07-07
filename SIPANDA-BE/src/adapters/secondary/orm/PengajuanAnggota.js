import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const PengajuanAnggota = sequelize.define(
  "PengajuanAnggota",
  {
    pengajuan_anggota_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pengajuan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    urutan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    peran: {
      type: DataTypes.ENUM("KETUA", "ANGGOTA"),
      allowNull: false,
    },
  },
  {
    tableName: "pengajuan_anggota",
    timestamps: false,
  },
);

export default PengajuanAnggota;
