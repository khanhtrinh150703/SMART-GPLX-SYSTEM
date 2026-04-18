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
import { RoleController } from "@/api/controllers/roles.controller";
import { IUserRoleRepository } from "@/domain/interfaces/repositories/i-user-role.repository";
import { IImportJobRepository } from "@/domain/interfaces/repositories/i-import-job.repository";
import { ITempStorageService } from "@/domain/interfaces/external/i-temp-storage.service";
import { ImportController } from "@/api/controllers/import.controller";
import { ImportService } from "@/application/services/import.service";
import { IZipService } from "@/domain/interfaces/services/i-zip.service";
import { IExcelService } from "@/domain/interfaces/services/i-excel.service";
import { IImportProcessorService } from "@/domain/interfaces/services/i-import-processor.service";
import { IImportQueue } from "@/domain/interfaces/queues/i-import.queue";
import { ImportWorker } from "@/infrastructure/workers/import.worker";

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

    /** @description Repository quản lý mối quan hệ giữa người dùng và vai trò (Bảng trung gian). */
    userRoleRepository: IUserRoleRepository;

    /** @description Kho lưu trữ và quản trị trạng thái các phiên nhập dữ liệu (Persistence/Database). */
    importJobRepository: IImportJobRepository;

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

    /** @description Dịch vụ điều phối và quản lý toàn bộ tiến trình nhập liệu (Import Orchestration). */
    importService: ImportService;

    /** @description Dịch vụ quản lý và lưu trữ tệp tin (Local/Cloud Storage). */
    fileStorageService: IFileStorageService;

    /** @description Dịch vụ xử lý tệp tin tạm thời trên ổ đĩa cục bộ (Local Disk), quản lý các mảnh tệp (Chunks). */
    tempStorageService: ITempStorageService;

    /** @description Dịch vụ nén và giải nén tệp tin (Zip/Unzip), xử lý các gói dữ liệu lưu trữ. */
    zipService: IZipService;

    /** @description Dịch vụ đọc, phân tích và trích xuất dữ liệu từ các tệp tin bảng tính (Excel, CSV). */
    excelService: IExcelService;

    /** @description Dịch vụ lõi điều phối toàn bộ quy trình hậu xử lý nhập liệu (Giải nén -> Đọc dữ liệu -> Lưu trữ). */
    importProcessorService: IImportProcessorService;

    /** @description Hệ thống hàng đợi quản lý và điều phối các tác vụ nhập liệu chạy ngầm (Job Producer). */
    importQueue: IImportQueue;

    /** @description Trình xử lý tác vụ chạy ngầm (Background Worker) thực thi các Job lấy từ hàng đợi nhập liệu (Job Consumer). */
    importWorker: ImportWorker;

    // --- GIAO TIẾP API (CONTROLLERS) ---

    /** @description Xử lý các yêu cầu HTTP liên quan đến xác thực (Auth). */
    authController: AuthController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến người dùng (User). */
    userController: UserController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến vai trò (Roles). */
    roleController: RoleController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến hạng bằng lái. */
    licenseCategoryController: LicenseCategoryController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến hạng bằng lái. */
    chapterController: ChapterController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến câu hỏi. */
    quenstionController: QuestionController;

    /** @description Xử lý các yêu cầu HTTP liên quan đến quy trình nhập liệu (Import). */
    importController: ImportController;
}