import { Router } from "express";

// 1. Controller (Gom từ index của exam-session)
import { ExamMatrixController } from "@/api/controllers/exam-session";

// 2. Middlewares (Gom từ nhóm bảo mật của identity)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";

// 3. DI Container
import { container } from "@/shared/utils/container";

const router = Router();
const controller = container.resolve('examMatrixController') as ExamMatrixController;

/**
 * @description Tất cả các route quản lý Ma trận đều yêu cầu đăng nhập 
 * (Dịch: All matrix management routes require authentication)
 */
router.use(authMiddleware);

/**
 * @description Lấy danh sách các ma trận đề thi có hỗ trợ tìm kiếm và phân trang.
 * @route GET /api/v1/exam-matrices
 * @returns {Promise<void>} Phản hồi danh sách ExamMatrixResponseDTO.
 */
router.get(
    '/',
    requirePermission('exam-matrices:read'),
    controller.list
);

/**
 * @description Lấy danh sách các ma trận đề thi học định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/exam-matrices/selection
 * @access Private (Admin/Instructor)
 */
router.get(
    '/selection',
    requirePermission('exam-matrices:read'),
    controller.getExamMatrixSelections
);


/**
 * @description Áp dụng quyền quản lý ma trận cho toàn bộ các endpoint bên dưới
 * (Dịch: Apply matrix management permission for all endpoints below)
 */
router.use(requirePermission('exam-matrices:manage'));

/**
 * @description Tạo mới một ma trận đề thi kèm theo cấu trúc tỉ trọng các chương.
 * @route POST /api/v1/exam-matrices
 * @access Private (Yêu cầu quyền exam-matrices:manage)
 */
router.post(
    "/",
    controller.create
);

/**
 * @description Lấy thông tin chi tiết của một ma trận đề thi bao gồm tỉ trọng các chương.
 * @route GET /api/v1/exam-matrices/:id
 * @access Private (Yêu cầu quyền exam-matrices:manage)
 */
router.get(
    "/:id",
    controller.getById
);

/**
 * @description Cập nhật thông tin ma trận và thay thế toàn bộ danh sách chi tiết tỉ trọng.
 * @route PUT /api/v1/exam-matrices/:id
 * @access Private (Yêu cầu quyền exam-matrices:manage)
 */
router.put(
    "/:id",
    controller.update
);

/**
 * @description Xóa ma trận đề thi theo cơ chế thông minh (Hard Delete nếu chưa dùng, Soft Delete nếu đã sinh đề).
 * @route DELETE /api/v1/exam-matrices/:id
 * @access Private (Yêu cầu quyền exam-matrices:manage)
 */
router.delete(
    "/:id",
    controller.delete
);

/**
 * @description Khôi phục ma trận đề thi đã bị xóa mềm quay trở lại trạng thái hoạt động.
 * @route PATCH /api/v1/exam-matrices/:id/restore
 * @access Private (Yêu cầu quyền exam-matrices:manage)
 */
router.patch(
    "/:id/restore",
    controller.restore
);

export default router;