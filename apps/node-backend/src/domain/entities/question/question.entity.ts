import { BaseEntity } from "@/domain/seedwork/entity.base";
import { CreateQuestionProps, IQuestionProps } from "./question.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { Answer } from "./answer.entity";
import { STATUS, Status } from "@/shared/config/status.config";

export class Question extends BaseEntity<IQuestionProps> {
  
  private constructor(props: IQuestionProps) {
    super(props);
    this.validateQuestion();
  }

  /**
   * @description Factory Method: Dùng để khởi tạo một câu hỏi mới hoàn toàn.
   */
  public static create(data: CreateQuestionProps): Question {
    const now = new Date();

    // 1. Khởi tạo các thực thể Answer con thông qua Factory của chúng
    const answerEntities = data.answers.map(ans => Answer.create(ans));

    // 2. Chuẩn hóa dữ liệu thô
    const finalizedProps: IQuestionProps = {
      ...data,
      id: crypto.randomUUID(),
      content: data.content.trim(),
      imageUrl: data.imageUrl || '',
      difficultyLevel: data.difficultyLevel ?? 1,
      isCritical: data.isCritical ?? false,
      status: data.status || 'ACTIVE',
      indexNumber: data.indexNumber || 1,

      // Gán các thực thể đã được Answer.create() sinh ra
      answers: answerEntities,

      licenseCategoryIds: data.licenseCategoryIds || [],
      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
    } as IQuestionProps;

    return new Question(finalizedProps);
  }
  /**
   * @description HỒI SINH (Reconstitute): Dùng ở Repository/Mapper khi load từ DB.
   */
  public static reconstitute(props: IQuestionProps): Question {
    return new Question(props);
  }

  // --- Getters ---

  public get id(): string { return this._props.id; }
  public get imageUrl(): string { return this._props.imageUrl; }
  public get answers(): Answer[] { return [...this._props.answers]; }
  public get content(): string { return this._props.content; }
  public get isCritical(): boolean { return this._props.isCritical; }
  public get deletedAt(): Date | undefined { return this._props.deletedAt; }

  // --- Hành vi nghiệp vụ (Domain Behaviors) ---

  /**
   * @description Cập nhật chi tiết câu hỏi.
   * Nhận vào thực thể Answer[] đã được Service chuẩn bị sẵn.
   */
  public update(data: {
    chapterId: string;
    content: string;
    imageUrl: string;
    isCritical: boolean;
    difficultyLevel: number;
    indexNumber: number;
    status: Status;
    answers: Answer[];
    licenseCategoryIds: string[];
  }): void {
    this._props.chapterId = data.chapterId;
    this._props.content = data.content.trim();
    this._props.imageUrl = data.imageUrl;
    this._props.isCritical = data.isCritical;
    this._props.difficultyLevel = data.difficultyLevel;
    this._props.indexNumber = data.indexNumber;
    this._props.status = data.status;
    this._props.licenseCategoryIds = [...data.licenseCategoryIds];

    // Gán trực tiếp vì Service đã map sang Entity rồi, không gọi Answer.create nữa
    this._props.answers = [...data.answers];

    this.validateQuestion();
    this.touch();
  }

  public delete(): void {
    // if (this.isCritical) {
    //   throw new AppError(ErrorCode.QUESTION.CANNOT_DELETE_CRITICAL);
    // }
    this._props.status = STATUS.DELETED;
    this._props.deletedAt = new Date();
    this.touch();
  }

  public isDeleted(): boolean {
    return !!this.props.deletedAt;
  }

  public restore(): void {
    this._props.deletedAt = undefined;
    this._props.status = STATUS.ACTIVE;
    this.touch();
  }

  // --- Private Helpers ---

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  private validateQuestion(): void {
    const { QUESTION } = ErrorCode;

    if (!this._props.content || this._props.content.trim().length < 10) {
      throw new AppError(QUESTION.CONTENT_INVALID);
    }

    if (!this._props.chapterId) {
      throw new AppError(QUESTION.CHAPTER_REQUIRED);
    }

    if (!this._props.licenseCategoryIds || this._props.licenseCategoryIds.length === 0) {
      throw new AppError(QUESTION.LICENSE_REQUIRED);
    }

    if (!this._props.answers || this._props.answers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    const hasCorrectAnswer = this._props.answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }
  }
}