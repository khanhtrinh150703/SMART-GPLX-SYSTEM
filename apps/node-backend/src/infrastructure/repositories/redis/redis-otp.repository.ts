import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';
import { IOtpRepository } from '@/domain/interfaces/repositories/i-otp.repository';
// Giả sử bạn dùng thư viện ioredis hoặc node-redis v4+
import { redisClient } from '@/infrastructure/database/redis/redis.client';


/**
 * Lớp thực thi giao tiếp với Redis để quản lý mã xác thực OTP.
 */
export class RedisOtpRepository implements IOtpRepository {

  /**
   * Helper: Tạo key cho OTP
   */
  private getOtpKey(email: string): string {
    return `${REDIS_CONSTANTS.OTP_PREFIX}${email}`;
  }

  /**
   * Helper: Tạo key cho Resend Lock
   */
  private getLockKey(email: string): string {
    // Nên có thêm prefix LOCK trong constants, ví dụ: 'otp_lock:'
    return `${REDIS_CONSTANTS.OTP_LOCK_PREFIX}${email}`;
  }

  public async saveOtp(email: string, otpCode: string, ttlSeconds: number): Promise<void> {
    const key = this.getOtpKey(email);
    // Sử dụng set với tham số EX để thống nhất với các hàm khác
    await redisClient.set(key, otpCode, 'EX', ttlSeconds);
  }

  public async getOtp(email: string): Promise<string | null> {
    const key = this.getOtpKey(email);
    return await redisClient.get(key);
  }

  public async deleteOtp(email: string): Promise<void> {
    const key = this.getOtpKey(email);
    await redisClient.del(key);
  }

  public async setResendLock(email: string, ttlSeconds: number): Promise<void> {
    const key = this.getLockKey(email);
    // Giá trị '1' đại diện cho việc đang bị khóa
    await redisClient.set(key, '1', 'EX', ttlSeconds);
  }

  public async isResendLocked(email: string): Promise<boolean> {
    const key = this.getLockKey(email);
    const exists = await redisClient.exists(key);
    return exists === 1;
  }
}