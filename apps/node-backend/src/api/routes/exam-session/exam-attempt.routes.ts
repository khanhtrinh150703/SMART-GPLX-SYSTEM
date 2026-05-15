import { Router } from "express";

// 1. Controller (Resolve từ Awilix DI Container)
import { ExamAttemptController } from "@/api/controllers/exam-session";

// 2. Middlewares (Quản lý Identity & Security)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";
import { container } from "@/shared/utils/container";

const router = Router();

/**
 * @description Resolve Controller từ DI Container.
 * Đảm bảo 100% Type-safety thông qua ép kiểu tường minh.
 */
const controller = container.resolve(
  "examAttemptController",
) as ExamAttemptController;

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
