export class JwtServicePort {
  signToken(payload) {
    throw new Error("Not implemented");
  }
  verifyToken(token) {
    throw new Error("Not implemented");
  }
  hashPassword(plain) {
    throw new Error("Not implemented");
  }
  comparePassword(plain, hash) {
    throw new Error("Not implemented");
  }
}
