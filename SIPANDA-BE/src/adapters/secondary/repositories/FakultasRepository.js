import { FakultasEntity } from "../../../core/domain/entities/Fakultas.js";
import { Fakultas } from "../orm/index.js";
import { FakultasRepositoryPort } from "../../../core/application/ports/FakultasRepositoryPort.js";

export class FakultasRepository extends FakultasRepositoryPort {
  #toEntity(record) {
    if (!record) return null;
    return new FakultasEntity(record);
  }

  async findAll() {
    const records = await Fakultas.findAll({
      order: [["nama_fakultas", "ASC"]],
    });
    return records.map((r) => this.#toEntity(r.toJSON()));
  }

  async findOne(id) {
    const record = await Fakultas.findOne({ where: { fakultas_id: id } });
    return this.#toEntity(record);
  }

  async findOneByKode(kode) {
    const record = await Fakultas.findOne({ where: { kode_fakultas: kode } });
    return this.#toEntity(record);
  }

  async create(dto) {
    const record = await Fakultas.create(dto);
    return this.#toEntity(record);
  }

  async update(id, dto) {
    const record = await Fakultas.findByPk(id);
    if (!record) return null;
    await record.update(dto);
    return this.#toEntity(record);
  }

  async remove(id) {
    const record = await Fakultas.findByPk(id);
    if (!record) return null;
    const deletedRows = await record.destroy();

    return deletedRows > 0;
  }
}
