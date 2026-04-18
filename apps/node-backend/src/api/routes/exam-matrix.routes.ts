import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { container } from "@/shared/utils/container";
import { ExamMatrixController } from "../controllers/exam-matrix.controller";

const router = Router();
const controller = container.resolve('examMatrixController') as ExamMatrixController;

/**
 * @description Tất cả các route quản lý Ma trận đều yêu cầu đăng nhập 
 * (Dịch: All matrix management routes require authentication)
 */
router.use(authMiddleware);

/**
 * @description Áp dụng quyền quản lý ma trận cho toàn bộ các endpoint bên dưới
 * (Dịch: Apply matrix management permission for all endpoints below)
 */
router.use(requirePermission('matrices:manage'));

/**
 * @description Tạo mới một ma trận đề thi kèm theo cấu trúc tỉ trọng các chương.
 * @route POST /api/v1/exam-matrices
 * @access Private (Yêu cầu quyền matrices:manage)
 */
router.post(
    "/",
    controller.create
);

/**
 * @description Lấy thông tin chi tiết của một ma trận đề thi bao gồm tỉ trọng các chương.
 * @route GET /api/v1/exam-matrices/:id
 * @access Private (Yêu cầu quyền matrices:manage)
 */
router.get(
    "/:id",
    controller.getById
);

/**
 * @description Cập nhật thông tin ma trận và thay thế toàn bộ danh sách chi tiết tỉ trọng.
 * @route PUT /api/v1/exam-matrices/:id
 * @access Private (Yêu cầu quyền matrices:manage)
 */
router.put(
    "/:id",
    controller.update
);

/**
 * @description Xóa ma trận đề thi theo cơ chế thông minh (Hard Delete nếu chưa dùng, Soft Delete nếu đã sinh đề).
 * @route DELETE /api/v1/exam-matrices/:id
 * @access Private (Yêu cầu quyền matrices:manage)
 */
router.delete(
    "/:id",
    controller.delete
);

/**
 * @description Khôi phục ma trận đề thi đã bị xóa mềm quay trở lại trạng thái hoạt động.
 * @route PATCH /api/v1/exam-matrices/:id/restore
 * @access Private (Yêu cầu quyền matrices:manage)
 */
router.patch(
    "/:id/restore",
    controller.restore
);

export default router;