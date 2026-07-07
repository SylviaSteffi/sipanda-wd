import { AkademikAlreadyExistsException } from "../../../domain/exceptions/Akademik.js";

export class CreateAkademikUseCase {
  constructor(akademikRepository) {
    this.akademikRepository = akademikRepository;
  }

  async execute({ kode_akademik, nama_akademik }) {
    const existing = await this.akademikRepository.findByKode(kode_akademik);
    if (existing) throw new AkademikAlreadyExistsException();

    return await this.akademikRepository.create({
      kode_akademik,
      nama_akademik,
      is_aktif: 0,
    });
  }
}
