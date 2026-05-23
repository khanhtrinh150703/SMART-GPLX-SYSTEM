// --- 1. NODE.JS CORE & THIRD-PARTY MODULES (Thư viện gốc & Bên thứ ba) ---
import { Server } from "http";
import { env } from "process";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// --- 2. APPLICATION CORE (Ứng dụng Express chính) ---
import app from "@/app";

// --- 3. INFRASTRUCTURE & DATABASE CLIENTS (Kết nối Cơ sở dữ liệu) ---
import prisma from "../prisma/prisma";
import {
  connectRedis,
  redisClient,
} from "@/infrastructure/database/redis/redis.client";

// --- 4. DEPENDENCY INJECTION CONTAINER (Quản lý Phụ thuộc) ---
import { container } from "@/shared/utils/container";

const PORT = env.PORT || 5000;
let serverInstance: Server | null = null;

/**
 * @description Khởi chạy toàn bộ hạ tầng cơ sở và API Server phục vụ môi trường chạy/test.
 */
export const connectDB = async () => {
  try {
    console.log("⏳ [System] Starting services...");

    const mongoService = container.cradle.mongodbService;

    // 1. Kết nối hạ tầng cơ sở (Chạy song song tối ưu hóa I/O)
    await Promise.all([
      prisma.$connect(),
      connectRedis(),
      mongoService.connect(),
    ]);
    console.log("✅ [System] Infrastructure connected (SQL, Redis, MongoDB)");

    // 2. Nạp dữ liệu vào bộ nhớ đệm
    const masterDataCache = container.cradle.masterDataCacheService;
    await masterDataCache.initialize();
    console.log("✅ [System] MasterData Cache warmed up");

    // 3. Khởi tạo BullMQ
    console.log("⏳ [System] Resolving Background Workers...");
    // const importQueue = container.cradle.importQueue;
    // const importWorker = container.cradle.importWorker;
    console.log("👷 [System] BullMQ Infrastructure is ready");

    // 4. Khởi chạy Server API
    serverInstance = app.listen(PORT, () => {
      console.log(`🚀 [System] Backend is live at http://127.0.0.1:${PORT}`);
    });

    // 5. Đăng ký Graceful Shutdown qua hàm dọn dẹp tổng thể
    const handleSignal = async (signal: string) => {
      console.log(`👋 [System] ${signal} received. Cleaning up...`);
      await cleanupDB();
      process.exit(0);
    };

    process.on("SIGTERM", () => handleSignal("SIGTERM"));
    process.on("SIGINT", () => handleSignal("SIGINT"));
  } catch (error) {
    console.error("❌ [System] Startup failure:", error);
    process.exit(1);
  }
};

/**
 * @description Nuke sạch cấu trúc và dữ liệu của toàn bộ các bảng trong MySQL (trừ bảng migration).
 */
export const dropAllTables = async () => {
  console.log("💣 Nuking all MySQL tables...");
  try {
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);

    const tableNames = await prisma.$queryRaw<Array<{ TABLE_NAME: string }>>`
      SELECT TABLE_NAME FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
    `;

    for (const { TABLE_NAME } of tableNames) {
      if (TABLE_NAME !== "_prisma_migrations") {
        await prisma.$executeRawUnsafe(`DROP TABLE \`${TABLE_NAME}\`;`);
      }
    }

    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
    console.log("✨ All MySQL tables dropped!");
  } catch (error) {
    console.error("❌ MySQL Drop failed:", error);
    throw error; 
  }
};

/**
 * @description Giải phóng hoàn toàn mọi tài nguyên, đóng cổng kết nối và nuke sạch dữ liệu test.
 * Đảm bảo tiến trình kết thúc sạch sẽ không bị rò rỉ bộ nhớ hay treo luồng.
 */
export const cleanupDB = async (): Promise<void> => {
  console.log("🧹 [Cleanup] Releasing all resources...");

  // 1. Đóng các dịch vụ ứng dụng trước (HTTP Server & Message Queue)
  try {
    const importQueue = container.cradle.importQueue;
    const importWorker = container.cradle.importWorker;
    if (importWorker) await importWorker.close();
    if (importQueue) await importQueue.close();
    console.log("✅ [Cleanup] BullMQ Worker & Queue closed");

    if (serverInstance) {
      await new Promise<void>((resolve) => {
        serverInstance!.close(() => resolve());
      });
      console.log("✅ [Cleanup] Server closed");
    }
  } catch (error) {
    console.error("❌ [Cleanup] Error closing application services:", error);
  }

  // 2. Thực hiện xóa dữ liệu (Nuke dữ liệu)
  try {
    await dropAllTables();

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      console.log("✨ [Cleanup] MongoDB database nuked!");
    }
  } catch (error) {
    console.error("❌ [Cleanup] Error during database nuking:", error);
  } finally {
    console.log("⏳ [Cleanup] Closing all infrastructure connections...");

    try {
      await prisma.$disconnect();
      console.log("✅ [Cleanup] MySQL disconnected");
    } catch (err) {
      console.error("❌ MySQL disconnect error:", err);
    }

    try {
      const mongoService = container.cradle.mongodbService;
      if (mongoService) await mongoService.close();
      console.log("✅ [Cleanup] MongoDB disconnected");
    } catch (err) {
      console.error("❌ MongoDB disconnect error:", err);
    }

    try {
      if (redisClient) await redisClient.quit();
      console.log("✅ [Cleanup] Redis connection closed");
    } catch (err) {
      console.error("❌ Redis disconnect error:", err);
    }
  }
};
