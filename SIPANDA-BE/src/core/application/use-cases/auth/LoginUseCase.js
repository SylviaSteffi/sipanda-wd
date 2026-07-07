import { InvalidCredentialsException } from "../../../domain/exceptions/AuthException.js";

export class LoginUseCase {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email, true);
    if (!user || !user.isActive()) throw new InvalidCredentialsException();

    const isMatch = await this.jwtService.comparePassword(
      password,
      user.password_hash,
    );
    if (!isMatch) throw new InvalidCredentialsException();

    const token = this.jwtService.signToken({
      id: user.id,
      role: user.role,
      jabatan: user.jabatan,
    });

    return { token, user: user.toPublic() };
  }
}
