import { Router } from 'express';

// ============================================================================
// 1. IMPORTS
// ============================================================================
// Controllers
import { AuthController } from '../controllers/auth.controller';

// Services
import { AuthService } from '@/application/services/auth.service';
import { RegistrationService } from '@/application/services/registration.service';
import { UserService } from '@/application/services/user.service';
import { OtpService } from '@/application/services/otp.service';

// Repositories & External Services (Các class thực thi)
import { UserRepository } from '@/infrastructure/repositories/mysql/user.repository';
// SỬA LỖI: Nhập đúng 2 kho lưu trữ Redis đã được chia tách
import { RedisOtpRepository } from '@/infrastructure/repositories/redis/redis-otp.repository';
import { RedisPendingUserRepository } from '@/infrastructure/repositories/redis/redis-pending-user.repository';
import { NodemailerService } from '@/infrastructure/external-services/mailer/mailer.service';

// Interfaces (Dùng để ép kiểu)
import { IUserRepository } from '@/domain/interfaces/repositories/i-user.repository';
// SỬA LỖI: Nhập đúng 2 Interface tương ứng
import { IOtpRepository } from '@/domain/interfaces/repositories/i-otp.repository';
import { IPendingUserRepository } from '@/domain/interfaces/repositories/i-pending-user.repository';
import { IEmailService } from '@/domain/interfaces/services/i-email.service';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';
import { RedisTokenRepository } from '@/infrastructure/repositories/redis/redis-token.repository';
// import { authMiddleware } from '../middlewares/auth.middleware';

// ============================================================================
// 2. KHỞI TẠO DEPENDENCIES (DI Container)
// ============================================================================
const router = Router();

// Tầng Infrastructure
const userRepo: IUserRepository = new UserRepository();
const otpRepo: IOtpRepository = new RedisOtpRepository();
const pendingUserRepo: IPendingUserRepository = new RedisPendingUserRepository(); // Thêm Repo này
const mailerProvider: IEmailService = new NodemailerService();
const tokenRepo: ITokenRepository = new RedisTokenRepository();

// Tầng Service (Cơ sở)
const userService = new UserService(userRepo);
const otpService = new OtpService(otpRepo, mailerProvider);

// Tầng Service (Nghiệp vụ chính)
const authService = new AuthService(userService, tokenRepo);

// SỬA LỖI: Truyền thêm pendingUserRepo vào RegistrationService theo đúng thiết kế mới
const registrationService = new RegistrationService(
  userService,
  otpService,
  pendingUserRepo
);

// Tầng Controller
const authController = new AuthController(authService, registrationService);

// ============================================================================
// 3. ĐỊNH NGHĨA ROUTES
// ============================================================================
router.post('/register/init', authController.signUpInit.bind(authController));
router.post('/register/verify', authController.signUpVerify.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/resend-otp', authController.resendOtp.bind(authController));

export default router;