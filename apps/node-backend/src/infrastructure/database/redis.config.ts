import { Redis } from 'ioredis';
import 'dotenv/config';

export const redisClient = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: 3,
  // Thêm tùy chọn này để tránh treo server nếu Redis die hẳn
  connectTimeout: 10000, 
});

export const connectRedis = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Nếu đã kết nối rồi thì resolve luôn
    if (redisClient.status === 'ready' || redisClient.status === 'connect') {
      console.log('✅ Redis is already connected');
      return resolve();
    }

    redisClient.once('connect', () => {
      console.log('✅ Redis connected successfully');
      resolve();
    });

    redisClient.once('error', (err) => {
      console.error('❌ Redis connection error:', err);
      reject(err);
    });
  });
};