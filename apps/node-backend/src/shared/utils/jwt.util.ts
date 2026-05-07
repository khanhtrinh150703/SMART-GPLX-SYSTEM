import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { AppError } from '../errors/error-app';
import { ErrorCode } from '../errors/error-codes';
import { env } from 'node:process';
import { TokenPayload } from '@/application/dtos/response/auth/token/token-payload.respone.dto';

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

    const dataToSign = {
      userId: payload.userId,
      roles: payload.roles,
      permissions: payload.permissions,
      jti: payload.jti,
      deviceId: payload.deviceId
    };

    return jwt.sign(dataToSign, secret, {
      expiresIn: expiresIn as SignOptions['expiresIn']
    });
  },


  /** * 🛡️ HÀM LÕI DUY NHẤT ĐỂ CHECK LỖI (VERIFY)
     * Đây là chỗ duy nhất có try-catch để cậu chỉnh sửa!
     */
  private_verify(type: TokenType, token: string): TokenPayload {
    const secret = JWT_CONFIG[type].getSecret();
    if (!secret) throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);

    try {
      // 1. Cố gắng giải mã (Nếu token dị dạng hoặc hết hạn, nó sẽ văng lỗi ngay dòng này)
      const decoded = jwt.verify(token, secret) as JwtPayload;
      // 2. Đúc dữ liệu vào class duy nhất tại đây
      return new TokenPayload({
        userId: decoded.userId,
        roles: decoded.roles || decoded.role || [],
        jti: decoded.jti,
        permissions: decoded.permissions,
        deviceId: decoded.deviceId,
        exp: decoded.exp,
        iat: decoded.iat
      });

    } catch (error) {
      // 3. BẮT LỖI TỪ THƯ VIỆN JWT VÀ ÉP THÀNH LỖI APP ERROR (MÃ 401)
      if (error instanceof jwt.TokenExpiredError) {
        // Lỗi: Token đã hết hạn (Có thể bạn có mã ErrorCode.AUTH.TOKEN_EXPIRED riêng)
        throw new AppError(ErrorCode.AUTH.TOKEN_EXPIRED);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        // Lỗi: Token sai chữ ký, token dị dạng (jwt malformed), token bị sửa đổi...
        throw new AppError(ErrorCode.AUTH.INVALID_TOKEN);
      }

      // Nếu là các lỗi hệ thống khác thì ném ra ngoài bình thường
      throw error;
    }
  },

  // ============================================================
  // CÁC HÀM PUBLIC: Bây giờ chỉ là "vỏ bọc" 1 dòng
  // ============================================================

  signAccessToken: (p: TokenPayload, exp: string | number) => jwtUtil.private_sign('ACCESS', p, exp),
  signRefreshToken: (p: TokenPayload, exp: string | number) => jwtUtil.private_sign('REFRESH', p, exp),

  verifyAccessToken: (token: string) => jwtUtil.private_verify('ACCESS', token),
  verifyRefreshToken: (token: string) => jwtUtil.private_verify('REFRESH', token)
};