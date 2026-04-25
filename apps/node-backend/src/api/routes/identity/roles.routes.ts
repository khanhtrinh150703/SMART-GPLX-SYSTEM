import { Router } from "express";

// 1. Controller (Gom từ index của identity)
import { RoleController } from "@/api/controllers/identity";

// 2. Middlewares (Gom từ nhóm bảo mật của identity)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";

// 3. DI Container
import { container } from "@/shared/utils/container";
const router = Router();

/**
 * Resolve Controller từ DI Container.
 */
const roleController = container.resolve('roleController') as RoleController;

// ============================================================================
// CẤU HÌNH MIDDLEWARE CHUNG (ADMIN ONLY SCOPE)
// ============================================================================

/** * Module quản lý Role là tài nguyên nhạy cảm.
 * Tất cả các route trong file này mặc định yêu cầu Login + quyền ADMIN.
 */
router.use(authMiddleware);
router.use(requirePermission('roles:manage'));

/**
 * @description Lấy danh sách vai trò rút gọn (ID và Name) phục vụ hiển thị trên các ô chọn (Dropdown/Selection).
 * @route GET /api/v1/roles/selection
 * @access Private (Admin Only)
 */
router.get('/selection', roleController.getSelectionList);


export default router;