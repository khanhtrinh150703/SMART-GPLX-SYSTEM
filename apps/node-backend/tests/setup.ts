import { beforeAll, afterAll } from '@jest/globals';
import prisma from '../prisma/prisma';

console.log("DATABASE ĐANG DÙNG:", process.env.DATABASE_URL);

beforeAll(async () => {
    try {
        console.time("SETUP_CONNECT");
        await prisma.$connect();
        await prisma.user.count(); // Lệnh này sẽ "ăn" cái 2 giây đầu tiên
        console.timeEnd("SETUP_CONNECT");
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