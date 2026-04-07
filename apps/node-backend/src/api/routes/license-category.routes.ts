import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { LicenseCategoryController } from '../controllers/license-category.controller';
// Giả định bạn đã có các middleware này theo yêu cầu tại mục 4 (Security)
// import { authMiddleware } from '../middlewares/auth.middleware';
// import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

/**
 * Resolve Controller từ Awilix Container.
 * Sử dụng Generic Type để đảm bảo Type-safe (Zero Any).
 */
const controller = container.resolve<LicenseCategoryController>('licenseCategoryController');

/**
 * @route   GET /api/v1/license-categories
 * @desc    Lấy danh sách toàn bộ hạng bằng lái
 * @access  Private (Admin/Staff)
 */
router.get(
  '/',
  // authMiddleware, 
  controller.list
);

/**
 * @route   POST /api/v1/license-categories
 * @desc    Tạo mới một hạng bằng lái
 * @access  Private (Admin)
 */
router.post(
  '/',
  // authMiddleware,
  // roleMiddleware(['ADMIN']),
  controller.store
);

/**
 * @route   PATCH /api/v1/license-categories/:id
 * @desc    Cập nhật thông tin hạng bằng lái
 * @access  Private (Admin)
 */
router.patch(
  '/:id',
  // authMiddleware,
  // roleMiddleware(['ADMIN']),
  controller.update // Giả định hàm update đã được thêm vào Controller
);

/**
 * @route   DELETE /api/v1/license-categories/:id
 * @desc    Xóa hạng bằng lái (Kiểm tra ràng buộc tại Service)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  // authMiddleware,
  // roleMiddleware(['ADMIN']),
  controller.delete
);

/**
 * @route   PATCH /api/v1/license-categories/:id/restore
 * @desc    Khôi phục hạng bằng lái đã xóa mềm
 * @access  Private (Admin)
 */
router.patch(
  '/:id/restore',
  // authMiddleware,
  // roleMiddleware(['ADMIN']),
  controller.restore
);

export default router;