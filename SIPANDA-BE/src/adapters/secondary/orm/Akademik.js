import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const Akademik = sequelize.define(
  "Akademik",
  {
    akademik_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_akademik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_akademik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_aktif: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "akademik",
    timestamps: false,
  },
);

export default Akademik;
