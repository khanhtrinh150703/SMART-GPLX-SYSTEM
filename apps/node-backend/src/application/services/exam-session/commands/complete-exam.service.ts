// --- Services: Commands ---
import {
  ICompleteExamService,
  IExamAttemptService,
  IActiveSessionService,
} from "@/domain/interfaces/services/exam-session/commands";

import {
  IQuestionStatisticsService,
  IUserStatisticsService,
  IUserTopicStatisticsService,
} from "@/domain/interfaces/services/statistics/commands";
import { IExamHistorySummaryService } from "@/domain/interfaces/services/exam-mgmt/commands";

import { IUserExamRankService } from "@/domain/interfaces/services/user-rank/commands";

// --- Services: Queries ---
import { IQuestionQueryService } from "@/domain/interfaces/services/exam-mgmt/queries";

// --- Infrastructure: Repositories, Mappers & Logging ---
import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt";
import { ILogger } from "@/domain/interfaces/logging";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers/exam-session";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt";

// --- Application: DTOs ---

// --- Shared ---
import { AppError, ErrorCode } from "@/shared/errors";
import { ICreateExamHistorySummaryInputDTO } from "@/application/dtos/request/exam-history/create-exam-history-summary.request.dto";
import { CompleteExamInputRequestDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { SyncRankRequestDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";
import { IExamUserResultResponseDTO } from "@/application/dtos/response/exam/exam-result.respone.dto";
import { UpdateUserTopicStatisticsCommand } from "@/application/dtos/request/statistics/update-user-topic-statistics.request.dto";

/**
 * @interface ICompleteExamServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho quy trình hoàn thành bài thi.
 * Bao gồm các dịch vụ quản lý phiên, xử lý kết quả và cập nhật thứ hạng.
 */
export interface ICompleteExamServiceCradle {
  /** @description Repository quản lý thông tin cấu trúc và dữ liệu đề thi. */
  examRepository: IExamRepository;

  /** @description Dịch vụ xử lý việc lưu trữ và truy vấn kết quả các lượt làm bài. */
  examAttemptService: IExamAttemptService;

  /** @description Dịch vụ quản lý trạng thái phiên làm bài hiện hành của người dùng. */
  activeSessionService: IActiveSessionService;

  /** @description Dịch vụ chuyên trách truy vấn dữ liệu câu hỏi và đáp án. */
  questionQueryService: IQuestionQueryService;

  /** @description Dịch vụ xử lý logic cập nhật điểm số và thứ hạng người dùng. */
  userExamRankService: IUserExamRankService;

  /** @description Quản lý nghiệp vụ cốt lõi về lịch sử thi, bao gồm lưu trữ, cập nhật và xử lý logic thực thể. */
  examHistorySummaryService: IExamHistorySummaryService;

  /** @description Dịch vụ cập nhật thống kê theo từng câu hỏi (Đúng/Sai/Tỷ lệ lỗi). */
  questionStatisticsService: IQuestionStatisticsService;

  /** @description Dịch vụ cập nhật tiến độ và tỷ lệ lỗi theo chủ đề (Luật, Biển báo...). */
  userTopicStatisticsService: IUserTopicStatisticsService;

  /** @description Dịch vụ xử lý cập nhật/đồng bộ chỉ số (Command). */
  userStatsService: IUserStatisticsService;

  /** @description Dịch vụ ghi log để theo dõi hoạt động và hỗ trợ gỡ lỗi hệ thống. */
  logger: ILogger;
}

/**
 * @class CompleteExamService
 * @description Service điều phối (Orchestrator) quy trình nộp bài, chấm điểm và lưu kỷ lục thi.
 * Thực hiện chuỗi logic: Kiểm tra phiên -> Chấm điểm -> Lưu kết quả -> Cập nhật xếp hạng.
 */
export class CompleteExamService implements ICompleteExamService {
  /** @private @readonly @description Repository đề thi. */
  private readonly _examRepo: IExamRepository;

  /** @private @readonly @description Dịch vụ lượt làm bài. */
  private readonly _attemptService: IExamAttemptService;

  /** @private @readonly @description Dịch vụ phiên làm bài hiện hành. */
  private readonly _sessionService: IActiveSessionService;

  /** @private @readonly @description Dịch vụ truy vấn dữ liệu câu hỏi. */
  private readonly _questionQueryService: IQuestionQueryService;

  /** @private @readonly @description Dịch vụ quản lý xếp hạng người dùng. */
  private readonly _rankService: IUserExamRankService;

  /** @private @readonly @description Dịch vụ quản lý lịch sử bài thi người dùng. */
  private readonly _examHistoryService: IExamHistorySummaryService;

  /** @private @readonly @description Dịch vụ thống kê câu hỏi. */
  private readonly _questionStatsService: IQuestionStatisticsService;

  /** @private @readonly @description Dịch vụ thống kê chủ đề người dùng. */
  private readonly _userTopicStatsService: IUserTopicStatisticsService;

  /** @private @readonly @description Dịch vụ thống kê chủ đề người dùng. */
  private readonly _userStatsService: IUserStatisticsService;

  /** @private @readonly @description Dịch vụ ghi log hệ thống. */
  private readonly _logger: ILogger;

  /**
   * @constructor
   * @description Khởi tạo service điều phối với các phụ thuộc được tiêm (inject) từ DI Container.
   * @param {ICompleteExamServiceCradle} cradle - Chứa danh sách đầy đủ các Repository và Service cần thiết.
   */
  constructor({
    examRepository,
    examAttemptService,
    activeSessionService,
    questionQueryService,
    examHistorySummaryService,
    userExamRankService,
    questionStatisticsService,
    userTopicStatisticsService,
    userStatsService,
    logger,
  }: ICompleteExamServiceCradle) {
    this._examRepo = examRepository;
    this._attemptService = examAttemptService;
    this._sessionService = activeSessionService;
    this._questionQueryService = questionQueryService;
    this._rankService = userExamRankService;
    this._examHistoryService = examHistorySummaryService;
    this._questionStatsService = questionStatisticsService;
    this._userTopicStatsService = userTopicStatisticsService;
    this._userStatsService = userStatsService;
    this._logger = logger;
  }

  /**
   * @description Chấm điểm, quyết định Đạt/Trượt và thực hiện quy trình lưu trữ kết quả.
   * @param {string} userId - ID của người dùng thực hiện bài thi.
   * @param {CompleteExamInputRequestDTO} dto - Dữ liệu bài thi và đáp án từ Client.
   * @param {boolean} isGuest - Cờ xác định thi thử (không lưu lịch sử).
   * @returns {Promise<IExamUserResultResponseDTO>} Kết quả chấm điểm để hiển thị.
   */
  public async completeExam(
    userId: string,
    dto: CompleteExamInputRequestDTO,
    isGuest: boolean = false,
  ): Promise<IExamUserResultResponseDTO> {
    // 1. Guard Clause: Đảm bảo đề thi tồn tại
    const exam = await this._examRepo.getByIdWithQuestions(dto.examId);
    if (!exam) {
      throw new AppError(ErrorCode.EXAM.NOT_FOUND);
    }

    if (dto.shouldShuffle && dto.sessionId) {
      exam.applyShuffling(dto.sessionId);
    }

    // 2. Domain Logic: Chấm điểm ngay tại Entity 
    exam.complete(dto);

    // 3. Persistence & Side Effects (Chỉ thực hiện cho User thật)
    if (!isGuest) {
      // --- PHẦN 1: CHUẨN BỊ DỮ LIỆU  ---
      const questionIds = exam.props.questions.map((q) => q.questionId);
      const fullQuestions =
        await this._questionQueryService.getQuestionsByIds(questionIds);
      const userAnswersMap = new Map(
        dto.answers.map((a) => [a.questionId, a.answer]),
      );

      // Sử dụng Mapper với Parameter Object - Entity tự sinh ID bên trong
      const attemptEntity = ExamAttemptMapper.toEntity({
        exam,
        fullQuestions,
        userAnswers: userAnswersMap,
        isAutoSubmit: dto.isAutoSubmit,
      });

      const attemptId = attemptEntity.id; // Đã có ID ngay lập tức

      // --- PHẦN 2: PERSISTENCE CỐT LÕI (Core Saving) ---
      // Lưu History và Attempt trước để đảm bảo tính toàn vẹn dữ liệu
      const historyDTO: ICreateExamHistorySummaryInputDTO = {
        userId,
        examName: exam.props.name,
        licenseCategoryId: attemptEntity.props.licenseCategoryId,
        licenseCategoryName: attemptEntity.props.licenseCategoryName,
        score: exam.props.score,
        totalQuestions: exam.props.totalQuestions,
        isPassed: exam.props.isPassed,
        durationSeconds: attemptEntity.props.durationSeconds,
        snapshotId: attemptId ?? "",
        isAutoSubmit: dto.isAutoSubmit,
      };

      // --- PHẦN 3: SIDE EFFECTS (Asynchronous Updates) ---

      const syncRankPayload = new SyncRankRequestDTO({
        // 1. Định danh
        userId: userId,
        examId: exam.id!,
        examName: exam.props.name,
        licenseCategoryId: exam.props.licenseCategoryId,
        attemptId: attemptId ?? "",

        // 2. Bộ chỉ số câu hỏi
        score: exam.props.score,
        wrongAnswers: exam.props.wrongCount ?? 0,
        unanswered: exam.props.skippedCount ?? 0,
        totalQuestions: exam.props.totalQuestions,

        // 3. Kết quả & Hiệu suất
        durationSeconds: attemptEntity.props.durationSeconds,
        isPassed: exam.props.isPassed,
        isFailedByCritical: exam.props.hasFailedCritical ?? false,
      });

      // Thực hiện lưu trữ đồng thời các bản ghi chính
      await Promise.all([
        this._attemptService.createAttempt(attemptEntity),
        this._examHistoryService.createHistory(historyDTO),
        this._userStatsService.syncUserStats(syncRankPayload),
      ]);

      const sideEffects = [
        // Đồng bộ bảng xếp hạng
        this._rankService.syncRank(syncRankPayload),

        // Dọn dẹp Session đa tab
        this._sessionService.deleteByUserId(userId),

        // Cập nhật thống kê độ khó câu hỏi (Bulk)
        this._questionStatsService.recordBulkAttempts({
          attempts: attemptEntity.questionStats,
        }),

        // Cập nhật tiến độ theo chủ đề
        this._userTopicStatsService.updateBulkProgress(
          new UpdateUserTopicStatisticsCommand({
            userId,
            results: attemptEntity.topicStats,
          }),
        ),
      ];

      // Chạy song song tất cả tác vụ phụ, bắt lỗi riêng lẻ để không làm sập luồng chính
      Promise.all(
        sideEffects.map((task) =>
          task.catch((err) =>
            this._handleSideEffectError(err, userId, task.constructor.name),
          ),
        ),
      );

      this._logger.info(
        `[Exam_Completed] Success for User: ${userId}, Attempt: ${attemptId}`,
      );
    }

    // 4. Return: Trả về kết quả cho Client
    return ExamMapper.toResultResponseDTO(exam);
  }

  /**
   * @private @description Helper xử lý log lỗi cho Side Effects để tránh làm crash luồng chính.
   */
  private _handleSideEffectError(
    err: unknown,
    userId: string,
    context: string,
  ): void {
    this._logger.error(
      `[SideEffect_Failed] Context: ${context} | User: ${userId}`,
      {
        message: err instanceof Error ? err.message : String(err),
      },
    );
  }
}
