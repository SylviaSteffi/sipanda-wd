import { FakultasNotFoundException } from "../../../domain/exceptions/Fakultas.js";

export class GetOneFakultasUseCase {
  constructor(repository) {
    this.fakultasRepository = repository;
  }

  async execute({ id }) {
    const fakultas = await this.fakultasRepository.findOne(id);
    if (!fakultas) throw new FakultasNotFoundException();

    return fakultas;
  }
}
