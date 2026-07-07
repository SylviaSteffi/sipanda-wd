import { PasswordHasher } from "../../../../shared/utils/hasher.js";
import { UserAlreadyExistsException } from "../../../domain/exceptions/User.js";
import User from "../../../../adapters/secondary/orm/User.js";

export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto) {
    const { email, password, ...otherDto } = dto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new UserAlreadyExistsException();

    // Hash the password
    const hashedPassword = await PasswordHasher.hash(password);
    const existingDeleted = await User.findOne({
      where: {
        email: email,
        is_deleted: 1,
      },
    });
    if (existingDeleted) {
      return await this.userRepository.update(
        existingDeleted.id,
        {
          ...existingDeleted,
          is_deleted: 0,
          password_hash: hashedPassword,
        },
        true,
      );
    }

    return await this.userRepository.create({
      ...otherDto,
      email: email,
      password_hash: hashedPassword,
    });
  }
}
