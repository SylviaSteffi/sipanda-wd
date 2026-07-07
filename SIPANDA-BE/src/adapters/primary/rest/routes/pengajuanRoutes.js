import { Router } from "express";
import { PengajuanController } from "../controllers/pengajuanController.js";
import { PengajuanRepository } from "../../../secondary/repositories/PengajuanRepository.js";
import { GetAllPengajuanUseCase } from "../../../../core/application/use-cases/pengajuan/GetAllPengajuanUseCase.js";
import CreatePengajuanUseCase from "../../../../core/application/use-cases/pengajuan/CreatePengajuanUseCase.js";
import { DokumenRepository } from "../../../secondary/repositories/DokumenRepository.js";
import { DokumenService } from "../../../../core/domain/services/DokumenService.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { GetPengajuanUseCase } from "../../../../core/application/use-cases/pengajuan/GetOnePengajuanUseCase.js";
import { ChangeStatusPengajuanUseCase } from "../../../../core/application/use-cases/pengajuan/ChangeStatusPengajuanUseCase.js";
import { UpdatePengajuanUseCase } from "../../../../core/application/use-cases/pengajuan/UpdatePengajuanUseCase.js";

const repo = new PengajuanRepository();
const dokumenRepository = new DokumenRepository();
const controller = new PengajuanController({
  getAllUseCase: new GetAllPengajuanUseCase(repo),
  createUseCase: new CreatePengajuanUseCase({
    pengajuanRepository: repo,
    dokumenRepository: dokumenRepository,
    dokumenService: new DokumenService(),
  }),
  getOneUseCase: new GetPengajuanUseCase(repo),
  updateUseCase: new UpdatePengajuanUseCase({
    pengajuanRepository: repo,
    dokumenRepository: dokumenRepository,
    dokumenService: new DokumenService(),
  }),
  changeStatusUseCase: new ChangeStatusPengajuanUseCase(repo),
});

const router = Router();

router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getOne);
router.post("/", authenticate, controller.create);
router.put("/:id", authenticate, controller.update);
router.put("/:id/status", authenticate, controller.changeStatus);
// router.delete("/:id", controller.remove);

export default router;
