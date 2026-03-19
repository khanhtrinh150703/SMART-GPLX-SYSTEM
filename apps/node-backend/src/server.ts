import { env } from 'node:process';
import app from './app';
import prisma from '../prisma/prisma';

// Import Redis connection ở đây...

const PORT = env.PORT || 3000

async function startServer() {
  try {
    // 1. Kết nối DB trước khi chạy server
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // 2. Kết nối Redis (nếu cần)

    // 3. Mới chính thức mở cổng chào đón request
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();