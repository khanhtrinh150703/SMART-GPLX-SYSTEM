import { Response, NextFunction } from 'express';
import { catchAsync } from '@/shared/utils/catch-async';
import { AuthRequest, TokenPayload } from '@/shared/types/auth.types';
import { AppError } from '@/shared/errors/error-app';
import { ErrorCode } from '@/shared/errors/error-codes';
import { jwtUtil } from '@/shared/utils/jwt.util';

/**
 * Tác dụng: Xác thực Token và gán Payload vào Request.
 */
export const authMiddleware = catchAsync(async (req: AuthRequest, _: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);

  // Giả sử hàm verify trả về decoded data
  const decoded = jwtUtil.verifyAccessToken(token);

  // Đúc dữ liệu vào class TokenPayload của bạn
  req.user = new TokenPayload({
    userId: decoded.userId,
    role: decoded.role
  });

  next();
});