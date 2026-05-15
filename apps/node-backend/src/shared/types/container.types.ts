// --- 1. CORE & INFRASTRUCTURE (Cấu trúc nền tảng) ---
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";
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
  IPendingUserRepository,
} from "@/domain/interfaces/repositories/identity";

// Nhóm Exam Management (Dữ liệu nội dung thi)
import {
  ILicenseCategoryRepository,
  IChapterRepository,
  IQuestionRepository,
  IExamRepository,
  IExamHistorySummaryRepository,
} from "@/domain/interfaces/repositories/exam-mgmt";

// Nhóm Exam Session & History (Dữ liệu phiên làm bài & Kết quả)
import {
  IActiveSessionRepository,
  IExamAttemptRepository,
  IExamMatrixRepository,
} from "@/domain/interfaces/repositories/exam-session";

// Nhóm User Rank (Xếp hạng & Tiến trình)
import { IUserExamRankRepository } from "@/domain/interfaces/repositories/user-rank";

// Nhóm Integration (Theo dõi trạng thái tích hợp/Import)
import { IImportJobRepository } from "@/domain/interfaces/repositories/integration";

// --- 3. SERVICES (Tầng nghiệp vụ) ---
// --- 3.1. Command & Management Services ---
// Nhóm Identity
import {
  IAuthService,
  IUserService,
  IOtpService,
  IRegistrationService,
} from "@/domain/interfaces/services/identity";

// Nhóm Exam Management
import {
  IChapterService,
  IQuestionService,
  ILicenseCategoryService,
  IMasterDataCacheService,
  IExamService,
  IExamHistorySummaryService,
} from "@/domain/interfaces/services/exam-mgmt";

// Nhóm Exam Engine & Session
import {
  IActiveSessionService,
  ICompleteExamService,
  IExamAttemptService,
  IExamMatrixService,
} from "@/domain/interfaces/services/exam-session";

// Nhóm User Rank
import { IUserExamRankService } from "@/domain/interfaces/services/user-rank";

// Nhóm Integration
import {
  IImportService,
  IImportProcessorService,
  IExcelService,
  IMediaService,
  IZipService,
} from "@/domain/interfaces/services/integration";

// --- 3.2. Query Services (Tối ưu cho truy vấn/Read-only) ---
import {
  IRoleQueryService,
  IUserQueryService,
} from "@/domain/interfaces/services/identity/queries";

import {
  IChapterQueryService,
  ILicenseCategoryQueryService,
  IQuestionQueryService,
  IExamQueryService,
  IExamHistorySummaryQueryService,
} from "@/domain/interfaces/services/exam-mgmt/queries";

import {
  IExamAttemptQueryService,
  IExamMatrixQueryService,
} from "@/domain/interfaces/services/exam-session/queries";

import { IUserRankQueryService } from "@/domain/interfaces/services/user-rank/queries";
import { IZipQueryService } from "@/domain/interfaces/services/integration";

// --- 4. EXTERNAL & SECURITY (Dịch vụ bên ngoài) ---
import {
  ITokenManager,
  IEmailService,
  IFileStorageService,
  ITempStorageService,
  IMongoDBService,
} from "@/domain/interfaces/services/external";

// --- 5. PRESENTATION (Controllers - Tầng giao diện API) ---
// Nhóm Identity
import {
  AuthController,
  UserController,
  RoleController,
} from "@/api/controllers/identity";

// Nhóm Exam Management
import {
  ChapterController,
  ExamController,
  ExamHistoryController,
  ExamHistorySummaryController,
  LicenseCategoryController,
  QuestionController,
} from "@/api/controllers/exam-mgmt";

// Nhóm Exam Session
import {
  ActiveSessionController,
  ExamAttemptController,
  ExamMatrixController,
} from "@/api/controllers/exam-session";

// Nhóm User Rank & Integration
import { UserRankController } from "@/api/controllers/user-rank";
import { ImportController } from "@/api/controllers/integration";

// Nhóm logger
import { ILogger } from "@/domain/interfaces/logging";
import { ILeaderboardCacheRepository } from "@/domain/interfaces/repositories/leaderboard/i-leaderboard-cache.repository";
import {
  IQuestionStatisticsRepository,
  IUserStatisticsRepository,
  IUserTopicStatisticsRepository,
} from "@/domain/interfaces/repositories/statistics";
import { IExamGeneratorService } from "@/domain/interfaces/services/exam-engine/commands";
import {
  IUserStatisticsQueryService,
  IUserTopicStatisticsQueryService,
} from "@/domain/interfaces/services/statistics/queries";
import {
  IQuestionStatisticsService,
  IUserStatisticsService,
  IUserTopicStatisticsService,
} from "@/domain/interfaces/services/statistics/commands";
import {
  UserStatisticsController,
  UserTopicStatisticsController,
} from "@/api/controllers/statistics";

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

  /** @description Dịch vụ ghi log để theo dõi hoạt động và hỗ trợ gỡ lỗi hệ thống. */
  logger: ILogger;

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

  /** @description Quản lý lưu trữ và truy xuất thông tin các lượt thực hiện bài thi. */
  examAttemptRepository: IExamAttemptRepository;

  /** @description Quản lý trạng thái và dữ liệu các phiên làm việc (session) đang hoạt động. */
  activeSessionRepository: IActiveSessionRepository;

  /** @description Repository quản lý việc lưu trữ và truy vấn các thực thể đề thi (Exam) trong hệ thống. */
  examRepository: IExamRepository;

  /** @description Repository quản lý việc lưu trữ và truy xuất dữ liệu xếp hạng (Ranking) của người dùng trong hệ thống thi GPLX.*/
  userExamRankRepository: IUserExamRankRepository;

  /** @description Repository quản lý việc lưu trữ và truy xuất dữ liệu bảng xếp hạng (Leaderboard) từ bộ nhớ đệm (Cache) để tối ưu hiệu năng. */
  leaderboardCacheRepository: ILeaderboardCacheRepository;

  /** @description Repository chịu trách nhiệm lưu trữ, cập nhật và đồng bộ dữ liệu thống kê người dùng. */
  userStatsRepository: IUserStatisticsRepository;

  /** @description Repository chịu trách nhiệm truy xuất dữ liệu lịch sử thi từ Database. */
  historySummaryRepository: IExamHistorySummaryRepository;

  /** @description Repository chịu trách nhiệm truy xuất dữ liệu thống kê câu hỏi từ Database. */
  questionStatisticsRepository: IQuestionStatisticsRepository;

  /** @description Repository chịu trách nhiệm truy xuất dữ liệu thống kê theo chủ đề của người dùng từ Database. */
  userTopicStatisticsRepository: IUserTopicStatisticsRepository;

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

  /** @description Quản lý nghiệp vụ cốt lõi về lịch sử thi, bao gồm lưu trữ, cập nhật và xử lý logic thực thể. */
  examHistorySummaryService: IExamHistorySummaryService;

  /** @description Dịch vụ chuyên biệt cho việc đọc dữ liệu thống kê (Query). */
  userStatsQueryService: IUserStatisticsQueryService;

  /** @description Dịch vụ xử lý cập nhật/đồng bộ chỉ số (Command). */
  userStatsService: IUserStatisticsService;

  /** @description Service truy vấn ngân hàng câu hỏi. */
  questionQueryService: IQuestionQueryService;

  /** @description Service truy vấn danh mục chương bài học. */
  chapterQueryService: IChapterQueryService;

  /** @description Service truy vấn hạng bằng lái. */
  licenseCategoryQueryService: ILicenseCategoryQueryService;

  /** @description Service truy vấn cấu hình ma trận đề thi. */
  examMatrixQueryService: IExamMatrixQueryService;

  /** @description Service truy vấn thông tin lịch sử thi và chi tiết kết quả các lượt thi. */
  examQueryService: IExamQueryService;

  /** @description Quản lý nghiệp vụ truy vấn liên quan đến vai trò hệ thống. */
  roleQueryService: IRoleQueryService;

  /** @description Quản lý nghiệp vụ truy vấn thông tin người dùng và hồ sơ cá nhân. */
  userQueryService: IUserQueryService;

  /** @description Quản lý nghiệp vụ truy vấn lịch sử và snapshot kết quả lượt thi. */
  examAttemptQueryService: IExamAttemptQueryService;

  /** @description Quản lý nghiệp vụ truy vấn dữ liệu thống kê và tiến độ học tập theo từng chủ đề của người dùng. */
  userTopicStatisticsQueryService: IUserTopicStatisticsQueryService;

  /** @description Dịch vụ chuyên biệt phụ trách truy vấn danh sách, chi tiết và tổng hợp dữ liệu lịch sử thi thông qua việc ánh xạ các đối tượng DTO. */
  examHistoryQuerySummaryService: IExamHistorySummaryQueryService;

  /** @description Dịch vụ cập nhật thống kê theo từng câu hỏi (Đúng/Sai/Tỷ lệ lỗi). */
  questionStatisticsService: IQuestionStatisticsService;

  /** @description Dịch vụ cập nhật tiến độ và tỷ lệ lỗi theo chủ đề (Luật, Biển báo...). */
  userTopicStatisticsService: IUserTopicStatisticsService;

  /** @description Quản lý truy vấn thông tin cấu hình và đường dẫn cho tiến trình xử lý tệp nén. */
  zipQueryService: IZipQueryService;

  /** @description Dịch vụ xử lý logic hoàn tất bài thi, chấm điểm và ghi nhận kết quả cuối cùng. */
  completeExamService: ICompleteExamService;

  /** @description Chịu trách nhiệm quản lý hạ tầng kết nối, khởi tạo và duy trì vòng đời (lifecycle) của cơ sở dữ liệu MongoDB. */
  mongodbService: IMongoDBService;

  /** @description Xử lý nghiệp vụ thực hiện bài thi và tính toán kết quả lượt thi. */
  examAttemptService: IExamAttemptService;

  /** @description Điều phối và kiểm soát logic các phiên làm việc (session) đang hoạt động. */
  activeSessionService: IActiveSessionService;

  /** @description Dịch vụ chuyên trách truy vấn dữ liệu bảng xếp hạng */
  userRankQueryService: IUserRankQueryService;

  /** @description Xử lý logic nghiệp vụ về xếp hạng, tính toán điểm số cao nhất và các quy tắc phân bậc người dùng trong hệ thống. */
  userExamRankService: IUserExamRankService;

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

  /** @description Tiếp nhận yêu cầu và điều phối các luồng nghiệp vụ liên quan đến đề thi. */
  examController: ExamController;

  /** @description Xử lý các yêu cầu đầu vào và phản hồi trạng thái phiên làm việc của người dùng. */
  activeSessionController: ActiveSessionController;

  /** @description Điều phối các yêu cầu nộp bài, chấm điểm và truy vấn lịch sử các lượt làm bài thi. */
  examAttemptController: ExamAttemptController;

  /** @description Điều phối các yêu cầu truy vấn bảng xếp hạng, vị trí cá nhân và các nghiệp vụ liên quan đến vinh danh người dùng. */
  userRankController: UserRankController;

  /** @description Bộ điều khiển tiếp nhận, điều phối các yêu cầu HTTP và trả về phản hồi liên quan đến lịch sử thi. */
  examHistorySummaryController: ExamHistorySummaryController;

  /** @description Bộ điều khiển tiếp nhận, điều phối các yêu cầu HTTP liên quan đến dữ liệu thống kê học tập và kết quả thi cá nhân của người dùng. */
  userStatisticsController: UserStatisticsController;

  /** @description Bộ điều phối (Controller) chuyên trách xử lý các yêu cầu HTTP liên quan đến phân tích hiệu suất và tiến độ học tập chi tiết theo từng nhóm chủ đề kiến thức (Topic-based Metrics). */
  userTopicStatisticsController: UserTopicStatisticsController;

  /** @description Bộ điều khiển quản lý vòng đời lịch sử thi, bao gồm việc ghi nhận kết quả bài thi và truy xuất dữ liệu lịch sử. */
  examHistoryController: ExamHistoryController;
}
