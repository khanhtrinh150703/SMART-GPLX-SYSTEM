import { ITokenManager } from '@/domain/interfaces/services/i-token-manager';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';
import { TokenPayload, Tokens } from '@/shared/types/auth.types';
import { jwtUtil } from '@/shared/utils/jwt.util';
import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';
import { JWT_CONSTANTS } from '@/domain/constants/time.constants';

/**
 * Lớp quản lý vòng đời của Token (Tạo và Thu hồi).
 * Phối hợp giữa logic ký JWT (Utility) và lưu trữ (Repository).
 */
export class JwtTokenManager implements ITokenManager {
  /**
   * Tiêm phụ thuộc qua constructor (Dependency Injection).
   * @param {ITokenRepository} tokenRepo - Kho lưu trữ Redis.
   */
  constructor(private readonly tokenRepo: ITokenRepository) {}

  /**
   * Tác dụng: Tạo cặp Access/Refresh Token và lưu vào Redis.
   * @param {TokenPayload} payload - Thông tin người dùng cần mã hóa.
   * @returns {Promise< Tokens = { accessToken: string; refreshToken: string }>}
   */
  public async generateAndStoreTokens(payload: TokenPayload): Promise<Tokens> {

    // 1. Ký Token (Sử dụng Utility đã được fix Zero Any và No Static)
    // Manager không cần truyền Secret vào đây, Utility tự quản lý cấu hình.
    const accessToken = jwtUtil.signAccessToken(payload, JWT_CONSTANTS.ACCESS_TOKEN_EXPIRE);
    const refreshToken = jwtUtil.signRefreshToken(payload, JWT_CONSTANTS.REFRESH_TOKEN_EXPIRE);

    // 2. Định nghĩa Key lưu trữ chuẩn hệ thống
    // Sử dụng Constants để tránh hardcode string prefix
    const deviceId = payload.deviceId || 'default';
    const redisKey = `${REDIS_CONSTANTS.TOKEN_PREFIX}${payload.userId}:${deviceId}`;

    // 3. Lưu Access Token vào kho để quản lý phiên làm việc (15 phút = 900 giây)
    await this.tokenRepo.save(redisKey, accessToken, 900);

    return { 
      accessToken, 
      refreshToken 
    };
  }

  /**
   * Tác dụng: Thu hồi toàn bộ Token của một người dùng trên mọi thiết bị.
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<void>}
   */
  public async revokeToken(userId: string): Promise<void> {
    const pattern = `${REDIS_CONSTANTS.TOKEN_PREFIX}${userId}:*`;
    
    // Gọi Repository thực hiện lệnh SCAN/DEL hàng loạt
    await this.tokenRepo.deleteByPattern(pattern);
  }
}