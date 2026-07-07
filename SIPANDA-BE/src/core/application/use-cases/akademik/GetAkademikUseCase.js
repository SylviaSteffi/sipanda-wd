import { AkademikNotFoundException } from "../../../domain/exceptions/Akademik.js";

export class GetAkademikUseCase {
  constructor(akademikRepository) {
    this.akademikRepository = akademikRepository;
  }

  async execute({ id }) {
    const akademik = await this.akademikRepository.findById(id);
    if (!akademik) throw new AkademikNotFoundException();
    return akademik;
  }
}
