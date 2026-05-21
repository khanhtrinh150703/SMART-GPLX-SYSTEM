import { Router } from "express";
// 1. Middlewares (Gom từ nhóm bảo mật của identity)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";
import { validateUuidParam } from "@/api/middlewares/validate";

// 2. DI Container
import { container } from "@/shared/utils/container";

const router = Router();

/**
 * @description Bộ điều khiển điều phối các yêu cầu HTTP liên quan đến quản lý và cấu hình Ma trận đề thi (Exam Matrix).
 * Trích xuất trực tiếp từ Cradle tổng giúp đảm bảo 100% Type-safety tuyệt đối mà không cần ép kiểu thủ công.
 */
const controller = container.cradle.examMatrixController;
/**
 * @description Tất cả các route quản lý Ma trận đều yêu cầu đăng nhập
 */
router.use(authMiddleware);

/**
 * @description Lấy danh sách các ma trận đề thi có hỗ trợ tìm kiếm và phân trang.
 * @route GET /api/v1/exam-matrices
 * @returns {Promise<void>} Phản hồi danh sách ExamMatrixResponseDTO.
 */
router.get("/", requirePermission("exam-matrices:read"), controller.list);

/**
 * @description Lấy danh sách các ma trận đề thi học định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/exam-matrices/selection
 * @access Private (Admin/Instructor)
 */
router.get(
  "/selection",
  requirePermission("exam-matrices:read"),
  controller.getExamMatrixSelections,
);

/**
 * @description Áp dụng quyền quản lý ma trận cho toàn bộ các endpoint bên dưới
 */
router.use(requirePermission("exam-matrices:manage"));

/**
 * @description Tạo mới một ma trận đề thi kèm theo cấu trúc tỉ trọng các chương.
 * @route POST /api/v1/exam-matrices
 * @access Private (Yêu cầu quyền exam-matrices:manage)
 */
router.post("/", controller.create);

router
  .route("/:id")
  // 💡 Gom bộ middleware gác cổng dùng chung cho GET, PUT, DELETE tại đây
  .all(validateUuidParam("id"))
  /**
   * @description Lấy thông tin chi tiết của một ma trận đề thi bao gồm tỉ trọng các chương.
   * @route GET /api/v1/exam-matrices/:id
   * @access Private (Yêu cầu quyền exam-matrices:manage)
   */
  .get(controller.getById)

  /**
   * @description Cập nhật thông tin ma trận và thay thế toàn bộ danh sách chi tiết tỉ trọng.
   * @route PUT /api/v1/exam-matrices/:id
   * @access Private (Yêu cầu quyền exam-matrices:manage)
   */
  .put(controller.update)

  /**
   * @description Xóa ma trận đề thi theo cơ chế thông minh.
   * @route DELETE /api/v1/exam-matrices/:id
   * @access Private (Yêu cầu quyền exam-matrices:manage)
   */
  .delete(controller.delete);

/**
 * @description Khôi phục ma trận đề thi đã bị xóa mềm quay trở lại trạng thái hoạt động.
 * @route PATCH /api/v1/exam-matrices/:id/restore
 * @access Private (Yêu cầu quyền exam-matrices:manage)
 */
router.patch(
  "/:id/restore",
  validateUuidParam("id"),
  controller.restore,
);

export default router;
