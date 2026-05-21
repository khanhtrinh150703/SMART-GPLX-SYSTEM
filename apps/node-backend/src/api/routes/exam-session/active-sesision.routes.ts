import { Router } from "express";

// 1. Middlewares (Quản lý bảo mật và định danh)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";

// 2. DI Container
import { container } from "@/shared/utils/container";

const router = Router();

/** @description Bộ điều khiển tiếp nhận, điều phối và xử lý các trạng thái phiên làm việc (session) đang hoạt động của người dùng. */
const controller = container.cradle.activeSessionController;

/**
 * --- NHÓM 1: GUEST ROUTES (PUBLIC) ---
 * Nhóm này cho phép Khách thi thử. Service sẽ tự động nhận diện 
 * và KHÔNG lưu lịch sử vào MongoDB/MySQL.
 */

/**
 * @description Khởi tạo phiên thi thử dành cho Khách.
 * @route POST /api/v1/active-sessions/guest/start
 * @access Public (No Token)
 */
router.post(
    '/guest/start', 
    controller.startSession
);

/**
 * --- NHÓM 2: PROTECTED ROUTES (PRIVATE) ---
 * Yêu cầu người dùng đăng nhập để thực hiện các chức năng lưu vết.
 */
router.use(authMiddleware);

/**
 * @description Kiểm tra xem người dùng hiện tại có phiên làm bài dở dang không.
 * @route GET /api/v1/active-sessions/current
 * @access Private (User)
 */
router.get(
    '/current',
    requirePermission('active-sessions:read'),
    controller.getCurrentSession
);

/**
 * @description Bắt đầu phiên thi chính thức cho Học viên. Lưu vết bản nháp vào NoSQL.
 * @route POST /api/v1/active-sessions/start
 * @access Private (User)
 */
router.post(
    '/start',
    requirePermission('active-sessions:write'),
    controller.startSession
);

/**
 * @description Đồng bộ (Backup) đáp án của Học viên lên NoSQL theo thời gian thực.
 * @route PATCH /api/v1/active-sessions/sync
 * @access Private (User)
 * @returns {Promise<void>} Phản hồi SESSION_SYNC_SUCCESS.
 */
router.patch(
    '/sync',
    requirePermission('active-sessions:write'),
    controller.syncAnswers
);

/**
 * @description Xóa (Hủy) phiên làm bài đang hoạt động của Học viên.
 * @route DELETE /api/v1/active-sessions/current
 * @access Private (User)
 * @returns {Promise<void>} Phản hồi SESSION_DELETE_SUCCESS.
 */
router.delete(
    '/current', 
    requirePermission('active-sessions:delete'), 
    controller.deleteSession
);

export default router;