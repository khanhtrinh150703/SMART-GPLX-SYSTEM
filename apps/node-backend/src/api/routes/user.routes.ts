import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

/**
 * Resolve Controller từ Awilix Container.
 */
const userController = container.resolve('userController') as UserController;

// ============================================================================
// NHÓM 1: CÁ NHÂN (USER SCOPE)
// ============================================================================

/**
 * @description Cập nhật thông tin cá nhân và ảnh đại diện của người dùng hiện tại.
 * @route PATCH /api/v1/users/me/profile
 * @access Private (Authenticated User)
 */
router.patch('/me/profile', authMiddleware, upload.single('pictureFile'), userController.updateProfile);

/**
 * @description Thay đổi mật khẩu của người dùng hiện tại.
 * @route PATCH /api/v1/users/me/password
 * @access Private (Authenticated User)
 */
router.patch('/me/password', authMiddleware, userController.changePassword);

// ============================================================================
// NHÓM 2: QUẢN TRỊ (ADMIN SCOPE)
// ============================================================================

/**
 * @description Lấy danh sách toàn bộ người dùng với các bộ lọc, tìm kiếm và phân trang.
 * @route GET /api/v1/users
 * @access Private (Admin)
 */
router.get('', authMiddleware, userController.getUsers);

/**
 * @description Cập nhật trạng thái hoạt động (Active/Inactive) cho tài khoản người dùng.
 * @route PATCH /api/v1/users/:id/status
 * @access Private (Admin)
 */
router.patch('/:id/status', authMiddleware, userController.updateStatus);

/**
 * @description Xóa (xóa mềm) tài khoản người dùng khỏi hệ thống.
 * @route DELETE /api/v1/users/:id
 * @access Private (Admin)
 */
router.delete('/:id', authMiddleware, userController.deleteUser);

/**
 * @description Khôi phục lại tài khoản người dùng đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/users/:id/restore
 * @access Private (Admin)
 */
router.patch('/:id/restore', authMiddleware, userController.restoreUser);

/**
 * @description Quản trị viên cập nhật thông tin chi tiết và ảnh đại diện của người dùng khác.
 * @route PATCH /api/v1/users/admin/:id
 * @access Private (Admin)
 */
router.patch('/admin/:id', authMiddleware, upload.single('pictureFile'), userController.updateProfileAdmin);

export default router;