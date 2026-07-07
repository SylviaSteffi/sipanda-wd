export class KlarifikasiEntity {
  constructor({
    id,
    pengajuan_id,
    pengajuan,
    pesan_admin,
    pesan_dosen,
    waktu_minta,
    waktu_jawab,
    status_klarifikasi,
  }) {
    this.id = id;
    this.pengajuan_id = pengajuan_id;
    this.pengajuan = pengajuan;
    this.pesan_admin = pesan_admin;
    this.pesan_dosen = pesan_dosen;
    this.waktu_minta = waktu_minta;
    this.waktu_jawab = waktu_jawab;
    this.status_klarifikasi = status_klarifikasi;
  }
}
