import { beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log("DATABASE ĐANG DÙNG:", process.env.DATABASE_URL);

beforeAll(async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Could not connect to database:", error);
        process.exit(1); // Thoát luôn nếu không kết nối được
    }
});

afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});