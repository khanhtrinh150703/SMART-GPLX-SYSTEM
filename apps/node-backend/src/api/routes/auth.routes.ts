import { Router } from 'express';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '@/application/services/auth.service';
import { RegistrationService } from '@/application/services/registration.service';
import { UserService } from '@/application/services/user.service';
import { OtpService } from '@/application/services/otp.service';

import { UserRepository } from '@/infrastructure/repositories/mysql/user.repository';
import { RedisOtpRepository } from '@/infrastructure/repositories/redis/redis-otp.repository';
import { RedisPendingUserRepository } from '@/infrastructure/repositories/redis/redis-pending-user.repository';
import { NodemailerService } from '@/infrastructure/external-services/mailer/mailer.service';
import { RedisTokenRepository } from '@/infrastructure/repositories/redis/redis-token.repository';

import { IUserRepository } from '@/domain/interfaces/repositories/i-user.repository';
import { IOtpRepository } from '@/domain/interfaces/repositories/i-otp.repository';
import { IPendingUserRepository } from '@/domain/interfaces/repositories/i-pending-user.repository';
import { IEmailService } from '@/domain/interfaces/services/i-email.service';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';

import { authMiddleware } from '../middlewares/auth.middleware';
import { redisClient } from '@/infrastructure/database/redis/redis.client';
import { ITokenManager } from '@/domain/interfaces/services/i-token-manager';
import { JwtTokenManager } from '@/infrastructure/security/jwt-token.manager';

const router = Router();

// ============================================================================
// 2. KHỞI TẠO DEPENDENCIES (DI Container)
// ============================================================================
// Infrastructure
// --- 1. Tầng Infrastructure (Các lớp thực thi thô) ---
const userRepo: IUserRepository = new UserRepository();
const otpRepo: IOtpRepository = new RedisOtpRepository(redisClient);
const pendingUserRepo: IPendingUserRepository = new RedisPendingUserRepository();
const mailerProvider: IEmailService = new NodemailerService();
const tokenRepo: ITokenRepository = new RedisTokenRepository();

// --- 2. Tầng Security/Manager (Bộ não xử lý logic Token) ---
// PHẢI CÓ BƯỚC NÀY: Manager cầm cái Repo để điều phối
const tokenManger: ITokenManager = new JwtTokenManager(tokenRepo);

// --- 3. Tầng Service (Nghiệp vụ - Chỉ nhận Manager, không nhận Repo của Token) ---
// SỬA TẠI ĐÂY: Truyền tokenManger thay vì tokenRepo
const userService = new UserService(userRepo, tokenManger);
const otpService = new OtpService(otpRepo, mailerProvider);

// AuthService cũng cần Manager để tạo Token khi Login và xóa khi Logout
const registrationService = new RegistrationService(userService, otpService, pendingUserRepo);

const authService = new AuthService(userService, tokenManger, otpService);


// --- 4. Tầng Controller ---
const authController = new AuthController(authService, registrationService);

// ============================================================================
// 3. ĐỊNH NGHĨA ROUTES (HẾT LỖI ĐỎ)
// ============================================================================

// Các route công khai (Sử dụng Request chuẩn)
router.post('/register/init', authController.signUpInit);
router.post('/register/verify', authController.signUpVerify);
router.post('/login', authController.login);
router.post('/resend-otp', authController.resendOtp);
router.post('/logout', authMiddleware, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;