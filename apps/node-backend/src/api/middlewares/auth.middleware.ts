import { Response, NextFunction } from 'express';
import { AuthRequest, TokenPayload } from '../../shared/types/auth.types';
import { JwtUtil } from '../../shared/utils/jwt.util';
import { AppError, ErrorCode } from '@/shared/errors';

export const authMiddleware = (req: AuthRequest, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    console.log(authHeader)
    console.log(token)

    if (!token) throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);

    const decoded = JwtUtil.verifyAccessToken(token);

    // QUAN TRỌNG: Phải gán instance của TokenPayload vào đây
    req.user = new TokenPayload(decoded); 

    next();
  } catch (error) {
    next(error); // Đẩy lỗi ra Error Middleware
  }
};