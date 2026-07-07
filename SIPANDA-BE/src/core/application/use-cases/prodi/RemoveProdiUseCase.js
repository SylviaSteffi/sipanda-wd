import { ProdiNotFoundException } from "../../../domain/exceptions/Prodi.js";

export class RemoveProdiUseCase {
  constructor(repository) {
    this.prodiRepository = repository;
  }

  async execute(dto) {
    const { id } = dto;
    const existing = await this.prodiRepository.findOne(id);
    if (!existing) throw new ProdiNotFoundException();

    await this.prodiRepository.remove(id);
    return { message: "Prodi berhasil dihapus!" };
  }
}
