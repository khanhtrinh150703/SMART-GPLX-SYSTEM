import { connectRedis } from "@/infrastructure/database/redis/redis.client";
import prisma from "../prisma/prisma"; // Đường dẫn tới file prisma client của bạn
import { redisClient } from "@/infrastructure/database/redis/redis.client";
import { container } from "@/shared/utils/container";
import { ImportQueue } from "@/infrastructure/queues/import.queue";
import { ImportWorker } from "@/infrastructure/workers/import.worker";
import app from "@/app";
import { env } from "process";
import { Server } from "http";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/commands/i-master-data-cache.service";
import { IMongoDBService } from "@/domain/interfaces/services/external/commands";
import mongoose from "mongoose";

const PORT = env.PORT || 5000;
let serverInstance: Server | null = null;
export const connectDB = async () => {
  try {
    console.log("⏳ [System] Starting services...");

    // 1. Kết nối hạ tầng cơ sở
    await Promise.all([prisma.$connect(), connectRedis()]);
    console.log("✅ [System] Database & Redis connected");

    // 2. Nạp dữ liệu vào bộ nhớ
    const masterDataCache = container.resolve<IMasterDataCacheService>(
      "masterDataCacheService",
    );
    await masterDataCache.initialize();
    console.log("✅ [System] MasterData Cache warmed up");

    // ============================================================
    // 3. KHỞI TẠO BULLMQ QUA CONTAINER (Dịch: Initialize via DI)
    // ============================================================
    console.log("⏳ [System] Resolving Background Workers...");

    // Ông chỉ cần 'resolve' chúng ra. Awilix sẽ tự động:
    // - Tạo ImportProcessorService (vì Worker cần nó)
    // - Tạo ImportQueue (Singleton)
    // - Khởi chạy Worker (Lắng nghe Redis ngay lập tức)
    const importQueue = container.resolve("importQueue") as ImportQueue;
    const importWorker = container.resolve("importWorker") as ImportWorker;

    console.log("👷 [System] Import Worker & Queue are ready");

    const mongoService = container.resolve<IMongoDBService>("mongodbService");
    await mongoService.connect();

    console.log("👷 [System] MongoDb are ready");

    // 4. Khởi chạy Server API
    serverInstance = app.listen(PORT, () => {
      console.log(`🚀 [System] Backend is live at http://127.0.0.1:${PORT}`);
    });
    // ==========================================
    // 5. GRACEFUL SHUTDOWN (Tắt máy an toàn)
    // ==========================================
    process.on("SIGTERM", async () => {
      console.log("👋 [System] SIGTERM received.");

      // Đóng Worker trước để ngừng nhận Job mới
      await importWorker.close();
      await importQueue.close();
      console.log("✅ [System] BullMQ safely closed.");
    });
  } catch (error) {
    console.error("❌ [System] Startup failure:", error);
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

export const cleanupDB = async (): Promise<void> => {
  console.log(" Fleming [Cleanup] Releasing all resources...");

  try {
    // 1. Đóng BullMQ
    const importWorker = container.resolve("importWorker") as ImportWorker;
    const importQueue = container.resolve("importQueue") as ImportQueue;
    if (importWorker) await importWorker.close();
    if (importQueue) await importQueue.close();
    console.log("✅ [Cleanup] BullMQ Worker & Queue closed");

    // 2. Đóng Server API
    if (serverInstance) {
      await new Promise<void>((resolve) => {
        serverInstance!.close(() => resolve());
      });
      console.log("✅ [Cleanup] Server closed");
    }

    // 3. Xóa dữ liệu và ngắt kết nối hệ thống DB
    // --- Phần MySQL ---
    await dropAllTables();
    await prisma.$disconnect();
    console.log("✅ [Cleanup] MySQL dropped and disconnected");

    // --- 🔥 PHẦN MONGODB: NUKE SẠCH DATABASE TEST ---
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase(); // Xóa sạch sành sanh không để lại vết
      console.log("✨ [Cleanup] MongoDB database nuked!");
    }

    const mongoService = container.resolve<IMongoDBService>("mongodbService");
    if (mongoService) {
      await mongoService.close(); // Gọi hàm close đã sửa ở trên để giải phóng kết nối
      console.log("✅ [Cleanup] MongoDB disconnected");
    }

    // 4. Đóng Redis
    if (redisClient) {
      await redisClient.quit();
      console.log("✅ [Cleanup] Redis connection closed");
    }
  } catch (error) {
    console.error("❌ [Cleanup] Failed:", error);
  }
};
