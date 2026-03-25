import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';
import { redisClient } from '@/infrastructure/database/redis/redis.client';

/**
 * Lớp thực thi giao tiếp với Redis để quản lý Token (thường là Refresh Token hoặc Token Blacklist).
 */
export class RedisTokenRepository implements ITokenRepository {
  
  /**
   * Tác dụng: Lưu chuỗi Token của người dùng vào Redis.
   * @param {string} userId - ID của người dùng (thường là UUID hoặc số ID).
   * @param {string} token - Chuỗi JWT hoặc mã Token cần lưu.
   * @param {number} ttlSeconds - Thời gian sống của Token (tính bằng giây).
   * @returns {Promise<void>}
   */
  public async saveToken(userId: string, token: string, ttlSeconds: number): Promise<void> {
    const redisKey = `${REDIS_CONSTANTS.TOKEN_PREFIX}${userId}`;
    
    // Lưu ý: Dùng setEx (chữ E viết hoa) đối với thư viện redis v4
    await redisClient.setex(redisKey, ttlSeconds, token);
  }

  /**
   * Tác dụng: Lấy Token của người dùng từ Redis.
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<string | null>} - Trả về chuỗi Token hoặc null nếu không tồn tại.
   */
  public async getToken(userId: string): Promise<string | null> {
    const redisKey = `${REDIS_CONSTANTS.TOKEN_PREFIX}${userId}`;
    return await redisClient.get(redisKey);
  }

  /**
   * Tác dụng: Xóa Token của người dùng khỏi Redis (thường dùng khi Đăng xuất - Logout).
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<void>}
   */
  public async deleteToken(userId: string): Promise<void> {
    const redisKey = `${REDIS_CONSTANTS.TOKEN_PREFIX}${userId}`;
    await redisClient.del(redisKey);
  }
}