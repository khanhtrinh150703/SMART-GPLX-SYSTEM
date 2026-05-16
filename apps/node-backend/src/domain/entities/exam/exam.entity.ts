import { AppError, ErrorCode } from "@/shared/errors";
import { CreateExamInput, IExamProps, IExamQuestionProps } from "./exam.props";
import { ICompleteExamInputDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { BaseEntity } from "@/domain/seedwork/entity.base";
import { STATUS, Status } from "@/shared/config/status.config";
import { shuffleWithSeed, stringToSeed } from "@/shared/utils/random.util";

/**
 * @description Thực thể Bài thi (Exam) - Quản lý vòng đời làm bài của User.
 * Tuân thủ Rich Domain Model để bảo vệ kết quả thi khỏi bị thay đổi tùy tiện.
 */

export interface IUpdateExamProps {
  name?: string;
  userId?: string;
  status?: Status;
  score?: number;
  examMatrixId?: string | null;
  licenseCategoryId?: string;
  totalQuestions?: number;
  passingScore?: number;
  durationMinutes?: number;
  minCriticalQuestions?: number;
  questions?: IExamQuestionProps[];
}

export class ExamEntity extends BaseEntity<IExamProps> {
  private constructor(props: IExamProps) {
    super(props);
  }

  /**
   * @description Factory method để tạo thực thể Exam mới.
   * @param input Dữ liệu tạo đề thi từ Application Service.
   * @returns Thực thể ExamEntity hoàn chỉnh.
   */
  public static create(input: CreateExamInput): ExamEntity {
    const now = new Date();

    // --- BƯỚC 1: MAPPING & VALIDATE SNAPSHOT (Domain Logic) ---
    const examQuestions: IExamQuestionProps[] = input.rawQuestions.map(
      (q, index) => {
        // Tìm index của đáp án đúng (giả sử q.answers có thuộc tính isCorrect)
        const correctAnsIndex = q.answers.findIndex((a) => a.isCorrect);

        if (correctAnsIndex === -1 || correctAnsIndex === undefined) {
          throw new AppError(
            ErrorCode.EXAM.QUESTION_DATA_INVALID,
            `Câu hỏi ID: ${q.id} không có đáp án đúng. Không thể tạo đề thi.`,
          );
        }

        return {
          questionId: q.id,
          indexNumber: index + 1, // STT trong đề thi
          isCritical: q.isCritical,
          correctAnswer: correctAnsIndex + 1, // Chuyển sang 1-index để User dễ đọc
          chapterId: q.props.chapterId,
          chapterName: q.props.chapterName, // ChapterName đã được Service chuẩn bị từ Cache
        };
      },
    );

    // --- BƯỚC 2: VALIDATE BUSINESS INVARIANTS ---
    const actualCriticalCount = examQuestions.filter(
      (q) => q.isCritical,
    ).length;
    if (actualCriticalCount < input.minCriticalQuestions) {
      throw new AppError(
        ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS,
        `Đề thi không đạt yêu cầu: Cần ít nhất ${input.minCriticalQuestions} câu điểm liệt (Hiện có: ${actualCriticalCount}).`,
      );
    }

    // --- BƯỚC 3: ĐÓNG GÓI PROPS HOÀN CHỈNH ---
    const finalizedProps: IExamProps = {
      ...input,
      id: crypto.randomUUID(),

      // Logic khởi tạo trạng thái mặc định
      status: input.status ?? STATUS.ACTIVE,
      score: 0,
      isPassed: false,

      // Thời gian làm bài
      startedAt: now,
      endedAt: null,

      // Gán snapshot đã qua xử lý
      questions: examQuestions,
      totalQuestions: input.totalQuestions ?? examQuestions.length,
      // Timestamps
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return new ExamEntity(finalizedProps);
  }

  /**
   * @description Tái tạo thực thể từ Database (Resurrection).
   * Dùng khi load lại bài thi đang làm dở hoặc xem lại kết quả.
   */
  public static reconstitute(props: IExamProps): ExamEntity {
    return new ExamEntity(props);
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  /**
   * @description Kết thúc bài thi, thực hiện chấm điểm và đóng gói kết quả.
   * @param {ICompleteExamInputDTO} input - Dữ liệu hoàn thành bài thi từ tầng Application.
   */
  public complete(input: ICompleteExamInputDTO): void {
    const { props } = this;
    const now = new Date();

    // 1. Ghi nhận Metadata thời gian tổng thể
    this._props.resultMetadata = {
      timeSpent: input.timeSpent,
      timeRemaining: input.timeRemaining,
      isAutoSubmit: input.isAutoSubmit,
      clientFinishedAt: new Date(input.clientFinishedAt),
    };
    this._props.endedAt = now;

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let hasFailedCritical = false;

    // 2. Tối ưu Lookup O(1): Lưu cả Object DTO để lấy được cả answer và timeSpent
    const submissionMap = new Map(
      input.answers.map((ua) => [ua.questionId, ua]),
    );

    // 3. Duyệt một lần duy nhất để tính toán tất cả các chỉ số
    this._props.questions = props.questions.map((q) => {
      const submission = submissionMap.get(q.questionId);
      const submittedAnswer = submission?.answer;
      // Lấy timeSpent từng câu (mặc định là 0 nếu bỏ qua)
      const questionTimeSpent = submission?.timeSpent ?? 0;

      // Kiểm tra trạng thái trả lời
      const isSkipped =
        submittedAnswer === undefined || submittedAnswer === null;
      const isCorrect = !isSkipped && submittedAnswer === q.correctAnswer;

      // Cập nhật các biến đếm
      if (isSkipped) {
        skippedCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
        // Chỉ tính "liệt" nếu có trả lời nhưng bị sai
        if (q.isCritical) hasFailedCritical = true;
      }

      return {
        ...q,
        userAnswer: submittedAnswer,
        isCorrect: isCorrect,
        timeSpent: questionTimeSpent, // <--- Đã gán "spent" vào từng câu ở đây
      };
    });

    // 4. Cập nhật kết quả vào Props
    this._props.score = correctCount;
    this._props.wrongCount = wrongCount;
    this._props.skippedCount = skippedCount;
    this._props.hasFailedCritical = hasFailedCritical;

    // Điều kiện ĐẠT
    this._props.isPassed =
      correctCount >= props.passingScore && !hasFailedCritical;

    this.touch();
  }

  /**
   * @description Cập nhật thông tin đề thi và kiểm tra lại các ràng buộc nghiệp vụ.
   * @param data - Dữ liệu cập nhật từng phần.
   */
  public update(data: IUpdateExamProps): void {
    // --- 1. LOGIC IS_EDITED (Trọng tâm yêu cầu của Trinh) ---
    if (this._props.examMatrixId) {
      this._props.isEdited = true;
    }

    // --- 2. VALIDATION CƠ BẢN ---
    if (data.name !== undefined) {
      if (data.name.trim() === "") {
        throw new AppError(
          ErrorCode.EXAM.NAME_REQUIRED,
          "Tên đề thi không được để trống.",
        );
      }
      this._props.name = data.name.trim();
    }

    // --- 3. LOGIC CẬP NHẬT CÂU HỎI (SNAPSHOT) ---
    if (data.questions !== undefined) {
      const minCritical =
        data.minCriticalQuestions ?? this._props.minCriticalQuestions;
      const actualCritical = data.questions.filter((q) => q.isCritical).length;

      // Kiểm tra ràng buộc số lượng câu điểm liệt
      if (actualCritical < minCritical) {
        throw new AppError(
          ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS,
          `Cập nhật thất bại: Danh sách mới chỉ có ${actualCritical}/${minCritical} câu điểm liệt.`,
        );
      }

      // Tự động cập nhật tổng số câu nếu không truyền explicit
      this._props.totalQuestions = data.totalQuestions ?? data.questions.length;
      this._props.questions = data.questions;
    }

    // --- 4. CẬP NHẬT CÁC TRƯỜNG CÒN LẠI (Sạch bóng Object.assign rủi ro) ---
    if (data.userId !== undefined) this._props.userId = data.userId;
    if (data.status !== undefined) this._props.status = data.status;
    if (data.score !== undefined) this._props.score = data.score;
    if (data.examMatrixId !== undefined)
      this._props.examMatrixId = data.examMatrixId;
    if (data.licenseCategoryId !== undefined)
      this._props.licenseCategoryId = data.licenseCategoryId;
    if (data.passingScore !== undefined)
      this._props.passingScore = data.passingScore;
    if (data.durationMinutes !== undefined)
      this._props.durationMinutes = data.durationMinutes;
    if (data.minCriticalQuestions !== undefined)
      this._props.minCriticalQuestions = data.minCriticalQuestions;

    // --- 5. KẾT THÚC ---
    this.touch(); // Cập nhật updatedAt
    // this.validate(); // Đảm bảo trạng thái cuối cùng của Entity là hợp lệ
  }

  /**
   * @description Xáo trộn danh sách câu hỏi dựa trên hạt giống từ Session ID
   * @param sessionId Mã phiên làm việc của thí sinh
   */
  public applyShuffling(sessionId: string): void {
    if (!this._props.questions || this._props.questions.length === 0) {
      return;
    }

    const seed = stringToSeed(sessionId);
    // Thực hiện xáo trộn và gán lại vào props
    this._props.questions = shuffleWithSeed(this._props.questions, seed);
  }

  /**
   * @description Kiểm tra xem thực thể có đang trong trạng thái bị xóa hay không.
   * @returns {boolean} True nếu đã bị xóa mềm.
   */
  public isDeleted(): boolean {
    return !!this.props.deletedAt;
  }
}
