import { connectRedis } from '@/infrastructure/database/redis.config';
import prisma from '../prisma/prisma'; // Đường dẫn tới file prisma client của bạn
import { redisClient } from '@/infrastructure/database/redis.config'

export const connectDB = async () => {
    console.log("🛠️ DATABASE TEST:", process.env.DATABASE_URL);
    try {
        await Promise.all([
            prisma.$connect(),
            connectRedis()
        ]);
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
    await prisma.$disconnect();
    if (redisClient) {
        await redisClient.quit(); // Hoặc redisClient.disconnect();
    }
};