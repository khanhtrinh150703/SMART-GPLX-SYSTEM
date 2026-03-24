import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';
import { IOtpRepository } from '@/domain/interfaces/repositories/i-otp.repository';
import { redisClient } from '@/infrastructure/database/redis/redis.client';

/**
 * Lớp thực thi giao tiếp với Redis để quản lý mã xác thực OTP.
 */
export class RedisOtpRepository implements IOtpRepository {
  
  /**
   * Tác dụng: Lưu mã OTP vào Redis kèm thời gian hết hạn (TTL).
   * @param {string} email - Email của người dùng (dùng làm định danh).
   * @param {string} otpCode - Mã OTP (ví dụ: '123456').
   * @param {number} ttlSeconds - Thời gian sống của OTP (tính bằng giây).
   * @returns {Promise<void>}
   */
  public async saveOtp(email: string, otpCode: string, ttlSeconds: number): Promise<void> {
    const redisKey = `${REDIS_CONSTANTS.OTP_PREFIX}${email}`;
    
    // Lưu ý: setEx dùng cho redis v4, tự động hủy key sau ttlSeconds
    await redisClient.setex(redisKey, ttlSeconds, otpCode);
  }

  /**
   * Tác dụng: Lấy mã OTP từ Redis để đối chiếu khi người dùng nhập vào.
   * @param {string} email - Email của người dùng.
   * @returns {Promise<string | null>} - Trả về mã OTP hoặc null nếu không tồn tại/đã hết hạn.
   */
  public async getOtp(email: string): Promise<string | null> {
    const redisKey = `${REDIS_CONSTANTS.OTP_PREFIX}${email}`;
    return await redisClient.get(redisKey);
  }

  /**
   * Tác dụng: Xóa mã OTP khỏi Redis (thường gọi ngay sau khi xác thực thành công để tránh dùng lại).
   * @param {string} email - Email của người dùng.
   * @returns {Promise<void>}
   */
  public async deleteOtp(email: string): Promise<void> {
    const redisKey = `${REDIS_CONSTANTS.OTP_PREFIX}${email}`;
    await redisClient.del(redisKey);
  }
}