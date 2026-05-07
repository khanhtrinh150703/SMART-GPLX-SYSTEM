import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ErrorCode, AppError, ErrorStatus, ErrorMessages } from '@/shared/errors';
import multer from 'multer';
import { Result } from '@/application/dtos/response/shared/api.response.dto';

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

/**
 * @description Middleware bọc lỗi Multer dùng chung cho toàn hệ thống.
 * (Dịch: Global Multer error handling wrapper)
 */
export const validateFileSize = (uploadMiddleware: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    uploadMiddleware(req, res, (err: unknown) => {
      // 1. Nếu là lỗi từ Multer
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          // Trả về mã lỗi chung thay vì mã lỗi riêng của Import
          // (Dịch: Return generic size error code)
          return next(new AppError(ErrorCode.SYSTEM.FILE_SIZE_EXCEEDED));
        }
        return next(new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR, err.message));
      }

      // 2. Nếu là lỗi logic khác (ví dụ từ fileFilter)
      if (err instanceof Error) {
        return next(err);
      }

      // 3. Nếu không có lỗi, tiếp tục (Dịch: Proceed if no error)
      next();
    });
  };
};