import { ProdiRepository } from "../../../secondary/repositories/ProdiRepository.js";
import { ProdiController } from "../controllers/prodiController.js";
import { GetAllProdiUseCase } from "../../../../core/application/use-cases/prodi/GetAllProdiUseCase.js";
import { GetOneProdiUseCase } from "../../../../core/application/use-cases/prodi/GetOneProdiUseCase.js";
import { CreateProdiUseCase } from "../../../../core/application/use-cases/prodi/CreateProdiUseCase.js";
import { UpdateProdiUseCase } from "../../../../core/application/use-cases/prodi/UpdateProdiUseCase.js";
import { RemoveProdiUseCase } from "../../../../core/application/use-cases/prodi/RemoveProdiUseCase.js";
import { Router } from "express";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { authorize } from "../middlewares/RoleMiddleware.js";

const repo = new ProdiRepository();
const controller = new ProdiController({
  getAllUseCase: new GetAllProdiUseCase(repo),
  getOneUseCase: new GetOneProdiUseCase(repo),
  createUseCase: new CreateProdiUseCase(repo),
  updateUseCase: new UpdateProdiUseCase(repo),
  removeUseCase: new RemoveProdiUseCase(repo),
});

const router = Router();

router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getOne);
router.post("/", authenticate, authorize("ADMIN"), controller.create);
router.put("/:id", authenticate, authorize("ADMIN"), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), controller.remove);

export default router;
