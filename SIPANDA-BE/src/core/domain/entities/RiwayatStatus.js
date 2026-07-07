export class RiwayatStatusEntity {
  constructor({
    riwayat_status_id,
    pengajuan_id,
    pengajuan,
    user_id,
    user,
    status_lama,
    status_baru,
    keterangan,
  }) {
    this.id = riwayat_status_id;
    this.pengajuan_id = pengajuan_id;
    this.pengajuan = pengajuan;
    this.user_id = user_id;
    this.user = user;
    this.status_lama = status_lama;
    this.status_baru = status_baru;
    this.keterangan = keterangan;
  }
}
