import { FakultasNotFoundException } from "../../../domain/exceptions/Fakultas.js";

export class UpdateFakultasUseCase {
  constructor(repository) {
    this.fakultasRepository = repository;
  }

  async execute(dto) {
    const { id } = dto;
    const existing = await this.fakultasRepository.findOne(id);
    if (!existing) throw new FakultasNotFoundException();

    return await this.fakultasRepository.update(id, dto);
  }
}
