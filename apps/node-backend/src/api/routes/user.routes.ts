import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

// 1. Cập nhật thông tin cá nhân (Profile)
// Dùng PATCH vì chúng ta chỉ cập nhật một phần dữ liệu (chỉ update tên hoặc ảnh)
router.patch('/:id/profile', UserController.updateProfile);

// 2. Đổi mật khẩu
router.patch('/:id/password', UserController.changePassword);

// 3. Đổi trạng thái (Khóa/Mở khóa tài khoản) - Sau này cần thêm middleware check quyền Admin ở đây
router.patch('/:id/status', UserController.updateStatus);

// 4. Xóa tài khoản (Soft Delete)
// Dùng DELETE cho đúng chuẩn ngữ nghĩa của RESTful API
router.delete('/:id', UserController.deleteUser);

export default router;