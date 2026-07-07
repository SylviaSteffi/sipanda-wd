import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { UserRepository } from "../../../secondary/repositories/UserRepository.js";
import { GetAllUserUseCase } from "../../../../core/application/use-cases/user/GetAllUserUseCase.js";
import { GetUserByIdUseCase } from "../../../../core/application/use-cases/user/GetUserByIdUseCase.js";
import { GetUserByEmailUseCase } from "../../../../core/application/use-cases/user/GetUserByEmailUseCase.js";
import { CreateUserUseCase } from "../../../../core/application/use-cases/user/CreateUserUseCase.js";
import { UpdateUserUseCase } from "../../../../core/application/use-cases/user/UpdateUserUseCase.js";
import { UpdateUserUseCase as UpdatePasswordUserUseCase } from "../../../../core/application/use-cases/user/UpdatePasswordUserUseCase.js";
import { RemoveUserUseCase } from "../../../../core/application/use-cases/user/RemoveUserUseCase.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { authorize } from "../middlewares/RoleMiddleware.js";

const repo = new UserRepository();

const controller = new UserController({
  getAllUseCase: new GetAllUserUseCase(repo),
  getByIdUseCase: new GetUserByIdUseCase(repo),
  getByEmailUseCase: new GetUserByEmailUseCase(repo),
  createUseCase: new CreateUserUseCase(repo),
  updateUseCase: new UpdateUserUseCase(repo),
  updatePasswordUseCase: new UpdatePasswordUserUseCase(repo),
  removeUseCase: new RemoveUserUseCase(repo),
});

const router = Router();

router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getOne);
router.post("/", authenticate, authorize("ADMIN"), controller.create);
router.put("/:id", authenticate, authorize("ADMIN"), controller.update);
router.put(
  "/:id/password",
  authenticate,
  authorize("ADMIN"),
  controller.updatePassword,
);
router.delete("/:id", authenticate, authorize("ADMIN"), controller.remove);

export default router;
