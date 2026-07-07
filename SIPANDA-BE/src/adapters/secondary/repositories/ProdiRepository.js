import { ProdiEntity } from "../../../core/domain/entities/Prodi.js";
import { Prodi } from "../orm/index.js";
import { ProdiRepositoryPort } from "../../../core/application/ports/ProdiRepositoryPort.js";

export class ProdiRepository extends ProdiRepositoryPort {
  #toEntity(record) {
    if (!record) return null;
    return new ProdiEntity(record);
  }

  async findAll() {
    const records = await Prodi.findAll({
      order: [["nama_prodi", "ASC"]],
    });
    return records.map((r) => this.#toEntity(r.toJSON()));
  }

  async findOne(id) {
    const record = await Prodi.findOne({ where: { prodi_id: id } });
    return this.#toEntity(record);
  }

  async findOneByKode(kode) {
    const record = await Prodi.findOne({ where: { kode_prodi: kode } });
    return this.#toEntity(record);
  }

  async create(dto) {
    const record = await Prodi.create(dto);
    return this.#toEntity(record);
  }

  async update(id, dto) {
    const record = await Prodi.findByPk(id);
    if (!record) return null;
    await record.update(dto);
    return this.#toEntity(record);
  }

  async remove(id) {
    const record = await Prodi.findByPk(id);
    if (!record) return null;
    await record.destroy();
  }
}
