import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../../../shared/errors/AppError.js";

class GetDosenPengajuanDetailUseCase {
  constructor({ pengajuanRepository }) {
    this.pengajuanRepository = pengajuanRepository;
  }

  async execute({ id, userId }) {
    const normalizedUserId = String(userId || "").trim();

    if (!normalizedUserId) {
      throw ValidationError("ID pengguna wajib diisi.");
    }

    const pengajuan = await this.pengajuanRepository.findById(id);

    if (!pengajuan) {
      throw NotFoundError("Data pengajuan tidak ditemukan.");
    }

    if (!pengajuan.canBeAccessedByDosen(normalizedUserId)) {
      throw ForbiddenError("Anda tidak memiliki akses ke pengajuan ini.");
    }

    return pengajuan;
  }
}

export default GetDosenPengajuanDetailUseCase;
