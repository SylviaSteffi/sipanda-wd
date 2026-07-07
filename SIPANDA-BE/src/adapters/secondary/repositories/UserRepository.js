import { UserRepositoryPort } from "../../../core/application/ports/UserRepositoryPort.js";
import { UserEntity } from "../../../core/domain/entities/User.js";
import { Fakultas, Prodi, User } from "../orm/index.js";

export class UserRepository extends UserRepositoryPort {
  #toEntity(record) {
    if (!record) return null;
    const data = record?.dataValues ?? record;
    return new UserEntity({
      ...data,
      fakultas: data.fakultas?.nama_fakultas ?? data.fakultas ?? null,
      prodi: data.prodi?.nama_prodi ?? data.prodi ?? null,
    });
  }

  async findAll() {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] },
      order: [["nama", "ASC"]],
      include: [
        {
          model: Fakultas,
          as: "fakultas",
          attributes: ["fakultas_id", "nama_fakultas"],
        },
        { model: Prodi, as: "prodi", attributes: ["prodi_id", "nama_prodi"] },
      ],
    });
    return users.map((r) => this.#toEntity(r));
  }

  async findByEmail(email, withPassword) {
    const user = await User.findOne({
      where: {
        email: email,
      },
      ...(withPassword
        ? {}
        : {
            attributes: { exclude: ["password_hash"] },
          }),
      include: [
        { model: Fakultas, as: "fakultas" },
        { model: Prodi, as: "prodi" },
      ],
    });

    return this.#toEntity(user);
  }

  async findById(id, withPassword) {
    const user = await User.findOne({
      where: {
        user_id: id,
      },
      ...(withPassword
        ? {}
        : {
            attributes: { exclude: ["password_hash"] },
          }),
      include: [
        { model: Fakultas, as: "fakultas" },
        { model: Prodi, as: "prodi" },
      ],
    });

    return this.#toEntity(user);
  }

  async create(data) {
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
      if (data[key] === null) delete data[key];
      if (typeof data[key] === "string" && data[key].trim() === "")
        delete data[key];
    });
    const user = await User.create({
      ...data,
      user_id: data.id,
    });
    const { password_hash, ...safe } = user?.dataValues;

    return await this.findById(user.user_id);
  }

  async update(id, data, withDeleted) {
    const queryModel = withDeleted ? User.unscoped() : User;

    const user = await queryModel.findByPk(id);
    if (!user) return null;
    // remove empty fields
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
      if (data[key] === null) delete data[key];
      if (typeof data[key] === "string" && data[key].trim() === "")
        delete data[key];
    });

    await user.update({
      ...data,
      prodi_id: data.prodi_id ? data.prodi_id : null,
    });

    return await this.findById(user.user_id);
  }

  async updatePassword(id, password_hash) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update({ password_hash });

    return this.#toEntity(user);
  }

  async remove(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update({ is_deleted: 1 });
  }
}
