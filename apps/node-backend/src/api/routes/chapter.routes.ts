import { Router } from 'express';
import { container } from '@/shared/utils/container';
// import { authMiddleware } from '../middlewares/auth.middleware';
import { ChapterController } from '../controllers/chapter.controller';

const router = Router();
const chapterController = container.resolve('chapterController') as ChapterController;

/**
 * @description Lấy danh sách các chương học có hỗ trợ tìm kiếm và phân trang.
 * @route GET /api/v1/chapters
 * @access Public/Private
 */
router.get('', chapterController.list);

/**
 * @description Lấy danh sách các chương học định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/chapters/selection
 * @access Private (User/Admin)
 */
router.get('/selection', chapterController.getChapterSelections);

/**
 * @description Tạo mới một chương học lý thuyết.
 * @route POST /api/v1/chapters
 * @access Private (Admin)
 */
router.post('', chapterController.create);

/**
 * @description Cập nhật thông tin chi tiết của một chương học theo ID.
 * @route PATCH /api/v1/chapters/:id
 * @access Private (Admin)
 */
router.patch('/:id', chapterController.update);

/**
 * @description Xóa (xóa mềm) một chương học khỏi hệ thống.
 * @route DELETE /api/v1/chapters/:id
 * @access Private (Admin)
 */
router.delete('/:id', chapterController.delete);

/**
 * @description Khôi phục lại chương học đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/chapters/:id/restore
 * @access Private (Admin)
 */
router.patch('/:id/restore', chapterController.restore);

export default router;