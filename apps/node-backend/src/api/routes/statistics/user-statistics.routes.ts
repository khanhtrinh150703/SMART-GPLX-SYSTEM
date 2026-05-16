import { Router } from "express";

// 1. Controllers (Triệu hồi từ Controller hợp nhất của module Statistics)
import {
  UserStatisticsController,
  UserTopicStatisticsController,
} from "@/api/controllers/statistics";

// 2. Middlewares (Gom từ nhóm bảo mật của identity)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";

// 3. DI Container (Awilix)
import { container } from "@/shared/utils/container";
import { validateUuidParam } from "@/api/middlewares/validate";

const router = Router();

// Resolve controller từ Container (Đảm bảo tên trùng khớp với lúc đăng ký ở Awilix)
const statsCtrl = container.resolve<UserStatisticsController>(
  "userStatisticsController",
);

const topicStatsCtrl = container.resolve<UserTopicStatisticsController>(
  "userTopicStatisticsController",
);
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
