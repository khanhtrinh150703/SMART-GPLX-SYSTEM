import { Router } from 'express';

// ============================================================================
// 1. IMPORTS
// ============================================================================
// Controllers
import { UserController } from '../controllers/user.controller';

// Services
import { UserService } from '@/application/services/user.service';

// Repositories
import { UserRepository } from '@/infrastructure/repositories/mysql/user.repository';

// Middlewares
import { authMiddleware } from '../middlewares/auth.middleware';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';
import { RedisTokenRepository } from '@/infrastructure/repositories/redis/redis-token.repository';
import { IUserRepository } from '@/domain/interfaces/repositories/i-user.repository';
import { ITokenManager } from '@/domain/interfaces/services/i-token-manager';
import { JwtTokenManager } from '@/infrastructure/security/jwt-token.manager';

// ============================================================================
// 2. KHỞI TẠO DEPENDENCIES (DI Container nội bộ)
// ============================================================================
const router = Router();

// --- Tầng Infrastructure (Cái kho) ---
const userRepo: IUserRepository = new UserRepository();
const tokenRepo: ITokenRepository = new RedisTokenRepository();

// --- Tầng Security/Service (Bộ não) ---
// CHÍNH XÁC: Phải tạo Manager và truyền Repo vào đây
const tokenManager: ITokenManager = new JwtTokenManager(tokenRepo);

// --- Tầng Application (Nghiệp vụ) ---
// Bây giờ truyền Manager (chứ không phải Repo) vào UserService
const userService = new UserService(userRepo, tokenManager);

// --- Tầng API (Giao tiếp) ---
const userController = new UserController(userService);

// ============================================================================
// 3. ĐỊNH NGHĨA ROUTES
// ============================================================================

/**
 * NHÓM 1: CÁC ROUTE CÁ NHÂN (Dành cho chính chủ tài khoản)
 * Tất cả đều bắt buộc qua authMiddleware.
 * Controller sẽ lấy ID từ TokenPayload (req.user.userId) thay vì tin vào params.
 */

// Cập nhật thông tin cá nhân
router.patch(
  '/me/profile',
  authMiddleware,
  userController.updateProfile
);

// Đổi mật khẩu (Sử dụng route /me để khẳng định tính chính chủ)
router.patch(
  '/me/password',
  authMiddleware,
  userController.changePassword
);

// ----------------------------------------------------------------------------

/**
 * NHÓM 2: CÁC ROUTE QUẢN TRỊ (Dành cho Admin/Moderator)
 * Cần authMiddleware và sau này là roleMiddleware (Admin).
 */

// Đổi trạng thái (Khóa/Mở khóa tài khoản bất kỳ qua ID)
router.patch(
  '/:id/status',
  authMiddleware,
  userController.updateStatus
);

// Xóa tài khoản (Soft Delete)
router.delete(
  '/:id',
  authMiddleware,
  userController.deleteUser
);

// Khôi phục tài khoản đã xóa
router.patch(
  '/:id/restore',
  authMiddleware,
  userController.restoreUser
);

export default router;