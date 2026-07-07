export class GetAllProdiUseCase {
  constructor(repository) {
    this.prodiRepository = repository;
  }

  async execute() {
    return await this.prodiRepository.findAll();
  }
}
