import { AkademikNotFoundException } from "../../../domain/exceptions/Akademik.js";

export class UpdateAkademikUseCase {
  constructor(akademikRepository) {
    this.akademikRepository = akademikRepository;
  }

  async execute({ id, kode_akademik, nama_akademik, is_aktif }) {
    const existing = await this.akademikRepository.findById(id);
    if (!existing) throw new AkademikNotFoundException();

    return await this.akademikRepository.update(id, {
      kode_akademik,
      nama_akademik,
      is_aktif,
    });
  }
}
