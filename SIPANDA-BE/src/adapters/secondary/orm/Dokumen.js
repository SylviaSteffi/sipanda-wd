import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const Dokumen = sequelize.define(
  "Dokumen",
  {
    dokumen_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pengajuan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kode_dokumen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_base64: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    file_size_bytes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "dokumen",
  },
);

export default Dokumen;
