/**
 * Tập hợp các hằng số tiền tố (prefix) dùng để đặt tên key khi lưu trữ trong Redis.
 */
export const REDIS_CONSTANTS = {
  OTP_PREFIX: 'otp:',
  PENDING_PREFIX: 'pending_user:',
  TOKEN_PREFIX: 'token:',
  OTP_LOCK_PREFIX: 'otp_lock:'
} as const;