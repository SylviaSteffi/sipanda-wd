import { ProdiNotFoundException } from "../../../domain/exceptions/Prodi.js";

export class UpdateProdiUseCase {
  constructor(repository) {
    this.prodiRepository = repository;
  }

  async execute(dto) {
    const { id } = dto;
    const existing = await this.prodiRepository.findOne(id);
    if (!existing) throw new ProdiNotFoundException();

    return await this.prodiRepository.update(id, dto);
  }
}
