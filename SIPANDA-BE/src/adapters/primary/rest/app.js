import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import fakultasRoutes from "./routes/fakultasRoutes.js";
import prodiRoutes from "./routes/prodiRoutes.js";
import akademikRoutes from "./routes/akademikRoutes.js";
import pengajuanRoutes from "./routes/pengajuanRoutes.js";
import errorHandler from "./middlewares/ErrorHandler.js";
import authRoutes from "./routes/authRoutes.js";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(cors());

  app.use("/api/akademik", akademikRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/fakultas", fakultasRoutes);
  app.use("/api/prodi", prodiRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/pengajuan", pengajuanRoutes);


  app.get("/", (req, res) => res.send("Hello World!"));

  app.use(errorHandler);

  return app;
}
