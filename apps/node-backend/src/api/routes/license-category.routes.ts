import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { LicenseCategoryController } from '../controllers/license-category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '@/domain/constants/roles.constant';

const router = Router();

/**
 * Resolve Controller từ Awilix Container.
 * Sử dụng Generic Type để đảm bảo Type-safe (Zero Any).
 */
const licenseController = container.resolve<LicenseCategoryController>('licenseCategoryController');

// ============================================================================
// CHẤU HÌNH CHUNG: TẤT CẢ ROUTE ĐỀU YÊU CẦU ĐĂNG NHẬP
// ============================================================================
router.use(authMiddleware);

// ============================================================================
// NHÓM 1: QUYỀN HẠN CHIA SẺ (ADMIN & INSTRUCTOR)
// Đặt lên trên trước khi áp dụng "thiết quân luật" chỉ Admin.
// ============================================================================

/**
 * @description Lấy danh sách các hạng bằng lái định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/license-categories/selection
 * @access Private (User/Admin)
 */
router.get(
    '/selection',
    authorizeRoles(UserRole.ADMIN, UserRole.INSTRUCTOR),
    licenseController.getLicenseSelections
);

// ============================================================================
// NHÓM 2: CHỈ DÀNH CHO QUẢN LÝ
// ============================================================================
router.use(authorizeRoles(UserRole.ADMIN, UserRole.INSTRUCTOR),);

/**
 * Nhóm các hành động thao tác trên root path "/"
 */
router.route('/')
    /**
     * @description Lấy danh sách các hạng bằng lái có hỗ trợ tìm kiếm và phân trang.
     * @route GET /api/v1/license-categories
     */
    .get(licenseController.list)

    /**
     * @description Tạo mới một hạng bằng lái xe.
     * @route POST /api/v1/license-categories
     */
    .post(licenseController.store);

/**
 * Nhóm các hành động thao tác dựa trên ID ":id"
 */
router.route('/:id')
    /**
     * @description Cập nhật thông tin chi tiết của một hạng bằng lái theo ID.
     * @route PATCH /api/v1/license-categories/:id
     */
    .patch(licenseController.update)

    /**
     * @description Xóa (xóa mềm) một hạng bằng lái khỏi hệ thống.
     * @route DELETE /api/v1/license-categories/:id
     */
    .delete(licenseController.delete);

/**
 * @description Khôi phục lại hạng bằng lái đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/license-categories/:id/restore
 * @access Private (Admin)
 */
router.patch('/:id/restore', licenseController.restore);

export default router;