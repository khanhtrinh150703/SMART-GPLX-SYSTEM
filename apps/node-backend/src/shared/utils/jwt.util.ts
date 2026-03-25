import jwt from 'jsonwebtoken';
import { env } from 'node:process';
import { TokenPayload } from '../types/auth.types';

/**
 * Tiện ích xử lý JSON Web Token.
 * TUÂN THỦ: Không sử dụng try-catch, để lỗi bubble up lên Global Middleware.
 */
export class JwtUtil {
  private static readonly ACCESS_SECRET = (env.JWT_SECRET as string) || 'access_secret';
  private static readonly REFRESH_SECRET = (env.JWT_REFRESH_SECRET as string) || 'refresh_secret';

  /**
   * Giải mã Access Token. 
   * Nếu token sai, thư viện sẽ tự throw JsonWebTokenError.
   */
  public static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.ACCESS_SECRET) as unknown as TokenPayload;
  }

  /**
   * Tạo chữ ký Access Token.
   * Fix lỗi Overload: Đảm bảo payload là plain object.
   */
  public static signAccessToken(payload: TokenPayload, expiresIn: string | number): string {
    return jwt.sign({ ...payload }, this.ACCESS_SECRET, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
  }

  /**
   * Giải mã Refresh Token.
   */
  public static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as unknown as TokenPayload;
  }

  /**
   * Tạo chữ ký Refresh Token.
   */
  public static signRefreshToken(payload: TokenPayload, expiresIn: string | number): string {
    return jwt.sign({ ...payload }, this.REFRESH_SECRET, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
  }
}