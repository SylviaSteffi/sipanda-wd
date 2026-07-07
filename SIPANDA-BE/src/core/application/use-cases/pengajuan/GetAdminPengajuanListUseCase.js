class GetAdminPengajuanListUseCase {
  constructor({ pengajuanRepository }) {
    this.pengajuanRepository = pengajuanRepository;
  }

  async execute(filter = {}) {
    const items = await this.pengajuanRepository.findAll({
      status: filter.status || null,
      tahap: filter.tahap || null,
      kategori: filter.kategori || null,
      akademikId: filter.akademikId || null,
      keyword: filter.keyword || null,
    });

    return items.map((item) => item);
  }
}

export default GetAdminPengajuanListUseCase;
