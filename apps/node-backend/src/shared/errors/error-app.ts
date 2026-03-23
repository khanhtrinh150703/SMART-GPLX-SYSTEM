import { ErrorCodeType } from './error-codes';
import { ErrorStatus } from './error-status';
import { ErrorMessages } from './messages/error-messages-vn';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCodeType;

  constructor(errorCode: ErrorCodeType) {
    // 1. Tự động lấy Message từ file messages
    const message = ErrorMessages[errorCode] || 'An unexpected error occurred';
    super(message);

    this.errorCode = errorCode;
    
    // 2. Tự động lấy StatusCode từ file status
    this.statusCode = ErrorStatus[errorCode] || 500;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}