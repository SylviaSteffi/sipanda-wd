export class GetAllPengajuanUseCase {
  constructor(pengajuanRepository) {
    this.pengajuanRepository = pengajuanRepository;
  }

  async execute(query) {
    return await this.pengajuanRepository.findAll(query);
  }
}
