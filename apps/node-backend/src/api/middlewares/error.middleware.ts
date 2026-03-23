import { Request, Response, NextFunction } from 'express';
import { Result } from '../../shared/utils/response';
import { ErrorCode, AppError, ErrorStatus, ErrorMessages } from '@/shared/errors';

export const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // 1. Trường hợp lỗi đã được định nghĩa (AppError)
  if (err instanceof AppError) {
    // Trả về đúng mã HTTP, Mã lỗi (String) và Message đã map sẵn
    return Result.send(res, err.statusCode, err.errorCode, err.message);
  }

  // 2. Trường hợp lỗi chưa biết (Ví dụ: Lỗi code, lỗi DB, lỗi Logic Runtime)
  // Luôn log lỗi ra console để dev dễ debug
  console.error('ERROR 💥:', err);

  // Lấy thông tin mặc định cho lỗi hệ thống từ các file Map
  const systemErrorCode = ErrorCode.SYSTEM.INTERNAL_ERROR;
  const systemStatus = ErrorStatus[systemErrorCode] || 500;
  const systemMessage = ErrorMessages[systemErrorCode] || 'Lỗi hệ thống, vui lòng thử lại sau';

  return Result.send(
    res, 
    systemStatus, 
    systemErrorCode, 
    systemMessage
  );
};