import { AkademikRepositoryPort } from "../../../core/application/ports/AkademikRepositoryPort.js";
import { AkademikEntity } from "../../../core/domain/entities/Akademik.js";
import { Akademik } from "../orm/index.js";

export class AkademikSequelizeRepository extends AkademikRepositoryPort {
  #toEntity(record) {
    if (!record) return null;
    return new AkademikEntity(record.toJSON());
  }

  async findAll() {
    const records = await Akademik.findAll({
      order: [["nama_akademik", "ASC"]],
    });
    return records.map((r) => this.#toEntity(r));
  }

  async findById(id) {
    const record = await Akademik.findOne({ where: { akademik_id: id } });
    return this.#toEntity(record);
  }

  async findByKode(kode_akademik) {
    const record = await Akademik.findOne({ where: { kode_akademik } });
    return this.#toEntity(record);
  }

  async create(data) {
    const record = await Akademik.create(data);
    return this.#toEntity(record);
  }

  async update(id, data) {
    const akademik = await Akademik.findByPk(id);
    if (!akademik) return null;
    await akademik.update(data);

    return this.#toEntity(akademik);
  }

  async deactivate(id) {
    await Akademik.update({ is_aktif: 0 }, { where: { id } });
  }
}
