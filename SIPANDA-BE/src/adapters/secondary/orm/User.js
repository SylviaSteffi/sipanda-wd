import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database/index.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "DOSEN"),
      allowNull: false,
    },
    nidn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fakultas_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prodi_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    no_hp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jabatan: {
      type: DataTypes.ENUM("DOSEN", "KAPRODI", "DEKAN", "KETUA_LPPM"),
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
    defaultScope: {
      where: {
        is_deleted: 0,
      },
    },
  },
);

export default User;
