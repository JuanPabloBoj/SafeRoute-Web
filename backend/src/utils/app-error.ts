export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational = true;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Solicitud inválida.', details?: unknown): AppError {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = 'No autenticado o sesión expirada.'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = 'No tienes permiso para realizar esta acción.'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message = 'Recurso no encontrado.'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message = 'El recurso ya existe o está en conflicto.'): AppError {
    return new AppError(message, 409);
  }
}
