import { ITokenManager } from '@/domain/interfaces/external/i-token-manager';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';
import { TokenPayload, Tokens } from '@/shared/types/auth.types';
import { jwtUtil } from '@/shared/utils/jwt.util';
import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';
import { JWT_CONSTANTS, TIME_CONSTANTS } from '@/domain/constants/time.constants';
import { User } from '@/domain/entities/user/user.entity';
import { randomUUID } from 'node:crypto';
import { SystemRoles } from '@/domain/constants/roles.constant';
import { ICradle } from '@/shared/types/container.types';

/**
 * Lớp quản lý vòng đời của Token (Tạo và Thu hồi).
 * Phối hợp giữa logic ký JWT (Utility) và lưu trữ (Repository).
 */
export class JwtTokenManager implements ITokenManager {
  // 1. Khai báo thuộc tính riêng tư của class
  private readonly _tokenRepo: ITokenRepository;

  /**
   * Tiêm phụ thuộc qua constructor (Dependency Injection) bằng Cradle.
   * @param {ICradle} cradle - Object chứa các dependencies từ Container.
   */
  constructor({ tokenRepository }: ICradle) {
    // 2. Gán dependency từ object 'cradle' vào thuộc tính class
    // LƯU Ý: Tên 'tokenRepository' phải khớp 100% với Key trong container.ts
    this._tokenRepo = tokenRepository;
  }

  /**
   * Tác dụng: Tạo cặp Access/Refresh Token và lưu vào Redis.
   * @param {User} user - Thông tin người dùng cần mã hóa.
   * @returns {Promise< Tokens = { accessToken: string; refreshToken: string }>}
   */
  public async generateAndStoreTokens(user: User): Promise<Tokens> {

    const primaryRole = user.roles.length > 0 ? user.roles[0].name : SystemRoles.STUDENT;

    const jti = randomUUID();
    // 2. Chuẩn bị Payload sạch sẽ
    const payload = new TokenPayload({
      userId: user.id,
      role: primaryRole,
      jti: jti,
    });

    // 1. Ký Token (Sử dụng Utility đã được fix Zero Any và No Static)
    // Manager không cần truyền Secret vào đây, Utility tự quản lý cấu hình.
    const accessToken = jwtUtil.signAccessToken(payload, JWT_CONSTANTS.ACCESS_TOKEN_EXPIRE);
    const refreshToken = jwtUtil.signRefreshToken(payload, JWT_CONSTANTS.REFRESH_TOKEN_EXPIRE);
    const ttl = TIME_CONSTANTS.ACCESS_TOKEN_EXPIRE;

    // 2. Định nghĩa Key lưu trữ chuẩn hệ thống
    // Sử dụng Constants để tránh hardcode string prefix
    const deviceId = payload.deviceId || 'default';
    const redisKey = `${REDIS_CONSTANTS.TOKEN_PREFIX}${payload.userId}:${deviceId}:${jti}`;
    // 3. Lưu Access Token vào kho để quản lý phiên làm việc (15 phút = 900 giây)
    await this._tokenRepo.save(redisKey, 'valid', ttl);

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
  public async revokeTokenByPattern(userId: string): Promise<void> {

    const pattern = `${REDIS_CONSTANTS.TOKEN_PREFIX}${userId}:`;
    // 1. Tìm tất cả các key khớp với pattern (ví dụ: auth:token:123:*)
    // Lưu ý: Dùng SCAN thay vì KEYS để không làm treo Redis nếu data lớn
    await this._tokenRepo.deleteByPattern(pattern);

  }
  /**
 * Tác dụng: Thu hồi toàn bộ Token của một người dùng trên mọi thiết bị.
 * @param {string} userId - ID của người dùng.
 * @returns {Promise<void>}
 */
  // Trong TokenManager hoặc AuthService
  public async revokeTokenByPayLoad(payload: TokenPayload): Promise<void> {
    // Phải dựng lại đúng cấu trúc Key lúc nãy
    const deviceId = payload.deviceId || 'default';
    const redisKey = `${REDIS_CONSTANTS.TOKEN_PREFIX}${payload.userId}:${deviceId}:${payload.jti}`;

    // Gọi Repo để xóa
    await this._tokenRepo.delete(redisKey);
  }
}