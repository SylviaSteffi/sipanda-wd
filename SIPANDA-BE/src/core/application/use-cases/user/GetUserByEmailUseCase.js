import { UserNotFoundException } from "../../../domain/exceptions/User.js";

export class GetUserByEmailUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
