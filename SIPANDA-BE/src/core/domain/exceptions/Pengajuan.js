export class PengajuanNotFoundException extends Error {
  constructor() {
    super("Pengajuan tidak ditemukan!");
    this.statusCode = 404;
  }
}

export class PengajuanAlreadyExistsException extends Error {
  constructor() {
    super("Pengajuan dengan kode tersebut sudah terdaftar!");
    this.statusCode = 409;
  }
}
