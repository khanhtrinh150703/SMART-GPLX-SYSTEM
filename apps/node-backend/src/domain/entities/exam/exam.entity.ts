import { AppError, ErrorCode } from "@/shared/errors";
import { ExamStatus } from "@prisma/client";
import { CreateExamProps, IExamProps, IExamQuestionProps } from "./exam.props";
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
   * @description Factory Method: Khởi tạo một phiên thi mới (User bắt đầu làm bài).
   */
  public static create(props: CreateExamProps): ExamEntity {
    const now = new Date();

    const finalizedProps: IExamProps = {
      ...props,
      id: crypto.randomUUID(),

      // Mặc định khi mới bắt đầu thi
      status: ExamStatus.PUBLISHED,
      score: 0,
      isPassed: false,

      // Thời gian bắt đầu làm bài
      startedAt: now,
      endedAt: null,

      // Snapshot câu hỏi (phải được truyền từ Service vào)
      questions: props.questions || [],

      // Timestamps hệ thống
      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
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
  public complete(userAnswers: IUserAnswerDTO[]): void {
    const { props } = this;

    // 1. Chặn nếu đã hoàn thành trước đó
    if (props.status === ExamStatus.PUBLISHED) {
      throw new AppError(ErrorCode.PROCESS.ALREADY_COMPLETED);
    }

    // 2. Kiểm tra nộp bài quá giờ (Grace period 30s)
    const now = new Date();
    const durationMs = props.durationMinutes * 60 * 1000;
    const deadline = new Date(props.startedAt.getTime() + durationMs + 30000);

    if (now > deadline) {
      // Tùy ông chọn: Thường thì vẫn cho nộp nhưng log lại, hoặc khóa luôn
      // console.warn("User nộp bài quá giờ quy định");
    }

    let correctCount = 0;
    let hasFailedCritical = false;

    // 3. Tối ưu hiệu năng: Lookup O(1)
    const answerMap = new Map(userAnswers.map(ua => [ua.questionId, ua.answer]));

    // 4. Duyệt và chấm điểm trực tiếp vào mảng questions của Entity
    this._props.questions = props.questions.map((q) => {
      const submittedAnswer = answerMap.get(q.questionId);

      // So sánh đáp án: null/undefined hoặc sai thì là false
      const isCorrect = submittedAnswer === q.correctAnswer;

      if (isCorrect) {
        correctCount++;
      } else {
        if (q.isCritical) {
          hasFailedCritical = true;
        }
      }

      // Quan trọng: Ghi nhận kết quả vào snapshot câu hỏi
      return {
        ...q,
        isCorrect: isCorrect
      };
    });

    // 5. Cập nhật trạng thái tổng quát của Entity
    this._props.score = correctCount;
    this._props.status = ExamStatus.PUBLISHED;
    this._props.endedAt = now;

    // Điều kiện đỗ: Đạt điểm sàn VÀ không sai bất kỳ câu điểm liệt nào
    this._props.isPassed = correctCount >= this._props.passingScore && !hasFailedCritical;
  }

  /**
 * @description Cập nhật toàn diện thông tin thực thể bài thi.
 * @param data - Dữ liệu cần cập nhật (Partial vì có thể chỉ update một vài trường).
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
    // 1. Kiểm tra tính hợp lệ sơ bộ (Business Invariants)
    // "Validating exam name before assignment"
    if (data.name !== undefined && data.name.trim() === '') {
      throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
    }

    // 2. Cập nhật các trường thông tin cơ bản
    if (data.name !== undefined) this._props.name = data.name;
    if (data.userId !== undefined) this._props.userId = data.userId;
    if (data.examMatrixId !== undefined) this._props.examMatrixId = data.examMatrixId;
    if (data.licenseCategoryId !== undefined) this._props.licenseCategoryId = data.licenseCategoryId;

    // 3. Cập nhật cấu hình Snapshot
    // "Updating snapshot configuration values"
    if (data.totalQuestions !== undefined) this._props.totalQuestions = data.totalQuestions;
    if (data.passingScore !== undefined) this._props.passingScore = data.passingScore;
    if (data.durationMinutes !== undefined) this._props.durationMinutes = data.durationMinutes;
    if (data.minCriticalQuestions !== undefined) this._props.minCriticalQuestions = data.minCriticalQuestions;
    if (data.score !== undefined) this._props.score = data.score;

    if (data.status !== undefined) this._props.status = data.status;

    // 4. Cập nhật danh sách câu hỏi (Snapshot Questions)
    // "Replacing existing questions with a new snapshot array"
    if (data.questions !== undefined) {
      this._props.questions = data.questions;
    }

    // 5. Cập nhật dấu thời gian thay đổi
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