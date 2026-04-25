import { REDIS_CONSTANTS } from "@/domain/constants/redis.constant";

/**
 * @description Helper xây dựng Key hoàn chỉnh từ các mảnh.
 */
export const getRedisKey = (...parts: (string | number)[]): string => parts.join(':');

/**
 * @description Tập hợp các hàm tạo Key hoàn chỉnh.
 */
export const REDIS_KEYS = {
  AUTH: {
    /** @description Key lưu mã OTP: auth:otp:email */
    getOtpKey: (email: string) =>
      getRedisKey(REDIS_CONSTANTS.PREFIX.AUTH.OTP, email.toLowerCase().trim()),

    /** @description Key khóa gửi lại OTP: auth:otp-lock:email */
    getResendLockKey: (email: string) =>
      getRedisKey(REDIS_CONSTANTS.PREFIX.AUTH.OTP_LOCK, email.toLowerCase().trim()),

    /** @description Key lưu thông tin đăng ký chờ xác thực: auth:pending-user:email */
    getPendingUserKey: (email: string) =>
      getRedisKey(REDIS_CONSTANTS.PREFIX.AUTH.PENDING_USER, email.toLowerCase().trim()),

    /** @description Key quản lý Token: auth:access-token:userId:deviceId:jti */
    getTokenKey: (prefix: string, userId: string, deviceId: string, jti: string) =>
      getRedisKey(prefix, userId, deviceId, jti),

    /** 
     * * @description Key quản lý Access Token: auth:access-token:userId:deviceId:jti 
     */
    getAccessTokenKey: (userId: string, deviceId: string, jti: string) =>
      getRedisKey(
        REDIS_CONSTANTS.PREFIX.AUTH.ACCESS_TOKEN,
        userId,
        deviceId,
        jti
      ),

    /** 
     * * @description Key quản lý Refresh Token: auth:refresh-token:userId:deviceId:jti 
     */
    getRefreshTokenKey: (userId: string, deviceId: string, jti: string) =>
      getRedisKey(
        REDIS_CONSTANTS.PREFIX.AUTH.REFRESH_TOKEN,
        userId,
        deviceId,
        jti
      ),


  }
} as const;