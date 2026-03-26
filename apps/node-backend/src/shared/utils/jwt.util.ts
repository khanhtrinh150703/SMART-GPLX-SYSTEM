import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '../types/auth.types';
import { AppError } from '../errors/error-app';
import { ErrorCode } from '../errors/error-codes';
import { env } from 'node:process';

/**
 * Utility xử lý JSON Web Token.
 * TUÂN THỦ: Zero Any, No Hardcoded Messages.
 */
export const jwtUtil = {
  /**
   * Tác dụng: Tạo chữ ký Access Token.
   */
  signAccessToken(payload: TokenPayload, expiresIn: string | number): string {
    const secret = env.JWT_ACCESS_SECRET;
    if (!secret) throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);

    // Chuyển Class Instance thành Plain Object sạch để ký
    const plainPayload: Record<string, unknown> = {
      userId: payload.userId,
      role: payload.role
    };

    return jwt.sign(plainPayload, secret, { 
      expiresIn: expiresIn as SignOptions['expiresIn'] 
    });
  },

  /**
   * Tác dụng: Xác thực Access Token.
   */
  verifyAccessToken(token: string): TokenPayload {
    const secret = env.JWT_ACCESS_SECRET;
    if (!secret) throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);

    // jwt.verify trả về string | JwtPayload
    const decoded = jwt.verify(token, secret);

    // Kiểm tra nếu decoded là string (không hợp lệ với cấu trúc ta cần)
    if (typeof decoded === 'string') {
      // throw new AppError(ErrorCode.AUTH.INVALID_TOKEN);
    }

    // Ép kiểu về JwtPayload (Interface của thư viện) để truy cập thuộc tính an toàn
    const payload = decoded as JwtPayload;

    return new TokenPayload({
      userId: payload.userId as string,
      role: payload.role as string
    });
  },

  /**
   * Tác dụng: Tạo chữ ký Refresh Token.
   */
  signRefreshToken(payload: TokenPayload, expiresIn: string | number): string {
    const secret = env.JWT_REFRESH_SECRET;
    if (!secret) throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);

    const plainPayload: Record<string, unknown> = {
      userId: payload.userId,
      role: payload.role
    };

    return jwt.sign(plainPayload, secret, { 
      expiresIn: expiresIn as SignOptions['expiresIn'] 
    });
  },

  /**
   * Tác dụng: Xác thực Refresh Token.
   */
  verifyRefreshToken(token: string): TokenPayload {
    const secret = env.JWT_REFRESH_SECRET;
    if (!secret) throw new AppError(ErrorCode.SYSTEM.CONFIG_ERROR);

    const decoded = jwt.verify(token, secret);

    // if (typeof decoded === 'string') {
    //   throw new AppError(ErrorCode.AUTH.INVALID_TOKEN);
    // }

    const payload = decoded as JwtPayload;

    return new TokenPayload({
      userId: payload.userId as string,
      role: payload.role as string
    });
  }
};