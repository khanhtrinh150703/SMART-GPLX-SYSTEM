import { REDIS_KEYS } from "@/shared/config/redis.config";
import Redis from "ioredis";

/**
 * @description Các hàm hỗ trợ thao tác nhanh với Redis trong môi trường Test.
 * Giúp kiểm tra trạng thái hoặc dọn dẹp dữ liệu giữa các test case.
 */
export const createAuthTestUtils = (redis: Redis) => ({
  /** @description Lấy OTP trực tiếp từ Redis để so sánh trong test */
  getOtp: (email: string) => redis.get(REDIS_KEYS.AUTH.getOtpKey(email)),

  /** @description Xóa sạch dữ liệu để giả lập môi trường mới */
  clearAll: (email: string) => redis.del(
    REDIS_KEYS.AUTH.getOtpKey(email),
    REDIS_KEYS.AUTH.getResendLockKey(email),
    REDIS_KEYS.AUTH.getPendingUserKey(email)
  ),
  
  /** @description Kiểm tra xem user có đang bị khóa gửi OTP không */
  isLocked: (email: string) => redis.exists(REDIS_KEYS.AUTH.getResendLockKey(email))
});