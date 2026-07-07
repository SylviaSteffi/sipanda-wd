import { Router } from "express";

import { UserRepository } from "../../../secondary/repositories/UserRepository.js";
import { JwtService } from "../../../secondary/services/JWTService.js";

import { LoginUseCase } from "../../../../core/application/use-cases/auth/LoginUseCase.js";
import { RegisterUseCase } from "../../../../core/application/use-cases/auth/RegisterUseCase.js";
import { GetMeUseCase } from "../../../../core/application/use-cases/auth/MeUseCase.js";
import { ChangePasswordUseCase } from "../../../../core/application/use-cases/auth/ChangePasswordUseCase.js";

import { AuthController } from "../controllers/authController.js";
import { authenticate } from "../middlewares/AuthMiddleware.js";
import { authorize } from "../middlewares/RoleMiddleware.js";

// --- DI / Composition Root ---
const userRepository = new UserRepository();
const jwtService = new JwtService();

const controller = new AuthController({
  loginUseCase: new LoginUseCase(userRepository, jwtService),
  registerUseCase: new RegisterUseCase(userRepository, jwtService),
  getMeUseCase: new GetMeUseCase(userRepository),
  changePasswordUseCase: new ChangePasswordUseCase(userRepository, jwtService),
});

// --- Routes ---
const router = Router();

router.post("/login", controller.login);
router.post("/register", controller.register); // guard with authorize("Admin") if needed
router.get("/me", authenticate, controller.me);
router.put("/change-password", authenticate, controller.changePassword);

export default router;
