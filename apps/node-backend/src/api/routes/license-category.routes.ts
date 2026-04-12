import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { LicenseCategoryController } from '../controllers/license-category.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';
// import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

/**
 * Resolve Controller từ Awilix Container.
 * Sử dụng Generic Type để đảm bảo Type-safe (Zero Any).
 */
const licenseController = container.resolve<LicenseCategoryController>('licenseCategoryController');

/**
 * @description Lấy danh sách các hạng bằng lái có hỗ trợ tìm kiếm và phân trang.
 * @route GET /api/v1/license-categories
 * @access Private (Admin/Staff)
 */
router.get('/', licenseController.list);

/**
 * @description Lấy danh sách các hạng bằng lái định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/license-categories/selection
 * @access Private (User/Admin)
 */
router.get('/selection', licenseController.getLicenseSelections);

/**
 * @description Tạo mới một hạng bằng lái xe.
 * @route POST /api/v1/license-categories
 * @access Private (Admin)
 */
router.post('/', licenseController.store);

/**
 * @description Cập nhật thông tin chi tiết của một hạng bằng lái theo ID.
 * @route PATCH /api/v1/license-categories/:id
 * @access Private (Admin)
 */
router.patch('/:id', licenseController.update);

/**
 * @description Xóa (xóa mềm) một hạng bằng lái khỏi hệ thống.
 * @route DELETE /api/v1/license-categories/:id
 * @access Private (Admin)
 */
router.delete('/:id', licenseController.delete);

/**
 * @description Khôi phục lại hạng bằng lái đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/license-categories/:id/restore
 * @access Private (Admin)
 */
router.patch('/:id/restore', licenseController.restore);

export default router;