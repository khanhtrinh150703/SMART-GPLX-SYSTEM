import { AuthController } from "@/api/controllers/auth.controller";
import { LicenseCategoryController } from "@/api/controllers/license-category.controller";
import { UserController } from "@/api/controllers/user.controller";
import { AuthService } from "@/application/services/auth.service";
import { LicenseCategoryService } from "@/application/services/license-category.service";
import { OtpService } from "@/application/services/otp.service";
import { RegistrationService } from "@/application/services/registration.service";
import { RoleService } from "@/application/services/role.service";
import { UserService } from "@/application/services/user.service";
import { IEmailService } from "@/domain/interfaces/external/i-email.service";
import { IFileStorageService } from "@/domain/interfaces/external/i-file-storage.service";
import { ITokenManager } from "@/domain/interfaces/external/i-token-manager";
import { IOtpRepository } from "@/domain/interfaces/repositories/i-otp.repository";
import { IPendingUserRepository } from "@/domain/interfaces/repositories/i-pending-user.repository";
import { IRoleRepository } from "@/domain/interfaces/repositories/i-role.repository";
import { ITokenRepository } from "@/domain/interfaces/repositories/i-token.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { ILicenseCategoryRepository } from "@/domain/interfaces/repositories/i-license-category-repository";
import { PrismaClient } from "@prisma/client";
import { Redis } from 'ioredis';
import { IChapterRepository } from "@/domain/interfaces/repositories/i-chapter.repository";
import { ChapterService } from "@/application/services/chapter.service";
import { ChapterController } from "@/api/controllers/chapter.controller";
import { QuestionService } from "@/application/services/question.service";
import { IQuestionRepository } from "@/domain/interfaces/repositories/i-question.repository";
import { QuestionController } from "@/api/controllers/question.controller";

/**
 * @description Định nghĩa cấu trúc "Cradle" chứa toàn bộ các phụ thuộc (Dependencies) của hệ thống.
 * Được sử dụng bởi Awilix để tự động inject vào constructor của các class thông qua cơ chế Proxy.
 */
export interface ICradle {
    // --- HẠ TẦNG & CƠ SỞ DỮ LIỆU (INFRASTRUCTURE) ---

    /** @description Client ORM Prisma để tương tác với cơ sở dữ liệu MySQL. */
    prisma: PrismaClient;

    /** @description Client Ioredis để tương tác với máy chủ lưu trữ đệm Redis. */
    redisClient: Redis;

    /** @description Repository quản lý dữ liệu người dùng (MySQL). */
    userRepository: IUserRepository;

    /** @description Repository quản lý mã OTP (Redis). */
    otpRepository: IOtpRepository;

    /** @description Repository quản lý danh sách trắng/đen của Tokens (Redis). */
    tokenRepository: ITokenRepository;

    /** @description Repository quản lý vai trò và phân quyền (MySQL). */
    roleRepository: IRoleRepository;

    /** @description Repository quản lý danh mục hạng bằng lái (MySQL). */
    licenseCategoryRepository: ILicenseCategoryRepository;

    /** @description Repository quản lý chapter hạng bằng lái (MySQL). */
    chapterRepository: IChapterRepository;

    /** @description Repository quản lý câu hỏi hạng bằng lái (MySQL). */
    questionRepository: IQuestionRepository;

    /** @description Dịch vụ gửi Email (Nodemailer/External API). */
    emailService: IEmailService;

    /** @description Repository lưu trữ thông tin đăng ký người dùng tạm thời (Redis). */
    pendingUserRepository: IPendingUserRepository;

    // --- QUẢN LÝ KỸ THUẬT (MANAGERS) ---

    /** @description Quản lý vòng đời JWT, ký và xác thực mã thông báo. */
    tokenManager: ITokenManager;

    // --- NGHIỆP VỤ ỨNG DỤNG (APPLICATION SERVICES) ---

    /** @description Điều phối nghiệp vụ liên quan đến người dùng và hồ sơ cá nhân. */
    userService: UserService;

    /** @description Xử lý logic sinh mã, gửi và xác thực OTP. */
    otpService: OtpService;

    /** @description Điều phối luồng xác thực, đăng nhập và bảo mật tài khoản. */
    authService: AuthService;

    /** @description Quản lý nghiệp vụ cho các loại hạng bằng lái. */
    licenseCategoryService: LicenseCategoryService;

    /** @description Quản lý nghiệp vụ cho các loại hạng bằng lái. */
    chapterService: ChapterService;

    /** @description Quản lý nghiệp vụ cho câu hỏi. */
    questionService: QuestionService;

    /** @description Điều phối quy trình đăng ký tài khoản người dùng mới. */
    registrationService: RegistrationService;

    /** @description Quản lý nghiệp vụ liên quan đến vai trò hệ thống. */
    roleService: RoleService;

    /** @description Dịch vụ quản lý và lưu trữ tệp tin (Local/Cloud Storage). */
    fileStorageService: IFileStorageService;

    // --- GIAO TIẾP API (CONTROLLERS) ---

    /** @description Xử lý các yêu cầu HTTP liên quan đến xác thực (Auth). */
    authController: AuthController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến người dùng (User). */
    userController: UserController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến hạng bằng lái. */
    licenseCategoryController: LicenseCategoryController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến hạng bằng lái. */
    chapterController: ChapterController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến câu hỏi. */
    quenstionController: QuestionController;
}