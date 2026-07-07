import { FakultasAlreadyExistsException } from "../../../domain/exceptions/Fakultas.js";

export class CreateFakultasUseCase {
  constructor(repository) {
    this.fakultasRepository = repository;
  }

  async execute(dto) {
    const { kode_fakultas } = dto;
    const existing = await this.fakultasRepository.findOneByKode(kode_fakultas);
    if (existing) throw new FakultasAlreadyExistsException();

    return await this.fakultasRepository.create(dto);
  }
}
