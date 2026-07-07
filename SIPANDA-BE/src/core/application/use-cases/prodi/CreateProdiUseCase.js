import { ProdiAlreadyExistsException } from "../../../domain/exceptions/Prodi.js";

export class CreateProdiUseCase {
  constructor(repository) {
    this.prodiRepository = repository;
  }

  async execute(dto) {
    const { kode_prodi } = dto;
    const prodi = await this.prodiRepository.findOneByKode(kode_prodi);
    if (prodi) throw new ProdiAlreadyExistsException();

    return await this.prodiRepository.create(dto);
  }
}
