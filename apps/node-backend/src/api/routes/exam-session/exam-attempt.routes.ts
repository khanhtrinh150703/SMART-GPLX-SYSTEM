import { Router } from "express";

// 1. Middlewares (Quản lý Identity & Security)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";

// 2. DI Container
import { container } from "@/shared/utils/container";

const router = Router();

/**
 * @description Bộ điều khiển điều phối các yêu cầu nộp bài, chấm điểm và truy vấn lịch sử các lượt làm bài thi.
 */
const controller = container.cradle.examAttemptController;

/**
 * @description Nộp bài thi và chấm điểm dành cho Khách (Guest).
 * @route POST /api/v1/exam-attempts/guest/complete
 * @access Public (No Token)
 * @note Không lưu snapshot vào Database, chỉ trả về kết quả để hiển thị.
 */
router.post("/guest/complete", controller.completeExam);

/**
 * --- NHÓM PROTECTED ROUTES (PRIVATE) ---
 * Nhóm này yêu cầu định danh (JWT) và quyền hạn cụ thể để truy cập
 * vào lịch sử và thực hiện nộp bài.
 */
router.use(authMiddleware);

/**
 * @description Nộp bài thi, chấm điểm và lưu Snapshot kết quả.
 * @route POST /api/v1/exam-attempts/complete
 * @access Private (User)
 */
router.post(
  "/complete",
  requirePermission("exam-attempts:write"),
  controller.completeExam,
);

export default router;
