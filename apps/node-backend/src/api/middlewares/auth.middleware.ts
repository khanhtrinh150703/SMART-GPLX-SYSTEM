import { Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { AuthRequest } from '@/shared/types/auth.types';
import { AppError } from '@/shared/errors/error-app';
import { ErrorCode } from '@/shared/errors/error-codes';
import { jwtUtil } from '@/shared/utils/jwt.util';
import { container } from '@/shared/utils/container';
import { RedisTokenRepository } from '@/infrastructure/repositories/redis/redis-token.repository';
import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';

/**
 * Middleware xác thực người dùng và kiểm tra Session (JTI) trong Redis.
 */
export const authMiddleware = catchAsync(async (req: AuthRequest, _: Response, next: NextFunction) => {
  // 1. Lấy token từ Header
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);
  }

  try {
    // 2. Kiểm tra chữ ký và giải mã Token
    // Payload sẽ chứa: { userId, role, jti, deviceId... }
    const payload = jwtUtil.verifyAccessToken(token);

    // 3. Kiểm tra JTI trong Redis (Session Validation)
    // Lấy tokenRepository từ DI Container gắn kèm trong Request
    const tokenRepo = container.resolve('tokenRepository') as RedisTokenRepository;

    const deviceId = payload.deviceId || 'default';
    const redisKey = `${REDIS_CONSTANTS.ACCESS_TOKEN_PREFIX}${payload.userId}:${deviceId}:${payload.jti}`;

    // Kiểm tra xem Key này có còn tồn tại trong Redis không
    const isValidSession = await tokenRepo.exists(redisKey);
    
    if (!isValidSession) {
      // Nếu không tìm thấy JTI = Token đã bị thu hồi (Logout hoặc bị Force Logout)
      throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);
    }

    // 4. Mọi thứ OK, gán Payload vào Request để các Controller/Service sử dụng
    req.user = payload;
    
    next();
  } catch (err: unknown) {
    // 🛡️ Xử lý lỗi Token cụ thể để trả về mã lỗi chính xác cho Frontend
    if (err instanceof TokenExpiredError) {
      throw new AppError(ErrorCode.AUTH.TOKEN_EXPIRED);
    }

    if (err instanceof JsonWebTokenError) {
      throw new AppError(ErrorCode.AUTH.INVALID_TOKEN);
    }

    // Nếu là AppError (như UNAUTHORIZED ở trên), ném tiếp
    if (err instanceof AppError) {
      throw err;
    }

    // Lỗi hệ thống bất ngờ
    throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);
  }
});

