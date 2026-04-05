import { redisClient } from '@/infrastructure/database/redis/redis.client';
import { RateLimiterRedis } from 'rate-limiter-flexible';

/**
 * Cấu hình chung cho Redis Limiter
 */
const redisOptions = {
  storeClient: redisClient,
  enableOfflineQueue: true,
};

/**
 * 1. CHỐNG SPAM OTP (Cực gắt)
 * Chặn cả Email và IP để không cho bot dội bom mail.
 */
export const otpLimiter = {
  resend: new RateLimiterRedis({
    ...redisOptions,
    keyPrefix: 'limiter_otp_resend',
    points: 1, 
    duration: 60, // 1 lần mỗi phút
  }),
  daily: new RateLimiterRedis({
    ...redisOptions,
    keyPrefix: 'limiter_otp_daily',
    points: 5, 
    duration: 86400, // 5 lần mỗi 24h
  })
};

/**
 * 2. CHỐNG BRUTE-FORCE LOGIN
 * Ngăn chặn việc dò mật khẩu.
 */
export const loginLimiter = new RateLimiterRedis({
  ...redisOptions,
  keyPrefix: 'limiter_login_fail',
  points: 5, // Cho phép sai 5 lần
  duration: 900, // Trong 15 phút
  blockDuration: 3600, // Nếu sai quá 5 lần, khóa luôn 1 tiếng
});

/**
 * 3. CHỐNG SPAM ĐĂNG KÝ (Register)
 * Tránh việc tạo hàng loạt tài khoản rác bằng bot.
 */
export const registerLimiter = new RateLimiterRedis({
  ...redisOptions,
  keyPrefix: 'limiter_register_ip',
  points: 3, 
  duration: 3600, // Một IP chỉ được đăng ký 3 tài khoản mỗi giờ
});

/**
 * 4. CHỐNG SPAM API CHUNG (Global Rate Limit)
 * Bảo vệ Server không bị treo nếu có đứa cố tình F5 liên tục.
 */
export const globalApiLimiter = new RateLimiterRedis({
  ...redisOptions,
  keyPrefix: 'limiter_global',
  points: 50, 
  duration: 1, // Tối đa 50 request mỗi giây trên 1 IP
});