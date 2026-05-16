import { Router } from "express";

// 1. Controller (Resolve từ Awilix DI Container)
import {
  ExamHistoryController,
  ExamHistorySummaryController,
} from "@/api/controllers/exam-mgmt";

// 2. Middlewares (Quản lý Identity & Security)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";
import { container } from "@/shared/utils/container";
import { validateUuidParam } from "@/api/middlewares/validate";

const router = Router();

/**
 * @description Resolve Controller từ DI Container.
 * Đảm bảo 100% Type-safety thông qua ép kiểu tường minh.
 */
const controllerHistory = container.resolve(
  "examHistoryController",
) as ExamHistoryController;

const controllerSummary = container.resolve(
  "examHistorySummaryController",
) as ExamHistorySummaryController;

/**
 * --- NHÓM PROTECTED ROUTES (PRIVATE) ---
 * Nhóm này yêu cầu định danh (JWT) và quyền hạn cụ thể để truy cập
 * vào lịch sử và thực hiện nộp bài.
 */
router.use(authMiddleware);

// ============================================================================
// NHÓM 1: DỮ LIỆU TÓM TẮT (SQL - MYSQL)
// Ưu tiên đưa lên trước để tránh trùng lặp với dynamic param :id
// ============================================================================

/**
 * @description Truy vấn danh sách tóm tắt lịch sử thi (Phân trang + Lọc).
 * @route GET /api/v1/exam-histories/summary
 * @access Private (Owner)
 */
router.get(
  "/summary",
  requirePermission("exam-histories:read"),
  controllerSummary.getHistorySummaryList,
);

/**
 * @description Truy vấn chi tiết tóm tắt của một bản ghi bài thi cụ thể.
 * @route GET /api/v1/exam-histories/summary/:id
 * @access Private (Owner)
 */
router.get(
  "/summary/:id",
  validateUuidParam("id"),
  requirePermission("exam-histories:read-detail"),
  controllerSummary.getHistorySummaryDetail,
);

// ============================================================================
// NHÓM 2: DỮ LIỆU LỊCH SỬ CHI TIẾT (NOSQL - MONGODB SNAPSHOT)
// ============================================================================

/**
 * @description Lấy danh sách lịch sử làm bài của cá nhân học viên.
 * @route GET /api/v1/exam-histories/
 * @access Private (User)
 */
router.get(
  "/",
  requirePermission("exam-attempts:read"),
  controllerHistory.getHistories,
);

/**
 * @description Xem chi tiết một bản ghi lịch sử (Bao gồm Snapshot từ NoSQL).
 * @route GET /api/v1/exam-histories/:id
 * @access Private (User)
 */
router.get(
  "/:id",
  validateUuidParam("id"),
  requirePermission("exam-attempts:read-detail"), // Permission riêng cho xem chi tiết
  controllerHistory.getHistoryDetail,
);

export default router;
