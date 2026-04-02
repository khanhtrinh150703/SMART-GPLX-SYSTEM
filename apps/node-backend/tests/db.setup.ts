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

export const cleanupDB = async () => {
    console.log("🧹 Cleaning up database...");
    await prisma.user.deleteMany(); // Xóa sạch user sau khi test xong
    await prisma.licenseCategory.deleteMany(); // Xóa sạch user sau khi test xong
    await prisma.$disconnect();
    if (redisClient) {
        await redisClient.quit(); // Hoặc redisClient.disconnect();
    }
};