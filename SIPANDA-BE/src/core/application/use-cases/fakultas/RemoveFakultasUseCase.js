import { FakultasNotFoundException } from "../../../domain/exceptions/Fakultas.js";

export class RemoveFakultasUseCase {
  constructor(repository) {
    this.fakultasRepository = repository;
  }

  async execute(dto) {
    const { id } = dto;
    const existing = await this.fakultasRepository.findOne(id);
    if (!existing) throw new FakultasNotFoundException();

    await this.fakultasRepository.remove(id);
    return { message: "Fakultas berhasil dihapus!" };
  }
}
