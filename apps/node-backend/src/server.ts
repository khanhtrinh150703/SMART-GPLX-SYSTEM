import { env } from 'node:process';
import app from './app';
import prisma from '../prisma/prisma';
import { connectRedis } from './infrastructure/database/redis/redis.client';
import { RoleCacheService } from './infrastructure/security/role-cache.service';

// Import Redis connection ở đây...

const PORT = env.PORT

async function startServer() {
  try {
    console.log('⏳ [System] Starting services...');

    // 1. Kết nối hạ tầng cơ sở (Infrastructure)
    // Đảm bảo các dịch vụ này sẵn sàng trước khi nạp Cache
    await Promise.all([
      prisma.$connect(),
      connectRedis()
    ]);
    console.log('✅ [System] Database & Redis connected');

    // 2. Nạp dữ liệu vào bộ nhớ (Memory Warm-up)
    // Phải xong bước này thì mới được phép nhận Request
    console.log('⏳ [System] Initializing Role Cache...');
    await RoleCacheService.initialize();
    console.log('✅ [System] Role Cache warmed up successfully');

    // 3. Khởi chạy Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 [System] Smart-GPLX-Backend is live at http://127.0.0.1:${PORT}`);
    });

    // 4. Xử lý tắt server an toàn (Graceful Shutdown)
    process.on('SIGTERM', async () => {
      console.log('👋 [System] Closing server...');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ [System] Critical failure during startup:', error);
    process.exit(1);
  }
}

startServer();