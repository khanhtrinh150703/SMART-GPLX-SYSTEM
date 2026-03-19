import { Response } from 'express';
import { ErrorCode, ErrorCodeType, ErrorStatus, ErrorMessages } from '@/shared/errors';

export interface StandardResponse<T> {
  success: boolean;
  code: string;       
  statusCode: number; 
  message: string;
  data?: T;           
}

export const Result = {
  /**
   * Hàm core để gửi response chuẩn JSON
   */
  send: <T>(
    res: Response, 
    statusCode: number, 
    code: string, 
    message: string, 
    data?: T
  ) => {
    const response: StandardResponse<T> = {
      success: statusCode < 400, 
      code,
      statusCode,
      message,
      data
    };
    return res.status(statusCode).json(response);
  },

  /**
   * Helper gửi response thành công (200 OK)
   */
  ok: <T>(
    res: Response, 
    data?: T, 
    // Mặc định lấy mã SUCCESS từ hệ thống mới
    message?: string,
    code: ErrorCodeType = ErrorCode.SYSTEM.SUCCESS 
  ) => {
    // 1. Lấy status (mặc định 200)
    const status = ErrorStatus[code] || 200;
    
    // 2. Lấy message: Ưu tiên message truyền vào > message map sẵn > chuỗi mặc định
    const finalMessage = message || ErrorMessages[code] || 'Thao tác thành công';

    return Result.send(res, status, code, finalMessage, data);
  }
};