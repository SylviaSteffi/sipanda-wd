import { UserNotFoundException } from "../../../domain/exceptions/User.js";

export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto) {
    const { id, ...otherDto } = dto;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) throw new UserNotFoundException();

    // Update skip password update

    return await this.userRepository.update(id, {
      ...otherDto,
    });
  }
}
