import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/types/auth.types';
import { AppError } from '@/shared/errors/error-app';
import { ErrorCode } from '@/shared/errors/error-codes';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { UserRole } from '@/domain/constants/roles.constant';

/**
 * @description Middleware phân quyền người dùng dựa trên danh sách Role cho phép.
 * @param {...UserRole[]} allowedRoles - Danh sách các quyền được phép truy cập API này.
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return catchAsync(async (req: AuthRequest, _: Response, next: NextFunction) => {
    // 1. Kiểm tra xem user đã qua bước authMiddleware chưa
    if (!req.user) {
      throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);
    } 

    // 1. Logic kiểm tra (Dùng .some để quét mảng)
    const userRoles = req.user?.roles || [];
    const hasRole = userRoles.some((role: UserRole) => allowedRoles.includes(role));


    // 2. Xử lý khi không có quyền truy cập
    if (!hasRole) {
      throw new AppError(ErrorCode.AUTH.FORBIDDEN);
    }
    next();
  });
};