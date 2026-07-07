export class AkademikNotFoundException extends Error {
  constructor() {
    super("Akademik tidak ditemukan!");
    this.statusCode = 404;
  }
}

export class AkademikAlreadyExistsException extends Error {
  constructor() {
    super("Akademik dengan kode tersebut sudah terdaftar!");
    this.statusCode = 409;
  }
}
