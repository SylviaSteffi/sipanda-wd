import { PengajuanNotFoundException } from "../../../domain/exceptions/Pengajuan.js";

export class GetPengajuanUseCase {
  constructor(pengajuanRepository) {
    this.pengajuanRepository = pengajuanRepository;
  }

  async execute({ id }) {
    const pengajuan = await this.pengajuanRepository.findOne(id);
    if (!pengajuan) throw new PengajuanNotFoundException();
    return pengajuan;
  }
}
