// shared/errors/app-error.ts

import { ErrorCodeType } from './error-codes';
import { ErrorStatus } from './error-status';
import { ErrorMessages } from './messages/error-messages-vn';

/**
 * @description Lớp xử lý lỗi tập trung của hệ thống (Dịch: Centralized App Error)
 * Hỗ trợ lưu lại lỗi gốc (raw error) thông qua thuộc tính 'cause'.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCodeType;
  public readonly cause?: unknown; // Dùng unknown để thay thế any

  constructor(errorCode: ErrorCodeType, cause?: unknown) {
    // 1. Lấy thông báo lỗi thân thiện với người dùng
    const message = ErrorMessages[errorCode] || 'An unexpected error occurred';
    
    // Gọi super và truyền cause theo chuẩn ES2022
    super(message);

    this.errorCode = errorCode;
    this.cause = cause;
    
    // 2. Tự động lấy HTTP Status Code
    this.statusCode = ErrorStatus[errorCode] || 500;

    // Đảm bảo prototype chain hoạt động đúng (cho instanceof)
    Object.setPrototypeOf(this, AppError.prototype);
    
    // Lưu lại Stack Trace để debug
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}