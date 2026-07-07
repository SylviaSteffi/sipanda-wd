import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_DATABASE || "sipanda",
  process.env.DB_USERNAME || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_TYPE || "mysql",
    // logging: process.env.NODE_ENV === "development" ? console.log : false,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync({
      alter: process.env.NODE_ENV === "development" || false,
      // force: true,
    });
    console.log("All models synced.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
}

export { sequelize, initDB };
