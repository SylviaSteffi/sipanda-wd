export class UserNotFoundException extends Error {
  constructor() {
    super("User tidak ditemukan!");
    this.statusCode = 404;
  }
}

export class UserAlreadyExistsException extends Error {
  constructor() {
    super("User dengan email tersebut sudah terdaftar!");
    this.statusCode = 409;
  }
}
