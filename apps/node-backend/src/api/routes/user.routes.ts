import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// 💡 PHÉP MÀU Ở ĐÂY: Cậu chỉ cần gọi đúng cái "ngọn" là UserController
// Container sẽ tự động đi tìm UserService -> TokenManager -> Repo... để tự 'new' cho cậu.
const userController = container.resolve('userController') as UserController;

// ============================================================================
// ĐỊNH NGHĨA ROUTES (Gọn gàng như một bức tranh)
// ============================================================================

// Nhóm 1: Cá nhân
router.patch('/me/profile', authMiddleware, upload.single('pictureFile'),  userController.updateProfile);
router.patch('/me/password', authMiddleware, userController.changePassword);

// Nhóm 2: Quản trị
router.get('', authMiddleware, userController.getUsers);
router.patch('/:id/status', authMiddleware, userController.updateStatus);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.patch('/:id/restore', authMiddleware, userController.restoreUser);
router.patch('/admin/:id', authMiddleware, upload.single('pictureFile') , userController.updateProfileAdmin);


export default router;