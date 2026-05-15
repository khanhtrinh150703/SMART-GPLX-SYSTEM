import {
  createContainer,
  asValue,
  asClass,
  InjectionMode,
  asFunction,
  Constructor,
  Resolver,
} from "awilix";

// --- 1. CORE INFRASTRUCTURE (Clients, Configs & Security) ---
import prisma from "../../../prisma/prisma";
import { mongoConfig } from "../config/mongodb.config";
import { redisClient } from "@/infrastructure/database/redis/redis.client";
import { MongoDBService } from "@/infrastructure/persistence/mongodb/mongodb.service";
import { JwtTokenManager } from "@/infrastructure/security/jwt-token.manager";
import { MasterDataCacheService } from "@/infrastructure/security/master-data-cache.service";
import { autoWrapRepository } from "@/infrastructure/repositories/repository-proxy";

// --- 2. REPOSITORIES (Concrete Data Access) ---
// Nhóm Identity (MySQL & Redis)
import {
  MySQLUserRepository,
  MySQLRoleRepository,
  MySQLUserRoleRepository,
  RedisTokenRepository,
  RedisPendingUserRepository,
  RedisOtpRepository,
} from "@/infrastructure/repositories/identity";

// Nhóm Exam Management (MySQL)
import {
  MySQLChapterRepository,
  MySQLQuestionRepository,
  MySQLLicenseCategoryRepository,
  MySQLExamRepository,
  MySQLExamHistorySummaryRepository,
} from "@/infrastructure/repositories/exam-mgmt";



// Nhóm Exam Session (Xử lý thực thi & Kết quả - Multi DB)
import {
  MySQLExamMatrixRepository,
  MongoExamAttemptRepository,
  MongoActiveSessionRepository,
} from "@/infrastructure/repositories/exam-session";

// Nhóm User Rank (Xếp hạng)
import { MySQLUserExamRankRepository } from "@/infrastructure/repositories/user-rank";

// Nhóm Integration (Tích hợp dữ liệu)
import { MySQLImportRepository } from "@/infrastructure/repositories/integration";

// --- 3. SERVICES (Application Logic) ---
// --- 3.1. Domain Services (Nghiệp vụ thuần) ---
import { ExamPickerDomainService } from "@/domain/service/exam-picker.domain.service";

// --- 3.2. Management Services (Command/Action) ---
import {
  AuthService,
  UserService,
  OtpService,
  RegistrationService,
} from "@/application/services/identity";

import {
  ExamService,
  QuestionService,
  ChapterService,
  LicenseCategoryService,
  ExamHistorySummaryService,
} from "@/application/services/exam-mgmt";

import {
  ActiveSessionService,
  CompleteExamService,
  ExamAttemptService,
  ExamMatrixService,
} from "@/application/services/exam-session";

import { ExamGeneratorService } from "@/application/services/exam-engine";
import { UserExamRankService } from "@/application/services/user-rank/commands/user-exam-rank.service";

import {
  ImportService,
  ImportProcessorService,
  ExcelService,
  ZipService,
  MediaService,
} from "@/application/services/integration";

// --- 3.3. Query Services (Read-only) ---
import {
  RoleQueryService,
  UserQueryService,
} from "@/application/services/identity/queries";

import {
  ChapterQueryService,
  ExamHistorySummartQueryService,
  ExamQueryService,
  LicenseCategoryQueryService,
  QuestionQueryService,
} from "@/application/services/exam-mgmt/queries";

import {
  ExamMatrixQueryService,
  ExamAttemptQueryService,
} from "@/application/services/exam-session/queries";

import { UserRankQueryService } from "@/application/services/user-rank/queries";
import { ZipQueryService } from "@/application/services/integration/queries";

// --- 4. EXTERNAL SERVICES & BACKGROUND TASKS ---
import { NodemailerService } from "@/application/services/external-services/commands/mailer";
import {
  FileStorageService,
  TempStorageService,
} from "@/application/services/external-services/commands/storage";
import { ImportQueue } from "@/infrastructure/queues/import.queue";
import { ImportWorker } from "@/infrastructure/workers/import.worker";

// --- 5. API CONTROLLERS (Presentation Layer) ---
import {
  AuthController,
  UserController,
  RoleController,
} from "@/api/controllers/identity";

import {
  ChapterController,
  ExamController,
  ExamHistoryController,
  ExamHistorySummaryController,
  LicenseCategoryController,
  QuestionController,
} from "@/api/controllers/exam-mgmt";

import {
  ActiveSessionController,
  ExamAttemptController,
  ExamMatrixController,
} from "@/api/controllers/exam-session";

import { UserRankController } from "@/api/controllers/user-rank";
import { ImportController } from "@/api/controllers/integration";

// Nhóm logger
import { WinstonLogger } from "@/infrastructure/logging";
import { UserStatisticsService } from "@/application/services/statistics/commands/user-statistics.service";
import { UserStatisticsQueryService, UserTopicStatisticsQueryService } from "@/application/services/statistics/queries";
import { MySQLQuestionStatisticsRepository, MySQLUserStatisticsRepository, MySQLUserTopicStatisticsRepository } from "@/infrastructure/repositories/statistics";
import { RedisLeaderboardRepository } from "@/infrastructure/repositories/leaderboard";
import { QuestionStatisticsService, UserTopicStatisticsService } from "@/application/services/statistics/commands";
import { UserStatisticsController, UserTopicStatisticsController } from "@/api/controllers/statistics";

// Service
/**
 * @description Helper để tự động bọc Repository bằng Proxy xử lý lỗi.
 * @param Class - Lớp Repository cần đăng ký.
 */
export const asRepo = <T extends object>(
  Class: Constructor<T>,
): Resolver<T> => {
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
  mongoConfig: asValue(mongoConfig),
  redisClient: asValue(redisClient),
  logger: asClass(WinstonLogger),

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
  examAttemptRepository: asRepo(MongoExamAttemptRepository),
  activeSessionRepository: asRepo(MongoActiveSessionRepository),
  userExamRankRepository: asRepo(MySQLUserExamRankRepository),
  userStatsRepository: asRepo(MySQLUserStatisticsRepository),
  historySummaryRepository: asRepo(MySQLExamHistorySummaryRepository),
  leaderboardCacheRepository: asRepo(RedisLeaderboardRepository),
  questionStatisticsRepository: asRepo(MySQLQuestionStatisticsRepository),
  userTopicStatisticsRepository: asRepo(MySQLUserTopicStatisticsRepository),

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
  examPickerService: asClass(ExamPickerDomainService).singleton(),
  masterDataCacheService: asClass(MasterDataCacheService).singleton(),
  mediaService: asClass(MediaService).singleton(),
  examHistorySummaryService: asClass(ExamHistorySummaryService).singleton(),
  questionStatisticsService: asClass(QuestionStatisticsService),
  questionQueryService: asClass(QuestionQueryService).singleton(),
  chapterQueryService: asClass(ChapterQueryService).singleton(),
  licenseCategoryQueryService: asClass(LicenseCategoryQueryService).singleton(),
  examMatrixQueryService: asClass(ExamMatrixQueryService).singleton(),
  examQueryService: asClass(ExamQueryService).singleton(),
  roleQueryService: asClass(RoleQueryService).singleton(),
  userTopicStatisticsService: asClass(UserTopicStatisticsService).singleton(),
  examAttemptQueryService: asClass(ExamAttemptQueryService).singleton(),
  userStatsService: asClass(UserStatisticsService).singleton(),
  userStatsQueryService: asClass(UserStatisticsQueryService).singleton(),
  userQueryService: asClass(UserQueryService).singleton(),
  zipQueryService: asClass(ZipQueryService).singleton(),
  mongodbService: asClass(MongoDBService).singleton(),
  examAttemptService: asClass(ExamAttemptService),
  activeSessionService: asClass(ActiveSessionService),
  completeExamService: asClass(CompleteExamService).singleton(),
  userExamRankService: asClass(UserExamRankService).singleton(),
  userRankQueryService: asClass(UserRankQueryService).singleton(),
  userTopicStatisticsQueryService: asClass(UserTopicStatisticsQueryService).singleton(),
  examHistoryQuerySummaryService: asClass(ExamHistorySummartQueryService).singleton(),

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
  activeSessionController: asClass(ActiveSessionController).singleton(),
  examAttemptController: asClass(ExamAttemptController).singleton(),
  userRankController: asClass(UserRankController).singleton(),
  examHistorySummaryController: asClass(ExamHistorySummaryController).singleton(),
  userStatisticsController: asClass(UserStatisticsController).singleton(),
  userTopicStatisticsController: asClass(UserTopicStatisticsController).singleton(),
  examHistoryController: asClass(ExamHistoryController).singleton(),
});
