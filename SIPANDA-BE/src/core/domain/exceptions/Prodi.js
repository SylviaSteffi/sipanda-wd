export class ProdiNotFoundException extends Error {
  constructor() {
    super("Prodi tidak ditemukan!");
    this.statusCode = 404;
  }
}

export class ProdiAlreadyExistsException extends Error {
  constructor() {
    super("Prodi dengan kode tersebut sudah terdaftar!");
    this.statusCode = 409;
  }
}
