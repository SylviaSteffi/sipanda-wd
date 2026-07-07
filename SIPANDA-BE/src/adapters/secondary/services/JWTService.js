import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtServicePort } from "../../../core/application/ports/JwtServicePort.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class JwtService extends JwtServicePort {
  signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  async hashPassword(plain) {
    return bcrypt.hash(plain, 10);
  }

  async comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }
}
