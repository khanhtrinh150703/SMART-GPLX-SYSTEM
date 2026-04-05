import { Router } from 'express';
import { container } from '@/shared/utils/container';
// import { authMiddleware } from '../middlewares/auth.middleware';
import { ChapterController } from '../controllers/chapter.controller';

const router = Router();
const chapterController = container.resolve('chapterController') as ChapterController;

/**
 * @description Route lấy danh sách chương (Public hoặc Auth tùy Cậu Vàng).
 * @route GET /api/v1/chapters
 */
router.get('', chapterController.getAll);

/**
 * @description Route tạo mới chương (Admin only).
 * @route POST /api/v1/chapters
 */
router.post('', chapterController.create);

/**
 * @description Route cập nhật chương.
 * @route PATCH /api/v1/chapters/:id
 */
router.patch('/:id', chapterController.update);

/**
 * @description Route xóa chương.
 * @route DELETE /api/v1/chapters/:id
 */
router.delete('/:id', chapterController.delete);

/**
 * @route   PATCH /api/v1/chapters/:id/restore
 * @desc    Khôi chapter đã xóa mềm
 * @access  Private (Admin)
 */
router.patch('/:id/restore', chapterController.restore);


export default router;