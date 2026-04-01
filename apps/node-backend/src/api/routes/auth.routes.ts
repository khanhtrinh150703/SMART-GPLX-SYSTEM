import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Lấy Controller ra từ kho (Đã có sẵn kiểu dữ liệu nhờ ICradle)
const authController = container.resolve('authController') as AuthController;

router.post('/register/init', authController.signUpInit);
router.post('/register/verify', authController.signUpVerify);
router.post('/login', authController.login);
router.post('/resend-otp', authController.resendOtp);
router.post('/logout', authMiddleware, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;