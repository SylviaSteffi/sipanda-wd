import {
  UserNotFoundException,
  InvalidCredentialsException,
} from "../../../domain/exceptions/AuthException.js";

export class ChangePasswordUseCase {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute({ userId, old_password, new_password }) {
    const user = await this.userRepository.findById(userId, true);
    if (!user || !user.isActive()) throw new UserNotFoundException();

    const isMatch = await this.jwtService.comparePassword(
      old_password,
      user.password_hash,
    );
    if (!isMatch) throw new InvalidCredentialsException();

    const password_hash = await this.jwtService.hashPassword(new_password);
    await this.userRepository.updatePassword(userId, password_hash);

    return { message: "Password changed successfully" };
  }
}
