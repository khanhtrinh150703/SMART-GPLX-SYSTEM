import { connectRedis } from '@/infrastructure/database/redis/redis.client';
import prisma from '../prisma/prisma'; // Đường dẫn tới file prisma client của bạn
import { redisClient } from '@/infrastructure/database/redis/redis.client'
import { RoleCacheService } from '@/infrastructure/security/role-cache.service';

export const connectDB = async () => {
    console.log("🛠️ DATABASE TEST:", process.env.DATABASE_URL);
    try {
        await Promise.all([
            prisma.$connect(),
            connectRedis()
        ]);

        await RoleCacheService.initialize();
        console.log('✅ [System] Role Cache warmed up successfully');

        await prisma.user.count(); // Warm up

        console.log('✅ Database & Redis connected successfully');
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        process.exit(1);
    }
};

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