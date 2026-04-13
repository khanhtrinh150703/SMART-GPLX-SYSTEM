import { RequestHandler, Response, NextFunction, Request } from 'express';
import { AuthRequest, TokenPayload } from '@/shared/types/auth.types';
import { AppError } from '@/shared/errors/error-app';
import { ErrorCode } from '@/shared/errors/error-codes';

/**
 * Middleware kiểm tra quyền hạn - Bản 100% Type-safe
 */
export const requirePermission = (permission: string): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // 1. Ép kiểu về AuthRequest để TS nhận diện trường .user
    const authReq = req as AuthRequest;
    
    // 2. Lấy user ra (Lúc này user đã có type là TokenPayload | undefined)
    const user: TokenPayload | undefined = authReq.user;

    // 3. Bảo vệ: Nếu chưa qua authMiddleware hoặc token lỗi
    if (!user) {
      throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);
    }

    // 4. Check quyền (TS sẽ gợi ý cực chuẩn vì đã biết user.permissions là string[])
    const userPermissions: string[] = user.permissions || [];
    
    const hasAccess = 
      userPermissions.includes('admin:all') || 
      userPermissions.includes(permission);

    if (!hasAccess) {
      throw new AppError(ErrorCode.AUTH.FORBIDDEN); 
    }

    next();
  };
};