import { Router } from 'express';
import { container } from '@/shared/utils/container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * Resolve AuthController từ DI Container (Awilix).
 */
const authController = container.resolve('authController') as AuthController;

// ============================================================================
// 1. FLOW ĐĂNG KÝ (SIGNUP/REGISTER)
// ============================================================================

/**
 * @description Khởi tạo quá trình đăng ký tài khoản và gửi mã OTP xác thực qua Email.
 * @route POST /api/v1/auth/register/init
 * @access Public
 */
router.post('/register/init', authController.signUpInit);

/**
 * @description Xác thực mã OTP và hoàn tất quá trình tạo tài khoản người dùng mới.
 * @route POST /api/v1/auth/register/verify
 * @access Public
 */
router.post('/register/verify', authController.signUpVerify);

/**
 * @description Gửi lại mã OTP xác thực trong trường hợp người dùng chưa nhận được hoặc mã hết hạn.
 * @route POST /api/v1/auth/resend-otp
 * @access Public
 */
router.post('/resend-otp', authController.resendOtp);

// ============================================================================
// 2. FLOW ĐĂNG NHẬP & QUẢN LÝ TOKEN (SESSION MANAGEMENT)
// ============================================================================

/**
 * @description Đăng nhập hệ thống và cấp cặp mã thông báo Access Token & Refresh Token.
 * @route POST /api/v1/auth/login
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @description Cấp mới Access Token bằng Refresh Token khi mã cũ đã hết hạn.
 * @route POST /api/v1/auth/refresh-token
 * @access Public (Requires Refresh Token in Body/Cookie)
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @description Đăng xuất, vô hiệu hóa Access Token và xóa session/refresh token tương ứng.
 * @route POST /api/v1/auth/logout
 * @access Private (Authenticated User)
 */
router.post('/logout', authMiddleware, authController.logout);

// ============================================================================
// 3. FLOW QUÊN MẬT KHẨU (PASSWORD RECOVERY)
// ============================================================================

/**
 * @description Yêu cầu khôi phục mật khẩu bằng cách gửi mã OTP xác nhận qua Email.
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @description Xác thực OTP và thiết lập mật khẩu mới cho người dùng.
 * @route POST /api/v1/auth/reset-password
 * @access Public
 */
router.post('/reset-password', authController.resetPassword);

export default router;