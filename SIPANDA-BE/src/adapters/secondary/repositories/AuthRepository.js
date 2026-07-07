import { AuthRepositoryPort } from "../../../core/application/ports/AuthRepositoryPort.js";
import User from "../orm/User.js";

export class AuthRepository extends AuthRepositoryPort {
  async register(payload) {
    const user = User.create(payload);
  }
}
