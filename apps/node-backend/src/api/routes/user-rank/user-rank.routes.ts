import { Router } from "express";

// 1. Controller (Gom từ index của module user-rank thông qua Barrel file)
import { UserRankController } from "@/api/controllers/user-rank";

// 2. Middlewares (Gom theo nhóm nghiệp vụ Identity/Auth)
import { authMiddleware } from "@/api/middlewares/identity";

// 3. DI Container (Giải nén phụ thuộc Awilix)
import { container } from "@/shared/utils/container";
import { validateUuidParam } from "@/api/middlewares/validate";

const router = Router();
const controller = container.resolve(
  "userRankController",
) as UserRankController;

/**
 * @description  Lấy bảng xếp hạng của một đề thi cụ thể.
 * @route GET /api/v1/leaderboard/exams/:examId
 * @access Public (Công khai - Ai cũng có thể xem thành tích)
 */
router.get(
  "/exams/:examId",
  validateUuidParam("examId"),
  controller.getExamLeaderboard,
);

/**
 * @description Lấy bảng xếp hạng tổng quát theo hạng bằng lái.
 * @route GET /api/v1/leaderboard/categories/:categoryId
 * @access Public (Công khai)
 */
router.get(
  "/categories/:categoryId",
  validateUuidParam("categoryId"),
  controller.getCategoryLeaderboard,
);

/**
 * @description  Lấy danh sách kỷ lục cá nhân tốt nhất của người dùng hiện tại.
 * @route GET /api/v1/leaderboard/me
 * @access Private (Yêu cầu xác thực đăng nhập)
 */
router.get("/me", authMiddleware, controller.getMyBestRecords);

export default router;
