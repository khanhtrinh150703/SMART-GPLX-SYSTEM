import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/app-error';
import { ErrorCode } from '../../domain/constants/error-codes';
import { ErrorCatalog } from '../../domain/constants/error-catalog';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Nếu là lỗi do mình chủ động throw (AppError)
  if (err instanceof AppError) {
    return res.status(err.httpStatus).json({
      success: false,
      code: err.errorCode,
      statusCode: err.httpStatus,
      message: err.message
    });
  }

  // 2. Nếu là lỗi hệ thống không mong muốn (Crash, DB lỗi...)
  console.error('ERROR 💥:', err); // Log để dev xem
  
  const internalError = ErrorCatalog[ErrorCode.INTERNAL_ERROR];
  return res.status(500).json({
    success: false,
    code: ErrorCode.INTERNAL_ERROR,
    statusCode: 500,
    message: internalError.message
  });
};