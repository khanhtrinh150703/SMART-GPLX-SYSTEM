import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers/exam-session/exam-attempt.mapper";
import { AppError, ErrorCode } from "@/shared/errors";
import { ICompleteExamService } from "@/domain/interfaces/services/exam-session/i-complete-exam.service";
import { IExamAttemptService } from "@/domain/interfaces/services/exam-session/i-exam-attempts.service";
import { IActiveSessionService } from "@/domain/interfaces/services/exam-session/i-active-session.service";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import { CompleteExamInputRequestDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { IQuestionQueryService } from "@/domain/interfaces/services/exam-mgmt/queries";
import { IExamUserResultResponseDTO } from "@/application/dtos/response/exam/exam-result.respone.dto";
import { IUserExamRankService } from "@/domain/interfaces/services/user-rank";
import { SyncRankRequestDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";
import { ILogger } from "@/domain/interfaces/logging/i-logger.interface";

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
    userExamRankService,
    logger,
  }: ICompleteExamServiceCradle) {
    this._examRepo = examRepository;
    this._attemptService = examAttemptService;
    this._sessionService = activeSessionService;
    this._questionQueryService = questionQueryService;
    this._rankService = userExamRankService;
    this._logger = logger;
  }

  /**
   * @description Chấm điểm, quyết định Đạt/Trượt và lưu kết quả bằng Transaction.
   * @param {string} examId - ID bài thi.
   * @param {CompleteExamInputRequestDTO} dto - Danh sách đáp án thí sinh chọn.
   * @returns {Promise<IExamUserResultResponseDTO>} Kết quả chi tiết sau khi chấm.
   * @param {boolean} isGuest - Cờ xác định có phải khách thi thử hay không.
   */
  public async completeExam(
    userId: string,
    dto: CompleteExamInputRequestDTO,
    isGuest: boolean = false,
  ): Promise<IExamUserResultResponseDTO> {
    // 1. Kiểm tra sự tồn tại của đề thi (Guard Clause - Mệnh đề bảo vệ)
    const exam = await this._examRepo.getByIdWithQuestions(dto.examId);
    if (!exam) {
      throw new AppError(ErrorCode.EXAM.NOT_FOUND);
    }

    // 2. Thực thi nghiệp vụ chấm điểm tại Domain Entity
    // Logic tính toán số câu đúng/sai nằm trọn trong hàm complete()
    exam.complete(dto);

    // 3. Xử lý lưu trữ kết quả (Chỉ dành cho người dùng đã đăng nhập)
    if (!isGuest) {
      // Lấy thông tin chi tiết câu hỏi để làm Snapshot (Bản sao chụp)
      const questionIds = exam.props.questions.map((q) => q.questionId);
      const fullQuestions =
        await this._questionQueryService.getQuestionsByIds(questionIds);

      const userAnswersMap = new Map(
        dto.answers.map((a) => [a.questionId, a.answer]),
      );

      // Mapping sang thuộc tính của ExamAttempt (Bản ghi lịch sử thi)
      const attemptProps = ExamAttemptMapper.toCreateProps(
        exam,
        fullQuestions,
        userAnswersMap,
        dto.isAutoSubmit, // Đừng quên truyền cờ AutoSubmit từ DTO vào nhé
      );

      // NHỊP 1: Lưu lịch sử thi trước để Entity sinh ra ID (attemptId)
      const createdAttempt =
        await this._attemptService.createAttempt(attemptProps);

      // Tạo Payload đồng bộ kỷ lục theo chuẩn SyncRankRequestDTO
      const syncRankPayload: SyncRankRequestDTO = {
        userId: userId,
        examId: exam.id!,
        licenseCategoryId: exam.props.licenseCategoryId,
        score: exam.props.score,
        durationSeconds: attemptProps.durationSeconds,
        attemptId: createdAttempt.id,
      };

      // NHỊP 2: Tối ưu I/O (Parallelism)
      const sideEffects = [
        this._rankService.syncRank(syncRankPayload).catch((err: unknown) => {
          // Log lỗi đồng bộ bảng xếp hạng với đầy đủ context
          this._logger.error(`[Leaderboard_Sync_Failed] User: ${userId}`, {
            error: err instanceof Error ? err.message : String(err),
            examId: syncRankPayload.examId,
            stack: err instanceof Error ? err.stack : undefined,
            context: "SyncRank",
          });
        }),

        this._sessionService.deleteByUserId(userId).catch((err: unknown) => {
          // Thay thế console.error bằng logger xịn
          this._logger.error(`[Session_Cleanup_Failed] User: ${userId}`, {
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
            context: "SessionCleanup",
          });
        }),
      ];

      // Đợi các tác vụ phụ chạy xong (hoặc thất bại) mà không chặn đứng kết quả trả về
      await Promise.all(sideEffects);
    }

    // 4. Trả về kết quả cuối cùng thông qua Mapper
    return ExamMapper.toResultResponseDTO(exam);
  }
}
