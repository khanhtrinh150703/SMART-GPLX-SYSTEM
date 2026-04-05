import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

/**
 * 💡 PHÉP MÀU DI: Container tự động resolve các dependency (Service, Repo, Manager...).
 */
const userController = container.resolve('userController') as UserController;

// ============================================================================
// NHÓM 1: CÁ NHÂN (USER SCOPE)
// ============================================================================

/**
 * API Cập nhật thông tin cá nhân và ảnh đại diện.
 * @route PATCH /api/v1/users/me/profile
 */
router.patch(
  '/me/profile', 
  authMiddleware, 
  upload.single('pictureFile'), 
  userController.updateProfile
);

/**
 * API Thay đổi mật khẩu người dùng.
 * @route PATCH /api/v1/users/me/password
 */
router.patch(
  '/me/password', 
  authMiddleware, 
  userController.changePassword
);

// ============================================================================
// NHÓM 2: QUẢN TRỊ (ADMIN SCOPE)
// ============================================================================

/**
 * API Lấy danh sách toàn bộ người dùng (Phân trang/Lọc).
 * @route GET /api/v1/users
 */
router.get(
  '', 
  authMiddleware, 
  userController.getUsers
);

/**
 * API Cập nhật trạng thái hoạt động của người dùng (Active/Inactive).
 * @route PATCH /api/v1/users/:id/status
 */
router.patch(
  '/:id/status', 
  authMiddleware, 
  userController.updateStatus
);

/**
 * API Xóa mềm người dùng khỏi hệ thống.
 * @route DELETE /api/v1/users/:id
 */
router.delete(
  '/:id', 
  authMiddleware, 
  userController.deleteUser
);

/**
 * API Khôi phục tài khoản người dùng đã xóa.
 * @route PATCH /api/v1/users/:id/restore
 */
router.patch(
  '/:id/restore', 
  authMiddleware, 
  userController.restoreUser
);

/**
 * API Quản trị viên cập nhật thông tin chi tiết người dùng.
 * @route PATCH /api/v1/users/admin/:id
 */
router.patch(
  '/admin/:id', 
  authMiddleware, 
  upload.single('pictureFile'), 
  userController.updateProfileAdmin
);

export default router;