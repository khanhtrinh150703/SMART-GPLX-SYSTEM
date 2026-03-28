/**
 * Tập hợp các vấn đề về lưu trữ thời gian
 */
export const TIME_CONSTANTS = {
  OTP_TTL: 300,
  LOCK_TIME: 60,
  PENDING_TTL: 600,
  ACCESS_TOKEN_EXPIRE: 900,
} as const;


export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRE: '15m',
  REFRESH_TOKEN_EXPIRE: '7d',
  REFRESH_TOKEN_TTL: 7 * 24 * 60 * 60  // 7 ngày tính bằng giây
} as const
