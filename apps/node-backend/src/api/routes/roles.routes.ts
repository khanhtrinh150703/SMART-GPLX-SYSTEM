import { container } from "@/shared/utils/container";
import { Router } from "express";
import { RoleController } from "../controllers/roles.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "@/domain/constants/roles.constant";

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
router.use(authorizeRoles(UserRole.ADMIN));

/**
 * @description Lấy danh sách vai trò rút gọn (ID và Name) phục vụ hiển thị trên các ô chọn (Dropdown/Selection).
 * @route GET /api/v1/roles/selection
 * @access Private (Admin Only)
 */
router.get('/selection', roleController.getSelectionList);


export default router;