export class AkademikEntity {
  constructor({ akademik_id, kode_akademik, nama_akademik, is_aktif }) {
    this.id = akademik_id;
    this.kode_akademik = kode_akademik;
    this.nama_akademik = nama_akademik;
    this.is_aktif = is_aktif;
  }

  isActive() {
    return this.is_aktif === 1;
  }
}
