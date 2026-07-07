import { FakultasRepository } from "../../../secondary/repositories/FakultasRepository.js";
import { FakultasController } from "../controllers/fakultasController.js";
import { GetAllFakultasUseCase } from "../../../../core/application/use-cases/fakultas/GetAllFakultasUseCase.js";
import { GetOneFakultasUseCase } from "../../../../core/application/use-cases/fakultas/GetOneFakultasUseCase.js";
import { CreateFakultasUseCase } from "../../../../core/application/use-cases/fakultas/CreateFakultasUseCase.js";
import { UpdateFakultasUseCase } from "../../../../core/application/use-cases/fakultas/UpdateFakultasUseCase.js";
import { RemoveFakultasUseCase } from "../../../../core/application/use-cases/fakultas/RemoveFakultasUseCase.js";
import { Router } from "express";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { authorize } from "../middlewares/RoleMiddleware.js";

const repo = new FakultasRepository();
const controller = new FakultasController({
  getAllUseCase: new GetAllFakultasUseCase(repo),
  getOneUseCase: new GetOneFakultasUseCase(repo),
  createUseCase: new CreateFakultasUseCase(repo),
  updateUseCase: new UpdateFakultasUseCase(repo),
  removeUseCase: new RemoveFakultasUseCase(repo),
});

const router = Router();

router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getOne);
router.post("/", authenticate, authorize("ADMIN"), controller.create);
router.put("/:id", authenticate, authorize("ADMIN"), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), controller.remove);

export default router;
