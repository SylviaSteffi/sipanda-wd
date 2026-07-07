export class UserEntity {
  constructor({
    user_id,
    nama,
    email,
    password_hash,
    role,
    nidn,
    jabatan,
    fakultas_id,
    fakultas,
    prodi_id,
    prodi,
    no_hp,
    is_deleted,
  }) {
    this.id = user_id;
    this.nama = nama;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.nidn = nidn;
    this.jabatan = jabatan;
    this.fakultas_id = fakultas_id;
    this.fakultas = fakultas;
    this.prodi_id = prodi_id;
    this.prodi = prodi;
    this.no_hp = no_hp;
    this.is_deleted = is_deleted;
  }

  isActive() {
    return this.is_deleted === 0;
  }

  toPublic() {
    const { password_hash, ...rest } = this;
    return rest;
  }
}
