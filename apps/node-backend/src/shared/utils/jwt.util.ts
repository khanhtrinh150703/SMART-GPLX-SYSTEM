import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '../types/auth.types';
import { AppError } from '../errors/error-app';
import { ErrorCode } from '../errors/error-codes';
import { env } from 'node:process';

// 1. TẬP TRUNG CẤU HÌNH: Muốn đổi Secret hay Thời gian thì sửa ở đây
const JWT_CONFIG = {
  ACCESS: {
    getSecret: () => env.JWT_ACCESS_SECRET,
    errorCode: ErrorCode.AUTH.INVALID_TOKEN, // Lỗi mặc định nếu verify hỏng
  },
  REFRESH: {
    getSecret: () => env.JWT_REFRESH_SECRET,
    errorCode: ErrorCode.AUTH.INVALID_TOKEN,
  }
} as const;

type TokenType = keyof typeof JWT_CONFIG;

export const jwtUtil = {
  /** * 🛠️ HÀM LÕI DUY NHẤT ĐỂ KÝ (SIGN)
   * Không còn lặp lại logic tạo Plain Object
   */
  private_sign(type: TokenType, payload: TokenPayload, expiresIn: string | number): string {
    const secret = JWT_CONFIG[type].getSecret();
    if (!secret) throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);

    return jwt.sign({ ...payload }, secret, {
      expiresIn: expiresIn as SignOptions['expiresIn']
    });
  },

  /** * 🛡️ HÀM LÕI DUY NHẤT ĐỂ CHECK LỖI (VERIFY)
   * Đây là chỗ duy nhất có try-catch để cậu chỉnh sửa!
   */
  private_verify(type: TokenType, token: string): TokenPayload {
    const secret = JWT_CONFIG[type].getSecret();
    if (!secret) throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);

    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Đúc dữ liệu vào class duy nhất tại đây
    return new TokenPayload({
      userId: decoded.userId,
      role: decoded.role,
      jti: decoded.jti,
      deviceId: decoded.deviceId,
      exp: decoded.exp,
      iat: decoded.iat
    });

  },

  // ============================================================
  // CÁC HÀM PUBLIC: Bây giờ chỉ là "vỏ bọc" 1 dòng
  // ============================================================

  signAccessToken: (p: TokenPayload, exp: string | number) => jwtUtil.private_sign('ACCESS', p, exp),
  signRefreshToken: (p: TokenPayload, exp: string | number) => jwtUtil.private_sign('REFRESH', p, exp),

  verifyAccessToken: (token: string) => jwtUtil.private_verify('ACCESS', token),
  verifyRefreshToken: (token: string) => jwtUtil.private_verify('REFRESH', token)
};