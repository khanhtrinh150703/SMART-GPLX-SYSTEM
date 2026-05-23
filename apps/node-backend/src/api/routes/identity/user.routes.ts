import { Router } from "express";

// 1. Middlewares (Phân tầng rõ rệt: Bảo mật | Tích hợp | Hệ thống)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";
import { upload } from "@/api/middlewares/integration"; // Xử lý upload thường nằm ở integration
import { validateFileSize } from "@/api/middlewares/shared";

// 2. DI Container
import { container } from "@/shared/utils/container";
import { validateUuidParam } from "@/api/middlewares/validate";
const router = Router();

/** @description Bộ điều khiển tiếp nhận và điều phối các yêu cầu HTTP liên quan đến người dùng (User) và hồ sơ cá nhân. */
const userController = container.cradle.userController;

/** @description Bộ điều khiển dành riêng cho quản trị viên để quản lý vòng đời người dùng, phân quyền và trạng thái tài khoản (Admin). */
const adminUserController = container.cradle.adminUserController;

// ============================================================================
// CẤU HÌNH MIDDLEWARE CHUNG (GLOBAL FOR THIS ROUTER)
// ============================================================================

/** * Vì tất cả các route trong file này đều yêu cầu đăng nhập,
 * ta áp dụng authMiddleware một lần duy nhất tại đây.
 */
router.use(authMiddleware);

// ============================================================================
// NHÓM 1: CÁ NHÂN (USER SCOPE)
// ============================================================================

/**
 * @description Cập nhật thông tin cá nhân và ảnh đại diện của người dùng hiện tại.
 * @route PATCH /api/v1/users/me/profile
 * @access Private (Authenticated User)
 */
router.patch(
  "/me/profile",
  validateFileSize(upload.single("pictureFile")),
  userController.updateProfile,
);

/**
 * @description Thay đổi mật khẩu của người dùng hiện tại.
 * @route PATCH /api/v1/users/me/password
 * @access Private (Authenticated User)
 */
router.patch("/me/password", userController.changePassword);

// ============================================================================
// NHÓM 2: QUẢN TRỊ (ADMIN SCOPE)
// ============================================================================

router.use(requirePermission("users:manage"));

/**
 * @description Lấy danh sách toàn bộ người dùng với các bộ lọc, tìm kiếm và phân trang.
 * @route GET /api/v1/users
 * @access Private (Admin)
 */
router.get("/", adminUserController.getUsers);

/**
 * @description Quản trị viên khởi tạo một tài khoản người dùng mới (Học viên, Giáo viên, Điều phối viên).
 * @route POST /api/v1/users/admin
 * @access Private (Admin)
 */
router.post("/admin", adminUserController.adminCreateUser);

/**
 * Nhóm các hành động thao tác dựa trên ID người dùng để code gọn gàng hơn.
 */
router
  .route("/:id")
  .all(validateUuidParam("id"))
  /**
   * @description Xóa (xóa mềm) tài khoản người dùng khỏi hệ thống.
   * @route DELETE /api/v1/users/:id
   */
  .delete(adminUserController.deleteUser);

/**
 * @description Cập nhật trạng thái hoạt động cho tài khoản người dùng.
 * @route PATCH /api/v1/users/:id/status
 * @access Private (Admin)
 */
router.patch(
  "/:id/status",
  validateUuidParam("id"),
  adminUserController.updateStatus,
);

/**
 * @description Khôi phục lại tài khoản người dùng đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/users/:id/restore
 * @access Private (Admin)
 */
router.patch(
  "/:id/restore",
  validateUuidParam("id"),
  adminUserController.restoreUser,
);

/**
 * @description Quản trị viên cập nhật thông tin chi tiết và vai trò của người dùng.
 * @route PUT /api/v1/users/:id/admin
 * @access Private (Admin)
 */
router.put(
  "/:id/admin",
  validateUuidParam("id"),
  adminUserController.updateUserByAdmin,
);

/**
 * @description Quản trị viên cập nhật thông tin chi tiết và ảnh đại diện của người dùng khác.
 * @route PATCH /api/v1/users/admin/:id
 * @access Private (Admin)
 */
router.patch(
  "/admin/:id",
  validateUuidParam("id"),
  upload.single("pictureFile"),
  adminUserController.updateProfileAdmin,
);

export default router;
