import { Router } from 'express';

// 1. Controller (Gom từ index của exam-mgmt)
import { ExamController } from '@/api/controllers/exam-mgmt';

// 2. Middlewares (Gom từ nhóm bảo mật của identity)
import { authMiddleware, requirePermission } from '@/api/middlewares/identity';

// 3. DI Container
import { container } from '@/shared/utils/container';

const router = Router();
const examController = container.resolve('examController') as ExamController;

/**
 * @description Tất cả các route bên dưới đều yêu cầu xác thực và JTI validation.
 */
router.use(authMiddleware);
router.use(requirePermission('exams:manage'))
/**
 * @route   POST /api/v1/exams/generate
 * @desc    Khởi tạo bài thi mới (Bốc đề & Snapshot).
 * @access  Private
 */
router.post('/generate', examController.generate);

// /**
//  * @route   POST /api/v1/exams/:id/complete
//  * @desc    Nộp bài thi và chấm điểm.
//  * @access  Private
//  */
// router.post('/:id/complete', examController.complete);

export default router;