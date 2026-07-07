import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const Prodi = sequelize.define(
  "Prodi",
  {
    prodi_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fakultas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kode_prodi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_prodi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenjang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "prodi",
    timestamps: false,
  },
);

export default Prodi;
