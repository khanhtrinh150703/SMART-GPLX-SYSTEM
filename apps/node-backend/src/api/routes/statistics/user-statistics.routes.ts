import { Router } from "express";

// 1. Middlewares (Gom từ nhóm bảo mật của identity)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";
import { validateUuidParam } from "@/api/middlewares/validate";

// 2. DI Container (Awilix)
import { container } from "@/shared/utils/container";

const router = Router();

/** @description Bộ điều khiển xử lý các yêu cầu HTTP liên quan đến dữ liệu thống kê học tập và kết quả thi cá nhân của người dùng. */
const statsCtrl = container.cradle.userStatisticsController;

/** @description Bộ điều khiển xử lý các yêu cầu HTTP liên quan đến phân tích hiệu suất và tiến độ học tập chi tiết theo từng nhóm chủ đề kiến thức. */
const topicStatsCtrl = container.cradle.userTopicStatisticsController;

// ============================================================================
// CẤU HÌNH CHUNG: TẤT CẢ ROUTE TRONG MODULE ĐỀU CẦN AUTH
// ============================================================================
router.use(authMiddleware);

// ============================================================================
// NHÓM 1: TRUY VẤN DỮ LIỆU (READ SCOPE)
// Dành cho người dùng xem bảng thống kê của chính mình
// ============================================================================

/**
 * @description Lấy tổng quan thống kê (Dashboard cá nhân).
 * @route GET /api/v1/statistics/me
 * @access Private (Owner)
 */
router.get(
  "/me",
  requirePermission("statistics:read"),
  statsCtrl.getMySummary,
);

/**
 * @description Lấy danh sách tiến độ học tập theo từng chủ đề (Biển báo, Luật...).
 * @route GET /api/v1/statistics/me/topics
 * @access Private (Owner)
 */
router.get(
  "/me/topics",
  requirePermission("statistics:read"),
  topicStatsCtrl.getTopicProgress
);

/**
 * @description Lấy chi tiết thống kê của một chủ đề cụ thể.
 * @route GET /api/v1/statistics/me/topics/:topicId
 * @access Private (Owner)
 */
router.get(
  "/me/topics/:topicId",
  validateUuidParam("topicId"), 
  requirePermission("statistics:read"),
  topicStatsCtrl.getTopicDetail
);

// ============================================================================
// NHÓM 2: THAO TÁC HỆ THỐNG (ADMIN/INTERNAL SCOPE)
// ============================================================================

/**
 * @description Yêu cầu đồng bộ thủ công thống kê (Dùng cho Admin/Kỹ thuật viên fix lỗi dữ liệu).
 * @route POST /api/v1/statistics/sync
 * @access Private (Admin)
 */
router.post(
  "/sync",
  requirePermission("statistics:sync"),
  statsCtrl.manualSync,
);

export default router;
