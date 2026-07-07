// "delete" for a lookup table = deactivate, not hard delete
// because Pengajuan references akademik_id

import { AkademikNotFoundException } from "../../../domain/exceptions/Akademik.js";

export class DeactivateAkademikUseCase {
  constructor(akademikRepository) {
    this.akademikRepository = akademikRepository;
  }

  async execute({ id }) {
    const existing = await this.akademikRepository.findById(id);
    if (!existing) throw new AkademikNotFoundException();

    await this.akademikRepository.deactivate(id);
    return { message: "Akademik berhasil dinonaktifkan" };
  }
}
