export class GetAllFakultasUseCase {
  constructor(repository) {
    this.fakultasRepository = repository;
  }

  async execute() {
    return await this.fakultasRepository.findAll();
  }
}
