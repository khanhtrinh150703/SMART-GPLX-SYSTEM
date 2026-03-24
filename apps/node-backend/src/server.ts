import { env } from 'node:process';
import app from './app';
import prisma from '../prisma/prisma';
import { connectRedis } from './infrastructure/database/redis/redis.client';

// Import Redis connection ở đây...

const PORT = env.PORT

async function startServer() {
  try {
    console.log('⏳ Starting services...');

    // 1 & 2: Kích hoạt cả hai kết nối cùng lúc
    // Promise.all sẽ đợi cho đến khi cả 2 "Lời hứa" đều hoàn thành thành công
    await Promise.all([
      prisma.$connect(),
      connectRedis()
    ]);

    console.log('✅ Database & Redis connected successfully');

    // 3. Mở cổng chào đón request
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    // Nếu 1 trong 2 dịch vụ (DB hoặc Redis) "ngỏm", server sẽ không chạy
    process.exit(1);
  }
}

startServer();