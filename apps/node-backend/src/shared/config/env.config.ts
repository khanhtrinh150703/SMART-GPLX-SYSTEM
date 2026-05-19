import 'dotenv/config';

/** * @description Đảm bảo biến môi trường được nạp trước khi bất kỳ code nào khác chạy 
 * (Dịch: Ensure env vars are loaded before any other code runs)
 */
export const env = {
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  PORT: process.env.PORT || 5000,
};