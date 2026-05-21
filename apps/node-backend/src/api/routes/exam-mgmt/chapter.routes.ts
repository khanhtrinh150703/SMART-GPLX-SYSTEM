import { Router } from "express";

// 1. Middlewares (Gom từ nhóm bảo mật của identity)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";

// 2. DI Container
import { container } from "@/shared/utils/container";
import { validateUuidParam } from "@/api/middlewares/validate";

const router = Router();
const chapterController = container.cradle.chapterController;

// ============================================================================
// CẤU HÌNH CHUNG: TẤT CẢ ROUTE TRONG MODULE ĐỀU CẦN AUTH
// ============================================================================
router.use(authMiddleware);

// ============================================================================
// NHÓM 1: QUYỀN HẠN CHIA SẺ (READ SCOPE)
// Dành cho cả Admin và Instructor (Yêu cầu vé chapters:read)
// ============================================================================

/**
 * @description Lấy danh sách các chương học định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/chapters/selection
 * @access Private (Admin/Instructor)
 */
router.get(
  "/selection",
  requirePermission("chapters:read"),
  chapterController.getChapterSelections,
);

/**
 * @description Lấy danh sách các chương học có hỗ trợ tìm kiếm và phân trang.
 * @route GET /api/v1/chapters
 * @access Public/Private (Yêu cầu đăng nhập)
 */
router.get("/", requirePermission("chapters:read"), chapterController.list);

// ============================================================================
// NHÓM 2: QUYỀN QUẢN LÝ (MANAGE SCOPE)
// Kể từ đây, tất cả các route đều yêu cầu vé 'chapters:manage'.
// Instructor và Admin đều có quyền này để quản lý nội dung.
// ============================================================================
router.use(requirePermission("chapters:manage"));

/**
 * @description Tạo mới một chương học lý thuyết.
 * @route POST /api/v1/chapters
 * @access Private (Admin/Instructor)
 */
router.post("/", chapterController.create);

/**
 * Nhóm các hành động thao tác dựa trên ID ":id" để tối ưu đường dẫn.
 */
router
  .route("/:id")
  .all(validateUuidParam("id"))
  /**
   * @description Cập nhật thông tin chi tiết của một chương học theo ID.
   * @route PATCH /api/v1/chapters/:id
   * @access Private (Admin/Instructor)
   */
  .patch(chapterController.update)

  /**
   * @description Xóa (xóa mềm) một chương học khỏi hệ thống.
   * @route DELETE /api/v1/chapters/:id
   * @access Private (Admin/Instructor)
   */
  .delete(chapterController.delete);

/**
 * @description Khôi phục lại chương học đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/chapters/:id/restore
 * @access Private (Admin/Instructor)
 */
router.patch(
  "/:id/restore",
  validateUuidParam("id"),
  chapterController.restore,
);

export default router;
