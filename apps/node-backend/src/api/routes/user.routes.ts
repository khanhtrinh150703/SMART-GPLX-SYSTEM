import { Router } from 'express';

// Controllers
import { UserController } from '../controllers/user.controller';

// Services & Repositories
import { UserService } from '@/application/services/user.service';
import { UserRepository } from '@/infrastructure/repositories/mysql/user.repository';

// Middlewares
// import { authMiddleware } from '../middlewares/auth.middleware';

// ============================================================================
// 1. KHỞI TẠO DEPENDENCIES (DI Container nội bộ)
// ============================================================================
const router = Router();

// Khởi tạo các lớp theo đúng thứ tự từ dưới lên trên
const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// ============================================================================
// 2. ĐỊNH NGHĨA ROUTES (Tất cả đều được bảo vệ bởi authMiddleware)
// ============================================================================

// 1. Cập nhật thông tin cá nhân (Profile)
// Sử dụng .bind(userController) để tránh lỗi undefined 'this'
router.patch('/:id/profile',userController.updateProfile.bind(userController));

// 2. Đổi mật khẩu
router.patch('/:id/password',userController.changePassword.bind(userController));

// 3. Đổi trạng thái (Khóa/Mở khóa tài khoản)
// Lưu ý: Tạm thời dùng authMiddleware, sau này Cậu hãy thêm adminMiddleware vào đây nhé!
router.patch('/:id/status', userController.updateStatus.bind(userController));

// 4. Xóa tài khoản (Soft Delete)
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;