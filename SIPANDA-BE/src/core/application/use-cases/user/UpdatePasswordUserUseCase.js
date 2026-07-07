import { UserNotFoundException } from "../../../domain/exceptions/User.js";
import { PasswordHasher } from "../../../../shared/utils/hasher.js";

export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto) {
    const { id, new_password, old_password } = dto;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) throw new UserNotFoundException();

    // Check if the old password is correct
    const isPasswordValid = await PasswordHasher.check(
      old_password,
      existingUser.password_hash,
    );
    if (!isPasswordValid) throw new Error("Old password is incorrect");

    const newHashedPassword = await PasswordHasher.hash(new_password);

    return await this.userRepository.update(id, {
      password_hash: newHashedPassword,
    });
  }
}
