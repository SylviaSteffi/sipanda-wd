import { UserNotFoundException } from "../../../domain/exceptions/AuthException.js";

export class GetMeUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId }) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive()) throw new UserNotFoundException();
    return user.toPublic();
  }
}
