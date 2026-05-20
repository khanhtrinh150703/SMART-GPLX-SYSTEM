import "dotenv/config";
import { env } from "node:process";

// 1. Core App & Database
import app from "@/app";
import { connectRedis } from "@/infrastructure/database/redis/redis.client";
import prisma from "../prisma/prisma";

// 2. Dependency Injection & Services
import { container } from "@/shared/utils/container";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt";

// 3. Infrastructure (Queues & Workers)
import { ImportQueue } from "./infrastructure/queues";
import { ImportWorker } from "./infrastructure/workers";
import { IMongoDBService } from "./domain/interfaces/services/external";

// 4. Logging
// import logger from '@/infrastructure/logging/winston.logger';

const PORT = env.PORT || 5000;
async function startServer() {
  try {
    console.log("⏳ [System] Starting services...");

    // 1. Kết nối hạ tầng cơ sở
    await Promise.all([prisma.$connect(), connectRedis()]);
    console.log("✅ [System] Database & Redis connected");

    // 2. Nạp dữ liệu vào bộ nhớ
    const masterDataCache = container.resolve(
      "masterDataCacheService",
    ) as IMasterDataCacheService;
    await masterDataCache.initialize();
    console.log("✅ [System] MasterData Cache warmed up");

    // ============================================================
    // 3. KHỞI TẠO BULLMQ QUA CONTAINER (Dịch: Initialize via DI)
    // ============================================================
    console.log("⏳ [System] Resolving Background Workers...");


    const importQueue = container.resolve("importQueue") as ImportQueue;
    const importWorker = container.resolve("importWorker") as ImportWorker;

    console.log("👷 [System] Import Worker & Queue are ready");

    const mongoService = container.resolve<IMongoDBService>("mongodbService");
    await mongoService.connect();

    console.log("👷 [System] MongoDb are ready");
    // 4. Khởi chạy Server API
    const server = app.listen(PORT, () => {
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

      server.close(async () => {
        await prisma.$disconnect();
        console.log("✅ [System] All services stopped. Goodbye!");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ [System] Startup failure:", error);
    process.exit(1);
  }
}

startServer();
