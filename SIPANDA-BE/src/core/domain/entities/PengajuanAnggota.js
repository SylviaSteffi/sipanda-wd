export class PengajuanAnggotaEntity {
  constructor({ pengajuan_anggota_id, pengajuan_id, pengajuan, user_id, user, urutan, peran }) {
    this.id = pengajuan_anggota_id;
    this.pengajuan_id = pengajuan_id;
    this.pengajuan = pengajuan;
    this.user_id = user_id;
    this.user = user;
    this.urutan = urutan;
    this.peran = peran;
  }
}
