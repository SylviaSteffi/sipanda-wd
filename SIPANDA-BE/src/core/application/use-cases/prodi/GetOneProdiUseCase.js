import { ProdiNotFoundException } from "../../../domain/exceptions/Prodi.js";

export class GetOneProdiUseCase {
  constructor(repository) {
    this.prodiRepository = repository;
  }

  async execute({ id }) {
    const prodi = await this.prodiRepository.findOne(id);
    if (!prodi) throw new ProdiNotFoundException();

    return prodi;
  }
}
