export class InvalidCredentialsException extends Error {
  constructor() {
    super("Invalid credentials");
    this.statusCode = 401;
  }
}

export class EmailAlreadyExistsException extends Error {
  constructor() {
    super("Email already registered");
    this.statusCode = 409;
  }
}

export class UserNotFoundException extends Error {
  constructor() {
    super("User not found");
    this.statusCode = 404;
  }
}

export class UnauthorizedException extends Error {
  constructor(msg = "Unauthorized") {
    super(msg);
    this.statusCode = 401;
  }
}

export class ForbiddenException extends Error {
  constructor(msg = "Forbidden") {
    super(msg);
    this.statusCode = 403;
  }
}
