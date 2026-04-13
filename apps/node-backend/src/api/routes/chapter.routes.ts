import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ChapterController } from '../controllers/chapter.controller';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '@/domain/constants/roles.constant';

const router = Router();
const chapterController = container.resolve('chapterController') as ChapterController;

// ============================================================================
// CẤU HÌNH CHUNG: TẤT CẢ ROUTE TRONG MODULE ĐỀU CẦN AUTH
// ============================================================================
router.use(authMiddleware);

// ============================================================================
// NHÓM 1: QUYỀN HẠN CHIA SẺ (ADMIN & INSTRUCTOR)
// ============================================================================

/**
 * @description Lấy danh sách các chương học định dạng selection (value/label) cho dropdown.
 * @route GET /api/v1/chapters/selection
 * @access Private (Admin/Instructor)
 */
router.get(
  '/selection', 
  authorizeRoles(UserRole.ADMIN, UserRole.INSTRUCTOR), 
  chapterController.getChapterSelections
);

// ============================================================================
// NHÓM 2: CHỈ DÀNH CHO ADMIN (ADMIN ONLY SCOPE)
// ============================================================================
router.use(authorizeRoles(UserRole.ADMIN, UserRole.INSTRUCTOR));

/**
 * @description Lấy danh sách các chương học có hỗ trợ tìm kiếm và phân trang.
 * @route GET /api/v1/chapters
 * @access Public/Private (Yêu cầu đăng nhập)
 */
router.get('/', chapterController.list);

/**
 * @description Tạo mới một chương học lý thuyết.
 * @route POST /api/v1/chapters
 */
router.post('/', chapterController.create);

/**
 * Nhóm các hành động thao tác dựa trên ID ":id" để tối ưu đường dẫn.
 */
router.route('/:id')
  /**
   * @description Cập nhật thông tin chi tiết của một chương học theo ID.
   * @route PATCH /api/v1/chapters/:id
   */
  .patch(chapterController.update)
  
  /**
   * @description Xóa (xóa mềm) một chương học khỏi hệ thống.
   * @route DELETE /api/v1/chapters/:id
   */
  .delete(chapterController.delete);

/**
 * @description Khôi phục lại chương học đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/chapters/:id/restore
 */
router.patch('/:id/restore', chapterController.restore);

export default router;