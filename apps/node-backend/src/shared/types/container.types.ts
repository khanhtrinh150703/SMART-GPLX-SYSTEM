// --- 1. CORE & INFRASTRUCTURE (Cấu trúc nền tảng) ---
import { PrismaClient } from "@prisma/client";
import { Redis } from 'ioredis';
import { IImportQueue } from "@/domain/interfaces/queues/i-import.queue";
import { ImportWorker } from "@/infrastructure/workers/import.worker";

// --- 2. REPOSITORIES (Tầng truy xuất dữ liệu) ---
// Nhóm Identity (Dữ liệu người dùng & Bảo mật)
import {
    IUserRepository,
    IRoleRepository,
    IUserRoleRepository,
    ITokenRepository,
    IOtpRepository,
    IPendingUserRepository
} from "@/domain/interfaces/repositories/identity";

// Nhóm Exam Management (Dữ liệu nội dung thi)
import {
    ILicenseCategoryRepository,
    IChapterRepository,
    IQuestionRepository
} from "@/domain/interfaces/repositories/exam-mgmt";

// Nhóm Exam Session & History (Dữ liệu phiên làm bài & Kết quả)
import { IExamMatrixRepository } from "@/domain/interfaces/repositories/exam-session";

// Nhóm Integration (Theo dõi trạng thái tích hợp/Import)
import { IImportJobRepository } from "@/domain/interfaces/repositories/integration";
// --- 3. SERVICES (Tầng nghiệp vụ) ---
// Nhóm Identity (Xác thực & Người dùng)
import {
    IAuthService,
    IUserService,
    IRoleService,
    IOtpService,
    IRegistrationService
} from "@/domain/interfaces/services/identity";

// Nhóm Exam Management (Quản lý dữ liệu đề thi)
import {
    IChapterService,
    IExamService,
    IQuestionService,
    ILicenseCategoryService,
    IMasterDataCacheService
} from "@/domain/interfaces/services/exam-mgmt";

// Nhóm Exam Engine & Session (Logic tạo đề & Phiên làm bài)
import { IExamGeneratorService } from "@/domain/interfaces/services/exam-engine";
import { IExamMatrixService } from "@/domain/interfaces/services/exam-session";

// Nhóm Integration (Xử lý file & Dịch vụ tích hợp)
import {
    IImportService,
    IImportProcessorService,
    IExcelService,
    IMediaService,
    IZipService
} from "@/domain/interfaces/services/integration";

// --- 4. EXTERNAL & SECURITY (Dịch vụ bên ngoài) ---
import { ITokenManager } from "@/domain/interfaces/external/i-token-manager";
import { IEmailService } from "@/domain/interfaces/external/i-email.service";
import { IFileStorageService } from "@/domain/interfaces/external/i-file-storage.service";
import { ITempStorageService } from "@/domain/interfaces/external/i-temp-storage.service";

// --- 5. PRESENTATION (Controllers - Tầng giao diện API) ---
// Nhóm Identity
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

    /** @description Repository lưu trữ thông tin đăng ký người dùng tạm thời (Redis). */
    pendingUserRepository: IPendingUserRepository;

    /** @description Repository quản lý mối quan hệ giữa người dùng và vai trò (Bảng trung gian). */
    userRoleRepository: IUserRoleRepository;

    /** @description Kho lưu trữ và quản trị trạng thái các phiên nhập dữ liệu (Persistence/Database). */
    importJobRepository: IImportJobRepository;

    /** @description Kho lưu trữ và quản trị trạng thái các ma trận đề thi (Persistence/Database). */
    examMatrixRepository: IExamMatrixRepository;

    // --- QUẢN LÝ KỸ THUẬT (MANAGERS) ---

    /** @description Quản lý vòng đời JWT, ký và xác thực mã thông báo. */
    tokenManager: ITokenManager;

    // --- NGHIỆP VỤ ỨNG DỤNG (APPLICATION SERVICES) ---

    /** @description Dịch vụ gửi Email (Nodemailer/External API). */
    emailService: IEmailService;

    /** @description Điều phối nghiệp vụ liên quan đến người dùng và hồ sơ cá nhân. */
    userService: IUserService;

    /** @description Xử lý logic sinh mã, gửi và xác thực OTP. */
    otpService: IOtpService;

    /** @description Điều phối luồng xác thực, đăng nhập và bảo mật tài khoản. */
    authService: IAuthService;

    /** @description Quản lý nghiệp vụ cho các loại hạng bằng lái. */
    licenseCategoryService: ILicenseCategoryService;

    /** @description Quản lý nghiệp vụ cho các loại hạng bằng lái. */
    chapterService: IChapterService;

    /** @description Quản lý nghiệp vụ cho câu hỏi. */
    questionService: IQuestionService;

    /** @description Điều phối quy trình đăng ký tài khoản người dùng mới. */
    registrationService: IRegistrationService;

    /** @description Quản lý nghiệp vụ liên quan đến vai trò hệ thống. */
    roleService: IRoleService;

    /** @description Dịch vụ điều phối và quản lý toàn bộ tiến trình nhập liệu (Import Orchestration). */
    importService: IImportService;

    /** @description Dịch vụ điều phối nghiệp vụ và quản lý vòng đời Ma trận đề thi (Exam Matrix Orchestration). */
    examMatrixService: IExamMatrixService;

    /** @description Dịch vụ quản lý thông tin, trạng thái và nghiệp vụ liên quan đến Đề thi (Exam Management). */
    examService: IExamService;

    /** @description Dịch vụ thực thi thuật toán khởi tạo và tổ hợp đề thi tự động từ ma trận (Exam Generation Engine). */
    examGeneratorService: IExamGeneratorService;

    /** @description Dịch vụ quản lý bộ nhớ đệm cho dữ liệu danh mục dùng chung, tối ưu hóa tốc độ truy xuất (Master Data Caching). */
    masterDataCacheService: IMasterDataCacheService;

    /** @description Dịch vụ xử lý tệp tin đa phương tiện, quản lý lưu trữ và liên kết tài nguyên (Media & Asset Management). */
    mediaService: IMediaService;

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

    /** @description Xử lý các yêu cầu HTTP liên quan đến ma trận đề thi (Exam Matrix). */
    examMatrixController: ExamMatrixController;

    examController: ExamController;
}