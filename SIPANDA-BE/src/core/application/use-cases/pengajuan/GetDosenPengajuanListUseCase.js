import { ValidationError } from "../../../../shared/errors/AppError.js";

class GetDosenPengajuanListUseCase {
  constructor({ pengajuanRepository }) {
    this.pengajuanRepository = pengajuanRepository;
  }

  async execute({ userId, filter = {} }) {
    const normalizedUserId = String(userId || "").trim();

    if (!normalizedUserId) {
      throw ValidationError("ID pengguna wajib diisi.");
    }

    const items = await this.pengajuanRepository.findByUserId(
      normalizedUserId,
      {
        status: filter.status || null,
        tahap: filter.tahap || null,
        kategori: filter.kategori || null,
        akademikId: filter.akademikId || null,
        keyword: filter.keyword || null,
      },
    );

    return items.map((item) => item);
  }
}

export default GetDosenPengajuanListUseCase;
