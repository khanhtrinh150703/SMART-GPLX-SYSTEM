import { ErrorCode } from '../../domain/constants/error-codes';
import { ErrorCatalog } from '../../domain/constants/error-catalog';

export class AppError extends Error {
  public readonly httpStatus: number;
  public readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode) {
    const detail = ErrorCatalog[errorCode];
    super(detail.message);
    this.errorCode = errorCode;
    this.httpStatus = detail.httpStatus;
    Error.captureStackTrace(this, this.constructor);
  }
}