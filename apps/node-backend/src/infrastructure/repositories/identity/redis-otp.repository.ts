import { IOtpRepository } from '@/domain/interfaces/repositories/identity/i-otp.repository';
// Giả sử bạn dùng thư viện ioredis hoặc node-redis v4+
import { redisClient } from '@/infrastructure/database/redis/redis.client';
import { REDIS_KEYS } from '@/shared/config/redis.config';


/**
 * Lớp thực thi giao tiếp với Redis để quản lý mã xác thực OTP.
 */
export class RedisOtpRepository implements IOtpRepository {

  /**
   * @description Lấy Key lưu mã OTP.
   * English: Get OTP Key.
   */
  private getOtpKey(email: string): string {
    // Gọi trực tiếp từ cấu trúc REDIS_KEYS đã định nghĩa
    return REDIS_KEYS.AUTH.getOtpKey(email);
  }

  /**
   * @description Hàm hỗ trợ: Tạo key cho việc khóa gửi lại (Resend Lock).
   * English: Helper: Create key for Resend Lock.
   */
  private getLockKey(email: string): string {
    // Đảm bảo tính nhất quán bằng cách dùng chung 1 nguồn logic
    return REDIS_KEYS.AUTH.getResendLockKey(email);
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