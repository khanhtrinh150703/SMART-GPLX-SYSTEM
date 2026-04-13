import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { UserController } from '@/api/controllers/user.controller';
import { UserService } from '@/application/services/user.service';
import { RoleService } from '@/application/services/role.service';
import { LicenseCategoryService } from "@/application/services/license-category.service";
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
import { FileStorageService } from '@/infrastructure/external-services/file-storage.service';
import { LicenseCategoryController } from '@/api/controllers/license-category.controller';
import { MySQLLicenseCategoryRepository } from '@/infrastructure/repositories/mysql/license-category.repository';
import { MySQLChapterRepository } from '@/infrastructure/repositories/mysql/chapter.repository';
import { ChapterService } from '@/application/services/chapter.service';
import { ChapterController } from '@/api/controllers/chapter.controller';
import { MySQLQuestionRepository } from '@/infrastructure/repositories/mysql/question.repository';
import { QuestionService } from '@/application/services/question.service';
import { QuestionController } from '@/api/controllers/question.controller';
import { RoleController } from '@/api/controllers/roles.controller';
import { MySQLUserRoleRepository } from '@/infrastructure/repositories/mysql/user-role.repository';

/**
 * @description Khởi tạo Dependency Injection (DI) Container sử dụng thư viện Awilix.
 * Cơ chế PROXY được kích hoạt để hỗ trợ tự động giải quyết (resolve) các phụ thuộc linh hoạt thông qua ICradle.
 */
export const container = createContainer({
    injectionMode: InjectionMode.PROXY,
});

/**
 * @description Đăng ký toàn bộ các thành phần (Dependencies) vào Container theo mô hình phân tầng (Layered Architecture).
 * Tất cả các Class được đăng ký dưới dạng Singleton để tối ưu hóa hiệu năng và duy trì trạng thái nhất quán.
 */
container.register({
    // --- TẦNG CƠ SỞ (DATA SOURCES & CLIENTS) ---
    prisma: asValue(prisma),
    redisClient: asValue(redisClient),

    // --- TẦNG HẠ TẦNG (INFRASTRUCTURE LAYER - REPOSITORIES) ---
    userRepository: asClass(MySQLUserRepository).singleton(),
    tokenRepository: asClass(RedisTokenRepository).singleton(),
    roleRepository: asClass(MySQLRoleRepository).singleton(),
    userRoleRepository: asClass(MySQLUserRoleRepository).singleton(),
    pendingUserRepository: asClass(RedisPendingUserRepository).singleton(),
    licenseCategoryRepository: asClass(MySQLLicenseCategoryRepository).singleton(),
    chapterRepository: asClass(MySQLChapterRepository).singleton(),
    questionRepository: asClass(MySQLQuestionRepository).singleton(),
    otpRepository: asClass(RedisOtpRepository).singleton(),

    // --- TẦNG TIỆN ÍCH & BẢO MẬT (SECURITY & EXTERNAL SERVICES) ---
    tokenManager: asClass(JwtTokenManager).singleton(),
    emailService: asClass(NodemailerService).singleton(),
    fileStorageService: asClass(FileStorageService).singleton(),

    // --- TẦNG NGHIỆP VỤ (APPLICATION LAYER - SERVICES) ---
    userService: asClass(UserService).singleton(),
    authService: asClass(AuthService).singleton(),
    licenseCategoryService: asClass(LicenseCategoryService).singleton(),
    registrationService: asClass(RegistrationService).singleton(),
    otpService: asClass(OtpService).singleton(),
    chapterService: asClass(ChapterService).singleton(),
    roleService: asClass(RoleService).singleton(),
    questionService: asClass(QuestionService).singleton(),


    // --- TẦNG GIAO TIẾP (API LAYER - CONTROLLERS) ---
    userController: asClass(UserController).singleton(),
    roleController: asClass(RoleController).singleton(),
    authController: asClass(AuthController).singleton(),
    licenseCategoryController: asClass(LicenseCategoryController).singleton(),
    chapterController: asClass(ChapterController).singleton(),
    questionController: asClass(QuestionController).singleton(),
});