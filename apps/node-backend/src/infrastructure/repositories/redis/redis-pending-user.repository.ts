import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';
import { IPendingUserRepository } from '@/domain/interfaces/repositories/i-pending-user.repository';
import { redisClient } from '@/infrastructure/database/redis/redis.client';

/**
 * Lớp thực thi giao tiếp với Redis để quản lý dữ liệu người dùng đang chờ xác thực.
 */
export class RedisPendingUserRepository implements IPendingUserRepository {
  
  /**
   * Tác dụng: Lưu thông tin đăng ký tạm thời của người dùng vào Redis.
   * @param {string} key - Từ khóa nhận diện (thường là email hoặc UUID).
   * @param {string} data - Chuỗi dữ liệu (thường đã được JSON.stringify) chứa thông tin user.
   * @param {number} ttlSeconds - Thời gian sống của dữ liệu (tính bằng giây).
   * @returns {Promise<void>}
   */
  public async save(key: string, data: string, ttlSeconds: number): Promise<void> {
    // SỬA LỖI: Đổi tên biến thành redisKey để tránh trùng lặp (shadowing) với tham số 'key'
    const redisKey = `${REDIS_CONSTANTS.PENDING_PREFIX}${key}`;
    
    // SỬA LỖI: Truyền đúng biến 'data' vào thay vì 'otpCode'
    // Lưu ý: Tùy thuộc vào thư viện (redis v4 hay ioredis), hàm này có thể là setEx hoặc setex
    await redisClient.setex(redisKey, ttlSeconds, data);
  }

  /**
   * Tác dụng: Lấy thông tin đăng ký tạm thời từ Redis.
   * @param {string} key - Từ khóa nhận diện (email hoặc UUID).
   * @returns {Promise<string | null>} - Trả về chuỗi dữ liệu (JSON string) hoặc null nếu không tìm thấy/đã hết hạn.
   */
  public async get(key: string): Promise<string | null> {
    // SỬA LỖI: Sử dụng đúng Prefix của Pending User thay vì hardcode 'otp:'
    const redisKey = `${REDIS_CONSTANTS.PENDING_PREFIX}${key}`;
    return await redisClient.get(redisKey);
  }

  /**
   * Tác dụng: Xóa thông tin đăng ký tạm thời khỏi Redis (thường gọi sau khi xác thực thành công).
   * @param {string} key - Từ khóa nhận diện (email hoặc UUID).
   * @returns {Promise<void>}
   */
  public async delete(key: string): Promise<void> {
    // SỬA LỖI: Sử dụng đúng Prefix của Pending User
    const redisKey = `${REDIS_CONSTANTS.PENDING_PREFIX}${key}`;
    await redisClient.del(redisKey);
  }
}