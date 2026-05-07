import { AppError, ErrorCode } from "@/shared/errors";
import { ExamStatus } from "@prisma/client";
import { CreateExamInput, IExamProps, IExamQuestionProps } from "./exam.props";
import { IUserAnswerDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { BaseEntity } from "@/domain/seedwork/entity.base";

/**
 * @description Thực thể Bài thi (Exam) - Quản lý vòng đời làm bài của User.
 * Tuân thủ Rich Domain Model để bảo vệ kết quả thi khỏi bị thay đổi tùy tiện.
 */
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
      status: input.status ?? ExamStatus.PUBLISHED,
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
   * @description Logic chấm điểm bài thi.
   * Một bài thi ĐẠT khi: Điểm >= passingScore VÀ không sai câu điểm liệt nào.
   */
  public complete(input: {
    answers: IUserAnswerDTO[];
    timeSpent: number;
    timeRemaining: number;
    isAutoSubmit: boolean;
    clientFinishedAt: string;
  }): void {
    const { props } = this;
    const now = new Date();

    // 1. Ghi nhận Metadata thời gian
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

    // 2. Tối ưu Lookup O(1)
    const answerMap = new Map(
      input.answers.map((ua) => [ua.questionId, ua.answer]),
    );

    // 3. Duyệt một lần duy nhất để tính toán tất cả các chỉ số
    this._props.questions = props.questions.map((q) => {
      const submittedAnswer = answerMap.get(q.questionId);

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
      };
    });

    // 4. Cập nhật kết quả vào Props
    this._props.score = correctCount;
    this._props.wrongCount = wrongCount; // <--- Thêm mới
    this._props.skippedCount = skippedCount; // <--- Thêm mới
    this._props.hasFailedCritical = hasFailedCritical;
    this._props.status = ExamStatus.PUBLISHED;

    // Điều kiện ĐẠT
    this._props.isPassed =
      correctCount >= props.passingScore && !hasFailedCritical;

    this.touch();
  }

  /**
   * @description Cập nhật thông tin đề thi và kiểm tra lại các ràng buộc nghiệp vụ.
   * @param data - Dữ liệu cập nhật từng phần.
   */
  public update(data: {
    name?: string;
    userId?: string;
    status?: ExamStatus;
    score?: number;
    examMatrixId?: string | null;
    licenseCategoryId?: string;
    totalQuestions?: number;
    passingScore?: number;
    durationMinutes?: number;
    minCriticalQuestions?: number;
    questions?: IExamQuestionProps[];
  }): void {
    // 1. Validate các trường cơ bản
    if (data.name !== undefined && data.name.trim() === "") {
      throw new AppError(
        ErrorCode.EXAM.NAME_REQUIRED,
        "Tên đề thi không được để trống.",
      );
    }

    // 2. Logic cập nhật danh sách câu hỏi (Snapshot)
    if (data.questions !== undefined) {
      // Đảm bảo số lượng câu hỏi điểm liệt vẫn thỏa mãn sau khi cập nhật
      const minCritical =
        data.minCriticalQuestions ?? this._props.minCriticalQuestions;
      const actualCritical = data.questions.filter((q) => q.isCritical).length;

      if (actualCritical < minCritical) {
        throw new AppError(
          ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS,
          `Cập nhật thất bại: Danh sách mới chỉ có ${actualCritical}/${minCritical} câu điểm liệt.`,
        );
      }

      // Tự động cập nhật lại totalQuestions nếu không được truyền vào
      if (data.totalQuestions === undefined) {
        this._props.totalQuestions = data.questions.length;
      }

      this._props.questions = data.questions;
    }

    // 3. Mapping các trường còn lại (Gán hàng loạt một cách an toàn)
    Object.assign(this._props, {
      ...data,
      name: data.name?.trim() ?? this._props.name,
    });

    // 4. Đánh dấu thời gian thay đổi
    this.touch();
  }

  /**
   * @description Kiểm tra xem thực thể có đang trong trạng thái bị xóa hay không.
   * @returns {boolean} True nếu đã bị xóa mềm.
   */
  public isDeleted(): boolean {
    return !!this.props.deletedAt;
  }
}
