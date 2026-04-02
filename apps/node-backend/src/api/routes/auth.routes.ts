import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * 💡 Giải phóng AuthController từ DI Container (Awilix).
 */
const authController = container.resolve('authController') as AuthController;

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

/**
 * API Khởi tạo đăng ký và gửi mã OTP qua Email.
 * @route POST /api/v1/auth/register/init
 */
router.post('/register/init', authController.signUpInit);

/**
 * API Xác thực OTP và hoàn tất tạo tài khoản mới.
 * @route POST /api/v1/auth/register/verify
 */
router.post('/register/verify', authController.signUpVerify);

/**
 * API Đăng nhập và cấp cặp mã thông báo Access/Refresh Token.
 * @route POST /api/v1/auth/login
 */
router.post('/login', authController.login);

/**
 * API Gửi lại mã OTP xác thực tài khoản.
 * @route POST /api/v1/auth/resend-otp
 */
router.post('/resend-otp', authController.resendOtp);

/**
 * API Đăng xuất và vô hiệu hóa mã thông báo hiện tại.
 * @route POST /api/v1/auth/logout
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * API Yêu cầu gửi mã OTP để khôi phục mật khẩu.
 * @route POST /api/v1/auth/forgot-password
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * API Xác thực OTP và thiết lập mật khẩu mới.
 * @route POST /api/v1/auth/reset-password
 */
router.post('/reset-password', authController.resetPassword);

export default router;