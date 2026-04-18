import { connectRedis } from '@/infrastructure/database/redis/redis.client';
import prisma from '../prisma/prisma'; // Đường dẫn tới file prisma client của bạn
import { redisClient } from '@/infrastructure/database/redis/redis.client'
import { MasterDataCacheService } from '@/infrastructure/security/master-data-cache.service';
import { container } from '@/shared/utils/container';
import { ImportQueue } from '@/infrastructure/queues/import.queue';
import { ImportWorker } from '@/infrastructure/workers/import.worker';
import app from '@/app';
import { env } from 'process';

const PORT = env.PORT || 3000;

export const connectDB = async () => {
  try {
    console.log('⏳ [System] Starting services...');

    // 1. Kết nối hạ tầng cơ sở
    await Promise.all([
      prisma.$connect(),
      connectRedis()
    ]);
    console.log('✅ [System] Database & Redis connected');

    // 2. Nạp dữ liệu vào bộ nhớ
    await MasterDataCacheService.initialize();
    console.log('✅ [System] MasterData Cache warmed up');

    // ============================================================
    // 3. KHỞI TẠO BULLMQ QUA CONTAINER (Dịch: Initialize via DI)
    // ============================================================
    console.log('⏳ [System] Resolving Background Workers...');
    
    // Ông chỉ cần 'resolve' chúng ra. Awilix sẽ tự động:
    // - Tạo ImportProcessorService (vì Worker cần nó)
    // - Tạo ImportQueue (Singleton)
    // - Khởi chạy Worker (Lắng nghe Redis ngay lập tức)
    const importQueue = container.resolve('importQueue') as ImportQueue;
    const importWorker = container.resolve('importWorker') as ImportWorker;

    console.log('👷 [System] Import Worker & Queue are ready');

    // 4. Khởi chạy Server API
    const server = app.listen(PORT, () => {
      console.log(`🚀 [System] Backend is live at http://127.0.0.1:${PORT}`);
    });

    // ==========================================
    // 5. GRACEFUL SHUTDOWN (Tắt máy an toàn)
    // ==========================================
    process.on('SIGTERM', async () => {
      console.log('👋 [System] SIGTERM received.');
      
      // Đóng Worker trước để ngừng nhận Job mới
      await importWorker.close(); 
      await importQueue.close();
      console.log('✅ [System] BullMQ safely closed.');

      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ [System] All services stopped. Goodbye!');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ [System] Startup failure:', error);
    process.exit(1);
  }
}

export const dropAllTables = async () => {
    console.log("💣 Nuking all tables...");

    try {
        // 1. Tắt khóa ngoại
        await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);

        // 2. Lấy danh sách bảng
        const tableNames = await prisma.$queryRaw<Array<{ TABLE_NAME: string }>>`
      SELECT TABLE_NAME FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
    `;

        // 3. DROP từng bảng một
        for (const { TABLE_NAME } of tableNames) {
            if (TABLE_NAME !== "_prisma_migrations") {
                await prisma.$executeRawUnsafe(`DROP TABLE \`${TABLE_NAME}\`;`);
            }
        }

        // 4. Bật lại khóa ngoại
        await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);

        console.log("✨ All tables dropped! Now you need to run 'prisma db push'.");
    } catch (error) {
        console.error("❌ Drop failed:", error);
    }
};

export const cleanupDB = async () => {
    await dropAllTables()
    await prisma.$disconnect();
    if (redisClient) {
        await redisClient.quit(); // Hoặc redisClient.disconnect();
    }
};