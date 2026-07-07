import { Router } from "express";
import { AkademikController } from "../controllers/akademikController.js";
import { AkademikSequelizeRepository } from "../../../secondary/repositories/AkademikRepository.js";
import { GetAllAkademikUseCase } from "../../../../core/application/use-cases/akademik/GetAllAkademikUseCase.js";
import { GetAkademikUseCase } from "../../../../core/application/use-cases/akademik/GetAkademikUseCase.js";
import { CreateAkademikUseCase } from "../../../../core/application/use-cases/akademik/CreateAkademikUseCase.js";
import { UpdateAkademikUseCase } from "../../../../core/application/use-cases/akademik/UpdateAkademikUseCase.js";
import { DeactivateAkademikUseCase } from "../../../../core/application/use-cases/akademik/DeactivateAkademikUseCase.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { authorize } from "../middlewares/RoleMiddleware.js";

const repo = new AkademikSequelizeRepository();
const controller = new AkademikController({
  getAllUseCase: new GetAllAkademikUseCase(repo),
  getUseCase: new GetAkademikUseCase(repo),
  createUseCase: new CreateAkademikUseCase(repo),
  updateUseCase: new UpdateAkademikUseCase(repo),
  deactivateUseCase: new DeactivateAkademikUseCase(repo),
});

const router = Router();

router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getOne);
router.post("/", authenticate, authorize("ADMIN"), controller.create);
router.put("/:id", authenticate, authorize("ADMIN"), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), controller.deactivate);

export default router;
