import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const Fakultas = sequelize.define(
  "Fakultas",
  {
    fakultas_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_fakultas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_fakultas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "fakultas",
    timestamps: false,
  },
);

export default Fakultas;
