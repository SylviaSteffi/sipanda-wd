export class GetAllAkademikUseCase {
  constructor(akademikRepository) {
    this.akademikRepository = akademikRepository;
  }

  async execute() {
    return await this.akademikRepository.findAll();
  }
}
