import { ValidationError } from "../../../../shared/errors/AppError.js";

export class ChangeStatusPengajuanUseCase {
  constructor(pengajuanRepository) {
    this.pengajuanRepository = pengajuanRepository;
  }

  allowedStatus = [
    "Diajukan",
    "Dalam_Pemeriksaan",
    "Perlu_Klarifikasi",
    "Disetujui",
    "Ditolak",
    "Selesai",
  ];

  async execute(id, status) {
    if (!this.allowedStatus.includes(status)) {
      throw ValidationError(
        `Status ${status} tidak valid. Status harus salah satu dari: ${this.allowedStatus.join(", ")}`,
      );
    }

    return await this.pengajuanRepository.updateStatus(id, status);
  }
}
