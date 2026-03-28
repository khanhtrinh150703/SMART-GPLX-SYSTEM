import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
// import { jwtUtil } from '@/shared/utils/jwt.util';
// import { PrismaClient } from '@prisma/client';
import { UserController } from '@/api/controllers/user.controller';
import { UserService } from '@/application/services/user.service';
import { RoleService } from '@/application/services/role.service';
import { JwtTokenManager } from '@/infrastructure/security/jwt-token.manager';
import { MySQLRoleRepository } from '@/infrastructure/repositories/mysql/role.repository';
import { RedisTokenRepository } from '@/infrastructure/repositories/redis/redis-token.repository';
import { MySQLUserRepository } from '@/infrastructure/repositories/mysql/user.repository';
import { AuthController } from '@/api/controllers/auth.controller';
import { AuthService } from '@/application/services/auth.service';
import { RegistrationService } from '@/application/services/registration.service';
import { RedisPendingUserRepository } from '@/infrastructure/repositories/redis/redis-pending-user.repository';
import { NodemailerService } from '@/infrastructure/external-services/mailer/mailer.service';
import { RedisOtpRepository } from '@/infrastructure/repositories/redis/redis-otp.repository';
import prisma from '../../../prisma/prisma';
import { redisClient } from '@/infrastructure/database/redis/redis.client';
import { OtpService } from '@/application/services/otp.service';

// 1. Khởi tạo container
export const container = createContainer({
    injectionMode: InjectionMode.PROXY, // Dùng Proxy để dễ lấy dữ liệu
});

// 2. Đăng ký các "linh kiện" vào kho
container.register({
    prisma: asValue(prisma),
    redisClient: asValue(redisClient),

    // 1. Tầng thấp nhất (Repo)
    userRepository: asClass(MySQLUserRepository).singleton(),
    tokenRepository: asClass(RedisTokenRepository).singleton(),
    roleRepository: asClass(MySQLRoleRepository).singleton(),
    pendingUserRepository: asClass(RedisPendingUserRepository).singleton(),
    otpRepository: asClass(RedisOtpRepository).singleton(),

    // 2. Tầng trung gian (Manager/Service phụ)
    tokenManager: asClass(JwtTokenManager).singleton(),

    // 3. Tầng nghiệp vụ (UserService cần UserRepo, TokenManager, RoleService)
    userService: asClass(UserService).singleton(),
    authService: asClass(AuthService).singleton(),
    registrationService: asClass(RegistrationService).singleton(),
    otpService: asClass(OtpService).singleton(),
    roleService: asClass(RoleService).singleton(),
    emailService: asClass(NodemailerService).singleton(),

    // 4. Tầng API (UserController cần UserService)
    userController: asClass(UserController).singleton(),
    authController: asClass(AuthController).singleton(),

});