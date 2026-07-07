export class ProdiEntity {
  constructor({ prodi_id, fakultas_id, fakultas, kode_prodi, nama_prodi, jenjang }) {
    this.id = prodi_id;
    this.fakultas_id = fakultas_id;
    this.fakultas = fakultas;
    this.kode_prodi = kode_prodi;
    this.nama_prodi = nama_prodi;
    this.jenjang = jenjang;
  }
}
