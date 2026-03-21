import prisma from '../prisma/prisma'; // Đường dẫn tới file prisma client của bạn

export const connectDB = async () => {
    console.log("🛠️ DATABASE TEST:", process.env.DATABASE_URL);
    try {
        await prisma.$connect();
        await prisma.user.count(); // Warm up
        console.log("🚀 Database connected!");
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        process.exit(1);
    }
};

export const cleanupDB = async () => {
    console.log("🧹 Cleaning up database...");
    await prisma.user.deleteMany(); // Xóa sạch user sau khi test xong
    await prisma.$disconnect();
};