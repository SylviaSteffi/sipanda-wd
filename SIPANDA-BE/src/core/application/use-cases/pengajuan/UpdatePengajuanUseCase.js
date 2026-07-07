import { PengajuanNotFoundException } from "../../../domain/exceptions/Pengajuan.js";

export class UpdatePengajuanUseCase {
  constructor({ pengajuanRepository, dokumenRepository, dokumenService }) {
    this.pengajuanRepository = pengajuanRepository;
    this.dokumenRepository = dokumenRepository;
    this.dokumenService = dokumenService;
  }

  async execute({ id, dto, updatedById }) {
    const existingPengajuan = await this.pengajuanRepository.findOne(id);
    if (!existingPengajuan) throw new PengajuanNotFoundException();

    const data = await this.pengajuanRepository.update(id, dto, updatedById);

    const preparedDokumen = this.dokumenService.validateAndPrepare(
      [].concat(dto.dokumen || []),
    );

    const dokumen = await this.dokumenRepository.bulkCreateForPengajuan(
      existingPengajuan.id,
      preparedDokumen,
    );

    return { ...data, dokumen };
  }
}
