import { NotFoundError } from "../../../../shared/errors/AppError.js";

class GetAdminPengajuanDetailUseCase {
  constructor({ pengajuanRepository }) {
    this.pengajuanRepository = pengajuanRepository;
  }

  async execute({ id }) {
    const pengajuan = await this.pengajuanRepository.findById(id);

    if (!pengajuan) {
      throw NotFoundError("Data pengajuan tidak ditemukan.");
    }

    return pengajuan;
  }
}

export default GetAdminPengajuanDetailUseCase;
