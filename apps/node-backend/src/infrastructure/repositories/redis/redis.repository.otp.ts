import { redisClient } from '@/infrastructure/database/redis.config';
import { IOtpRepository } from "@/domain/interfaces/IOtpRepository";
import { AppError, ErrorCode } from '@/shared/errors';

export class RedisOtpRepository implements IOtpRepository {
  // Quản lý nhãn tập trung để tránh lỗi lệch Key (Centralized Prefix Management)
  private readonly OTP_PREFIX = 'otp:';
  private readonly PENDING_PREFIX = 'pending_user:';

  async saveOtp(email: string, otpCode: string, ttlSeconds: number): Promise<void> {
    await redisClient.setex(`${this.OTP_PREFIX}${email}`, ttlSeconds, otpCode);
  }

  async getOtp(email: string): Promise<string | null> {
    return await redisClient.get(`${this.OTP_PREFIX}${email}`);
  }

  async deleteOtp(email: string): Promise<void> {
    await redisClient.del(`${this.OTP_PREFIX}${email}`);
  }

  async deletePendingData(email: string): Promise<void> {
    const key = `${this.PENDING_PREFIX}${email}`;

    // Thực hiện xóa key trong Redis
    const deletedCount = await redisClient.del(key);

    // Nếu không có key nào bị xóa (nghĩa là dữ liệu không tồn tại hoặc đã hết hạn)
    if (deletedCount === 0) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }
  }

  async savePendingData(email: string, data: string, ttlSeconds: number): Promise<void> {
    await redisClient.setex(`${this.PENDING_PREFIX}${email}`, ttlSeconds, data);
  }

  async getPendingData(email: string): Promise<string | null> {
    const key = `${this.PENDING_PREFIX}${email}`;
    const data = await redisClient.get(key);

    // console.log(`--- [DEBUG] Lấy dữ liệu từ Redis ---`);
    // console.log(`Key: ${key} | Status: ${data ? 'Found' : 'Null'}`);

    return data;
  }

  async exists(key: string): Promise<boolean> {
    const result = await redisClient.exists(key);
    return result === 1;
  }

  // Chỉ làm nhiệm vụ: "Ghi dữ liệu vào với thời gian sống nhất định"
  async setWithExpiry(key: string, value: string, ttl: number): Promise<void> {
    await redisClient.set(key, value, 'EX', ttl);
  }
}