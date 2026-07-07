export class FakultasNotFoundException extends Error {
  constructor() {
    super("Fakultas tidak ditemukan!");
    this.statusCode = 404;
  }
}

export class FakultasAlreadyExistsException extends Error {
  constructor() {
    super("Fakultas dengan kode tersebut sudah terdaftar!");
    this.statusCode = 409;
  }
}
