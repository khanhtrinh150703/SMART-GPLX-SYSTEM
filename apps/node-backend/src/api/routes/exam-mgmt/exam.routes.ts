import { Router } from 'express';
import { ExamController } from '@/api/controllers/exam-mgmt';
import { authMiddleware, requirePermission } from '@/api/middlewares/identity';
import { container } from '@/shared/utils/container';

const router = Router();
const examController = container.resolve('examController') as ExamController;

/**
 * @description Yêu cầu xác thực JWT cho toàn bộ các tài nguyên về Đề thi.
 * @access Private
 */
router.use(authMiddleware);

// ==========================================
// NHÓM TRUY VẤN (READ)
// ==========================================

/**
 * @route   GET /api/v1/exams
 * @desc    Truy vấn danh sách bài thi (Phân trang & Bộ lọc).
 * @access  Private (Quyền: exams:read, exams:manage)
 */
router.get(
    '/', 
    requirePermission('exams:read'), 
    examController.list
);

// ==========================================
// NHÓM KHỞI TẠO (CREATE)
// ==========================================

/**
 * @route   POST /api/v1/exams/generate-auto 
 * @desc    Khởi tạo bài thi tự động (Bốc đề & Snapshot từ Ma trận).
 * @access  Private (Quyền: exams:manage)
 */
router.post(
    '/generate-auto', 
    requirePermission('exams:manage'), 
    examController.generate
);

/**
 * @route   POST /api/v1/exams/manual
 * @desc    Khởi tạo bài thi thủ công (Admin chỉ định danh sách câu hỏi).
 * @access  Private (Quyền: exams:manage)
 */
router.post(
    '/manual', 
    requirePermission('exams:manage'), 
    examController.createManual
);

// ==========================================
// NHÓM THAO TÁC DỮ LIỆU (UPDATE / DELETE)
// ==========================================

/**
 * @route   PATCH /api/v1/exams/:id
 * @desc    Cập nhật thông tin bài thi (Tên, trạng thái, điểm số).
 * @access  Private (Quyền: exams:manage)
 */
router.patch(
    '/:id', 
    requirePermission('exams:manage'), 
    examController.edit
);

/**
 * @route   DELETE /api/v1/exams/:id
 * @desc    Xóa mềm (Soft Delete) bài thi.
 * @access  Private (Quyền: exams:manage)
 */
router.delete(
    '/:id', 
    requirePermission('exams:manage'), 
    examController.delete
);

/**
 * @route   PATCH /api/v1/exams/:id/restore
 * @desc    Khôi phục bài thi đã xóa.
 * @access  Private (Quyền: exams:manage)
 */
router.patch(
    '/:id/restore', 
    requirePermission('exams:manage'), 
    examController.restore
);

export default router;