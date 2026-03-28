import { AuthController } from "@/api/controllers/auth.controller";
import { UserController } from "@/api/controllers/user.controller";
import { AuthService } from "@/application/services/auth.service";
import { OtpService } from "@/application/services/otp.service";
import { RegistrationService } from "@/application/services/registration.service";
import { RoleService } from "@/application/services/role.service";
import { UserService } from "@/application/services/user.service";
import { IEmailService } from "@/domain/interfaces/external/i-email.service";
import { ITokenManager } from "@/domain/interfaces/external/i-token-manager";
import { IOtpRepository } from "@/domain/interfaces/repositories/i-otp.repository";
import { IPendingUserRepository } from "@/domain/interfaces/repositories/i-pending-user.repository";
import { IRoleRepository } from "@/domain/interfaces/repositories/i-role.repository";
import { ITokenRepository } from "@/domain/interfaces/repositories/i-token.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { PrismaClient } from "@prisma/client";
import { Redis } from 'ioredis';
// Định nghĩa tất cả những thứ sẽ nằm trong Container
export interface ICradle {
    // Infrastructure
    prisma: PrismaClient;
    redisClient: Redis;
    userRepository: IUserRepository;
    otpRepository: IOtpRepository;
    tokenRepository: ITokenRepository;
    roleRepository: IRoleRepository;
    emailService: IEmailService;
    pendingUserRepository: IPendingUserRepository,
    // Managers
    tokenManager: ITokenManager;

    // Services
    userService: UserService;
    otpService: OtpService;
    authService: AuthService;
    registrationService: RegistrationService;
    roleService: RoleService,

    // Controllers
    authController: AuthController;
    userController: UserController;
}// Định nghĩa tất cả những thứ sẽ nằm trong Container
