import { BaseEntity } from "@/domain/seedwork/entity.base";
import { IActiveSessionProps, CreateActiveSessionProps, IActiveSessionAnswer } from "./active-session.props";
import { AppError, ErrorCode } from "@/shared/errors";

export class ActiveSessionEntity extends BaseEntity<IActiveSessionProps> {
  private constructor(props: IActiveSessionProps) {
    super(props);
  }

  public static create(props: CreateActiveSessionProps): ActiveSessionEntity {
    const now = new Date();

    // Thiết lập mặc định 1 giờ (60 phút)
    const defaultExpiry = new Date(now.getTime() + 60 * 60 * 1000);
    return new ActiveSessionEntity({
      ...props,
      id: crypto.randomUUID(),
      expiresAt: props.expiresAt ?? defaultExpiry,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      currentQuestionIndex : 0,
    });
  }

  public static reconstitute(props: IActiveSessionProps): ActiveSessionEntity {
    return new ActiveSessionEntity(props);
  }

  /**
   * @description Cập nhật câu trả lời một cách an toàn (Type-safe).
   * Sử dụng spread operator để tạo mảng mới, không dùng 'any'.
   */
  public updateAnswer(questionId: string, answerId: number | null): void {
    const newAnswer: IActiveSessionAnswer = {
      questionId,
      selectedAnswerIndex: answerId,
      updatedAt: new Date()
    };

    // Tìm vị trí câu hỏi cũ
    const existingIndex = this._props.currentAnswers.findIndex(a => a.questionId === questionId);

    if (existingIndex > -1) {
      // Thay thế câu trả lời cũ bằng cách tạo mảng mới
      const updatedAnswers = [...this._props.currentAnswers];
      updatedAnswers[existingIndex] = newAnswer;
      this._props.currentAnswers = updatedAnswers;
    } else {
      // Thêm câu trả lời mới
      this._props.currentAnswers = [...this._props.currentAnswers, newAnswer];
    }

    this._props.updatedAt = new Date();
  }

  /**
   * @description Đồng bộ hàng loạt câu trả lời và vị trí câu hỏi hiện tại.
   * English: Bulk synchronize answers and the current question position.
   */
  public syncAnswers(
    answersRecord: Record<string, number | null>,
    currentIndex: number
  ): void {
    const now = new Date();

    // 1. Cập nhật vị trí câu hỏi hiện tại
    this._props.currentQuestionIndex = currentIndex;

    // 2. Tạo một bản sao của mảng hiện tại để thao tác (Immutability)
    const updatedAnswers = [...this._props.currentAnswers];

    // 3. Duyệt qua Record để cập nhật từng câu trả lời
    // Object.entries giúp tách QuestionId (key) và AnswerIndex (value)
    Object.entries(answersRecord).forEach(([qId, ansIndex]) => {
      const existingIdx = updatedAnswers.findIndex(a => a.questionId === qId);

      const newAnswerData: IActiveSessionAnswer = {
        questionId: qId,
        selectedAnswerIndex: ansIndex,
        updatedAt: now
      };

      if (existingIdx > -1) {
        // Nếu đã có trong danh sách -> Cập nhật
        updatedAnswers[existingIdx] = newAnswerData;
      } else {
        // Nếu chưa có -> Push mới
        updatedAnswers.push(newAnswerData);
      }
    });

    // 4. Gán lại mảng đã xử lý xong và cập nhật thời gian sync của Entity
    this._props.currentAnswers = updatedAnswers;
    this._props.updatedAt = now;
  }

  public get props(): Readonly<IActiveSessionProps> {
    return Object.freeze({ ...this._props });
  }

  /**
   * @description Cập nhật thời gian hết hạn của phiên theo số phút.
   * Dùng khi muốn đồng bộ phiên theo thời gian của từng loại đề thi cụ thể.
   * @param {number} minutes - Số phút tính từ thời điểm hiện tại.
   */
  public setExpiryInMinutes(minutes: number): void {
    if (minutes <= 0) {
      throw new AppError(ErrorCode.ACTIVE_SESSION.INVALID_EXPIRATION_TIME);
    }

    const now = new Date();
    const newExpiry = new Date(now.getTime() + minutes * 60 * 1000);

    // Cập nhật vào props
    this._props.expiresAt = newExpiry;
    this._props.updatedAt = now;
  }
}