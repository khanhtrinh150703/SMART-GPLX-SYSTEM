/**
 * @description Tập hợp các hằng số tiền tố (prefix) dùng để đặt tên key trong Redis.
 * Sử dụng cấu trúc namespace 'auth:' để tránh xung đột dữ liệu.
 */
export const REDIS_CONSTANTS = {
  // --- NHÓM ĐĂNG KÝ & OTP ---
  OTP_PREFIX: 'auth:otp:',
  OTP_LOCK_PREFIX: 'auth:otp_lock:',
  PENDING_USER_PREFIX: 'auth:pending_user:',

  // --- NHÓM XÁC THỰC (TOKEN MANAGEMENT) ---
  // Dùng để check JTI trong Middleware (Access Token)
  ACCESS_TOKEN_PREFIX: 'auth:access:', 
  
  // Dùng để check quyền đổi thẻ mới (Refresh Token)
  REFRESH_TOKEN_PREFIX: 'auth:refresh:',

  // --- NHÓM BLACKLIST (Tùy chọn nếu cần thu hồi token thủ công) ---
  BLACKLIST_PREFIX: 'auth:blacklist:',
} as const;

/**
 * @type {string} Định nghĩa kiểu dữ liệu cho các Key để đảm bảo Type Safety
 */
export type RedisPrefix = typeof REDIS_CONSTANTS[keyof typeof REDIS_CONSTANTS];