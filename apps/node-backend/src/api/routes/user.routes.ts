import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';
import { upload } from '../middlewares/upload.middleware';
import { UserRole } from '@/domain/constants/roles.constant';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

/**
 * Resolve Controller từ Awilix Container.
 */
const userController = container.resolve('userController') as UserController;

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
router.patch('/me/profile', upload.single('pictureFile'), userController.updateProfile);

/**
 * @description Thay đổi mật khẩu của người dùng hiện tại.
 * @route PATCH /api/v1/users/me/password
 * @access Private (Authenticated User)
 */
router.patch('/me/password', userController.changePassword);

// ============================================================================
// NHÓM 2: QUẢN TRỊ (ADMIN SCOPE)
// ============================================================================

/**
 * Kể từ đây, tất cả các route đều yêu cầu quyền ADMIN.
 * Ta chặn "vòng gửi xe" bằng một dòng duy nhất thay vì lặp lại ở từng route.
 */
router.use(authorizeRoles(UserRole.ADMIN));

/**
 * @description Lấy danh sách toàn bộ người dùng với các bộ lọc, tìm kiếm và phân trang.
 * @route GET /api/v1/users
 * @access Private (Admin)
 */
router.get('/', userController.getUsers);

/**
 * @description Quản trị viên cập nhật thông tin chi tiết và ảnh đại diện của người dùng khác.
 * @route PATCH /api/v1/users/admin/:id
 * @access Private (Admin)
 */
router.patch('/admin/:id', upload.single('pictureFile'), userController.updateProfileAdmin);

/**
 * Nhóm các hành động thao tác dựa trên ID người dùng để code gọn gàng hơn.
 */
router.route('/:id')
    /**
     * @description Xóa (xóa mềm) tài khoản người dùng khỏi hệ thống.
     * @route DELETE /api/v1/users/:id
     */
    .delete(userController.deleteUser);

/**
 * @description Cập nhật trạng thái hoạt động (Active/Inactive) cho tài khoản người dùng.
 * @route PATCH /api/v1/users/:id/status
 * @access Private (Admin)
 */
router.patch('/:id/status', userController.updateStatus);

/**
 * @description Khôi phục lại tài khoản người dùng đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/users/:id/restore
 * @access Private (Admin)
 */
router.patch('/:id/restore', userController.restoreUser);

/**
 * @description Quản trị viên cập nhật thông tin chi tiết và vai trò của người dùng.
 * @route PUT /api/v1/users/:id/admin
 * @access Private (Admin)
 */
router.put('/:id/admin', userController.updateUserByAdmin);

export default router;