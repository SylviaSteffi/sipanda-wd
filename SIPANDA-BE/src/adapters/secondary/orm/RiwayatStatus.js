import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const RiwayatStatus = sequelize.define(
  "RiwayatStatus",
  {
    riwayat_status_id: {
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
    status_lama: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_baru: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "riwayat_status",
    updatedAt: false,
  },
);

export default RiwayatStatus;
