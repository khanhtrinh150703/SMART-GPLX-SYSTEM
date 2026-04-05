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

    // 1. Ký Token
    const accessToken = jwtUtil.signAccessToken(payload, JWT_CONSTANTS.ACCESS_TOKEN_EXPIRE);
    const refreshToken = jwtUtil.signRefreshToken(payload, JWT_CONSTANTS.REFRESH_TOKEN_EXPIRE);

    // 2. Định nghĩa 2 loại Key
    const deviceId = payload.deviceId || 'default';
    const accessKey = `${REDIS_CONSTANTS.ACCESS_TOKEN_PREFIX}${payload.userId}:${deviceId}:${jti}`;
    const refreshKey = `${REDIS_CONSTANTS.REFRESH_TOKEN_PREFIX}${payload.userId}:${deviceId}:${jti}`;

    // 3. Lưu vào Redis với TTL tương ứng
    // Access Token: 15 phút (900s)
    // Refresh Token: 7 ngày hoặc 30 ngày (Ví dụ: 604800s)
    await Promise.all([
      this._tokenRepo.save(accessKey, 'valid', TIME_CONSTANTS.ACCESS_TOKEN_EXPIRE),
      this._tokenRepo.save(refreshKey, 'valid', TIME_CONSTANTS.REFRESH_TOKEN_EXPIRE)
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  /**
   * Tác dụng: Thu hồi TOÀN BỘ Token (Access & Refresh) của một người dùng trên MỌI thiết bị.
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<void>}
   */
  public async revokeTokenByPattern(userId: string): Promise<void> {
    // Pattern này sẽ khớp với:
    // auth:access:userId:...
    // auth:refresh:userId:...
    const pattern = `auth:*:${userId}:*`;

    // Xóa tất cả các key khớp với pattern để "đăng xuất từ xa" toàn bộ
    await this._tokenRepo.deleteByPattern(pattern);
  }

  /**
   * Tác dụng: Thu hồi cặp Token hiện tại dựa trên Payload (thường dùng cho Logout).
   * @param {TokenPayload} payload - Chứa userId, jti, deviceId.
   * @returns {Promise<void>}
   */
  public async revokeTokenByPayLoad(payload: TokenPayload): Promise<void> {
    const deviceId = payload.deviceId || 'default';

    // Dựng lại chính xác 2 Key đã lưu lúc generate
    const accessKey = `${REDIS_CONSTANTS.ACCESS_TOKEN_PREFIX}${payload.userId}:${deviceId}:${payload.jti}`;
    const refreshKey = `${REDIS_CONSTANTS.REFRESH_TOKEN_PREFIX}${payload.userId}:${deviceId}:${payload.jti}`;

    // Gọi Repo xóa cả 2 cùng lúc
    await Promise.all([
      this._tokenRepo.delete(accessKey),
      this._tokenRepo.delete(refreshKey)
    ]);
  }


  /**
   * Tác dụng: Kiểm tra trạng thái tồn tại của Token Key trong Redis.
   */
  public async exists(key: string): Promise<boolean> {
    // Gọi Repo để check lệnh EXISTS của Redis
    return await this._tokenRepo.exists(key);
  }
}