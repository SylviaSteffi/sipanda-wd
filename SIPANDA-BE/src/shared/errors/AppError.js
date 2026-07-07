class AppError extends Error {
  constructor({
    name = "APP_ERROR",
    message = "Terjadi kesalahan pada aplikasi.",
    statusCode = 500,
    details = null,
  }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function ValidationError(
  message = "Data yang dikirim tidak valid.",
  details = null,
) {
  return new AppError({
    name: "VALIDATION_ERROR",
    message,
    statusCode: 400,
    details,
  });
}

export function UnauthorizedError(
  message = "Anda belum terautentikasi.",
  details = null,
) {
  return new AppError({
    name: "UNAUTHORIZED",
    message,
    statusCode: 401,
    details,
  });
}

export function ForbiddenError(
  message = "Anda tidak memiliki akses untuk melakukan tindakan ini.",
  details = null,
) {
  return new AppError({
    name: "FORBIDDEN",
    message,
    statusCode: 403,
    details,
  });
}

export function NotFoundError(
  message = "Data yang diminta tidak ditemukan.",
  details = null,
) {
  return new AppError({
    name: "NOT_FOUND",
    message,
    statusCode: 404,
    details,
  });
}

export function ConflictError(
  message = "Terjadi konflik data atau proses.",
  details = null,
) {
  return new AppError({
    name: "CONFLICT",
    message,
    statusCode: 409,
    details,
  });
}

export default AppError;