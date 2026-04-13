import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { LicenseCategoryController } from '../controllers/license-category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware'; // 🚀 Dùng "máy soi vé" mới thay cho Roles

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
// NHÓM 1: QUYỀN ĐỌC (READ SCOPE)
// Áp dụng cho các hành động xem danh sách và lựa chọn.
// ============================================================================

/**
 * @description Lấy danh sách các hạng bằng lái định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/license-categories/selection
 * @access Private (Yêu cầu vé licenses:read)
 */
router.get(
    '/selection',
    requirePermission('licenses:read'),
    licenseController.getLicenseSelections
);

/**
 * @description Lấy danh sách các hạng bằng lái có hỗ trợ tìm kiếm và phân trang.
 * @route GET /api/v1/license-categories
 * @access Private (Yêu cầu vé licenses:read)
 */
router.get('/', requirePermission('licenses:read'), licenseController.list);

// ============================================================================
// NHÓM 2: QUYỀN QUẢN LÝ (MANAGE SCOPE)
// Kể từ đây, tất cả các route bên dưới đều yêu cầu vé 'licenses:manage'.
// Instructor và Admin đều có quyền này để quản lý nội dung.
// ============================================================================
router.use(requirePermission('licenses:manage'));

/**
 * Nhóm các hành động thao tác trên root path "/"
 */
router.route('/')
    /**
     * @description Tạo mới một hạng bằng lái xe.
     * @route POST /api/v1/license-categories
     * @access Private (Admin/Instructor)
     */
    .post(licenseController.store);

/**
 * Nhóm các hành động thao tác dựa trên ID ":id"
 */
router.route('/:id')
    /**
     * @description Cập nhật thông tin chi tiết của một hạng bằng lái theo ID.
     * @route PATCH /api/v1/license-categories/:id
     * @access Private (Admin/Instructor)
     */
    .patch(licenseController.update)

    /**
     * @description Xóa (xóa mềm) một hạng bằng lái khỏi hệ thống.
     * @route DELETE /api/v1/license-categories/:id
     * @access Private (Admin/Instructor)
     */
    .delete(licenseController.delete);

/**
 * @description Khôi phục lại hạng bằng lái đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/license-categories/:id/restore
 * * @access Private (Admin/Instructor)
 */
router.patch('/:id/restore', licenseController.restore);

export default router;