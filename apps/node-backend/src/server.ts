import "dotenv/config";
import { env } from "node:process";

// 1. Core App & Infrastructure
import app from "@/app";
import prisma from "../prisma/prisma";
import { connectRedis } from "@/infrastructure/database/redis/redis.client";

// 2. Dependency Injection & Services
import { container } from "@/shared/utils/container";

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    console.log("⏳ [System] Starting services...");

    // ============================================================
    // 1. KẾT NỐI HẠ TẦNG CƠ SỞ (Infrastructure Layer)
    // ============================================================
    const mongoService = container.cradle.mongodbService;

    await Promise.all([
      prisma.$connect(),
      connectRedis(),
      mongoService.connect(),
    ]);
    console.log("✅ [System] Infrastructure connected (SQL, Redis, MongoDB)");

    // ============================================================
    // 2. NẠP DỮ LIỆU VÀO BỘ NHỚ (Cache Warming)
    // ============================================================
    const masterDataCache = container.cradle.masterDataCacheService;
    await masterDataCache.initialize();
    console.log("✅ [System] MasterData Cache warmed up");

    // ============================================================
    // 3. KHỞI TẠO NỀN TẢNG NỀN (Background Workers & Queues)
    // ============================================================
    console.log("⏳ [System] Resolving Background Workers...");
    const importQueue = container.cradle.importQueue;
    const importWorker = container.cradle.importWorker;
    console.log("👷 [System] BullMQ Infrastructure is ready");

    // ============================================================
    // 4. KHỞI CHẠY SERVER API (Presentation Layer)
    // ============================================================
    const server = app.listen(PORT, () => {
      console.log(`🚀 [System] Backend is live at http://127.0.0.1:${PORT}`);
    });

    // ============================================================
    // 5. CƠ CHẾ GRACEFUL SHUTDOWN (Tắt máy an toàn, tuần tự)
    // ============================================================
    const handleShutdown = async (signal: string) => {
      console.log(
        `\n👋 [System] ${signal} received. Starting graceful shutdown...`,
      );

      // Bước A: Ngừng nhận các HTTP request mới vào API Server
      server.close(() => {
        console.log("🛑 [System] API Server stopped accepting new requests.");
      });

      // Bước B: Ngừng nhận và xử lý các Job mới trong hàng đợi ngầm
      try {
        if (importWorker) await importWorker.close();
        if (importQueue) await importQueue.close();
        console.log("✅ [System] BullMQ workers & queues safely closed.");
      } catch (err) {
        console.error("❌ [System] Error closing BullMQ:", err);
      }

      // Bước C: Ngắt kết nối an toàn tới toàn bộ hệ thống cơ sở dữ liệu
      try {
        await Promise.all([prisma.$disconnect(), mongoService.close()]);
        console.log("✅ [System] All databases disconnected safely.");
      } catch (err) {
        console.error("❌ [System] Error during database disconnection:", err);
      }

      console.log("✅ [System] Shutdown complete. Goodbye!");
      process.exit(0);
    };

    // Đăng ký bắt cả hai tín hiệu tắt máy phổ biến nhất
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ [System] Startup failure:", error);
    process.exit(1);
  }
}

startServer();
