import { createContainer, asValue, asClass, InjectionMode, asFunction, Constructor, Resolver } from 'awilix';

// --- 1. CORE INFRASTRUCTURE (DB, Client, Security) ---
import prisma from '../../../prisma/prisma';
import { redisClient } from '@/infrastructure/database/redis/redis.client';
import { JwtTokenManager } from '@/infrastructure/security/jwt-token.manager';
import { MasterDataCacheService } from '@/infrastructure/security/master-data-cache.service';
import { autoWrapRepository } from '@/infrastructure/repositories/repository-proxy';

// --- 2. REPOSITORIES (Data Access) ---
// Nhóm Identity (Kết hợp cả MySQL và Redis)
import {
    MySQLUserRepository,
    MySQLRoleRepository,
    MySQLUserRoleRepository,
    RedisTokenRepository,
    RedisPendingUserRepository,
    RedisOtpRepository
} from '@/infrastructure/repositories/identity';

// Nhóm Exam Management (Thuần MySQL)
import {
    MySQLChapterRepository,
    MySQLQuestionRepository,
    MySQLLicenseCategoryRepository
} from '@/infrastructure/repositories/exam-mgmt';

// Nhóm Exam Session (Xử lý thực thi bài thi)
import {
    MySQLExamRepository,
    MySQLExamMatrixRepository
} from '@/infrastructure/repositories/exam-session';

// Nhóm Integration (Xử lý dữ liệu ngoại vi)
import { MySQLImportRepository } from '@/infrastructure/repositories/integration';

// --- 3. SERVICES (Application Logic) ---
import {
    AuthService, UserService, RoleService, OtpService, RegistrationService
} from '@/application/services/identity';

// Nhóm Exam Management
import {
    ExamService, QuestionService, ChapterService, LicenseCategoryService
} from '@/application/services/exam-mgmt';

// Nhóm Exam Engine & Session
import { ExamGeneratorService } from '@/application/services/exam-engine';
import { ExamMatrixService } from '@/application/services/exam-session';

// Nhóm Integration
import {
    ImportService, ImportProcessorService, ExcelService, ZipService, MediaService
} from '@/application/services/integration';


// --- 2. TẦNG INFRASTRUCTURE (Triển khai kỹ thuật) ---
import { NodemailerService } from '@/application/services/external-services/mailer';
import { FileStorageService, TempStorageService } from '@/application/services/external-services/storage';


// --- 4. BACKGROUND TASKS (Queue & Worker) ---
import { ImportQueue } from '@/infrastructure/queues/import.queue';
import { ImportWorker } from '@/infrastructure/workers/import.worker';

// --- 5. API CONTROLLERS ---
import {
    AuthController,
    UserController,
    RoleController
} from "@/api/controllers/identity";

// Nhóm Exam Management
import {
    ChapterController,
    ExamController,
    LicenseCategoryController,
    QuestionController
} from "@/api/controllers/exam-mgmt";

// Nhóm Exam Session
import { ExamMatrixController } from "@/api/controllers/exam-session";

// Nhóm Integration
import { ImportController } from "@/api/controllers/integration";


// Service
/**
 * @description Helper để tự động bọc Repository bằng Proxy xử lý lỗi.
 * @param Class - Lớp Repository cần đăng ký.
 */
export const asRepo = <T extends object>(Class: Constructor<T>): Resolver<T> => {
    return asFunction((cradle) => {
        const instance = new Class(cradle);
        return autoWrapRepository<T>(instance);
    }).singleton();
};

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
    userRepository: asRepo(MySQLUserRepository),
    tokenRepository: asRepo(RedisTokenRepository),
    roleRepository: asRepo(MySQLRoleRepository),
    userRoleRepository: asRepo(MySQLUserRoleRepository),
    pendingUserRepository: asRepo(RedisPendingUserRepository),
    licenseCategoryRepository: asRepo(MySQLLicenseCategoryRepository),
    chapterRepository: asRepo(MySQLChapterRepository),
    questionRepository: asRepo(MySQLQuestionRepository),
    otpRepository: asRepo(RedisOtpRepository),
    importJobRepository: asRepo(MySQLImportRepository),
    examMatrixRepository: asRepo(MySQLExamMatrixRepository),
    examRepository: asRepo(MySQLExamRepository),

    // --- TẦNG TIỆN ÍCH & BẢO MẬT (SECURITY & EXTERNAL SERVICES) ---
    tokenManager: asClass(JwtTokenManager).singleton(),
    emailService: asClass(NodemailerService).singleton(),
    fileStorageService: asClass(FileStorageService).singleton(),
    tempStorageService: asClass(TempStorageService).singleton(),

    // --- TẦNG NGHIỆP VỤ (APPLICATION LAYER - SERVICES) ---
    userService: asClass(UserService).singleton(),
    authService: asClass(AuthService).singleton(),
    licenseCategoryService: asClass(LicenseCategoryService).singleton(),
    registrationService: asClass(RegistrationService).singleton(),
    otpService: asClass(OtpService).singleton(),
    chapterService: asClass(ChapterService).singleton(),
    roleService: asClass(RoleService).singleton(),
    questionService: asClass(QuestionService).singleton(),
    importService: asClass(ImportService).singleton(),
    zipService: asClass(ZipService).singleton(),
    examMatrixService: asClass(ExamMatrixService).singleton(),
    excelService: asClass(ExcelService).singleton(),
    importProcessorService: asClass(ImportProcessorService).singleton(),
    importQueue: asClass(ImportQueue).singleton(),
    importWorker: asClass(ImportWorker).singleton(),
    examService: asClass(ExamService).singleton(),
    examGeneratorService: asClass(ExamGeneratorService).singleton(),
    masterDataCacheService: asClass(MasterDataCacheService).singleton(),
    mediaService: asClass(MediaService).singleton(),

    // --- TẦNG GIAO TIẾP (API LAYER - CONTROLLERS) ---
    userController: asClass(UserController).singleton(),
    roleController: asClass(RoleController).singleton(),
    authController: asClass(AuthController).singleton(),
    licenseCategoryController: asClass(LicenseCategoryController).singleton(),
    chapterController: asClass(ChapterController).singleton(),
    questionController: asClass(QuestionController).singleton(),
    importController: asClass(ImportController).singleton(),
    examMatrixController: asClass(ExamMatrixController).singleton(),
    examController: asClass(ExamController).singleton(),

});