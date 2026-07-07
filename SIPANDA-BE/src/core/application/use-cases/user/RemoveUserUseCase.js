import { UserNotFoundException } from "../../../domain/exceptions/User.js";

export class RemoveUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto) {
    const { id } = dto;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) throw new UserNotFoundException();

    await this.userRepository.remove(id);
    return { message: "User berhasil dihapus!" };
  }
}
