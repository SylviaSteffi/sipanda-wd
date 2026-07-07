import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const Klarifikasi = sequelize.define(
  "Klarifikasi",
  {
    klarifikasi_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pengajuan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pesan_admin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pesan_dosen: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    waktu_minta: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    waktu_jawab: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_klarifikasi: {
      type: DataTypes.ENUM("MENUNGGU", "TERJAWAB"),
      allowNull: false,
      defaultValue: "MENUNGGU",
    },
  },
  {
    tableName: "klarifikasi",
    timestamps: false,
  },
);

export default Klarifikasi;
