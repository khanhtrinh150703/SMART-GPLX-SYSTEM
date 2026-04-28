import { BaseEntity } from "@/domain/seedwork/entity.base";
import { CreateAnswerProps, IAnswerProps } from "./answer.props";

export class Answer extends BaseEntity<IAnswerProps>{
  /**
     * @description Constructor đơn giản: Chỉ nhận và gán.
     */
  private constructor(props: IAnswerProps) {
    super(props);
    this.validate();
  }

  /**
   * @description Factory Method: Tạo mới một đáp án hoàn chỉnh.
   */
  public static create(data: CreateAnswerProps): Answer {
    const now = new Date();

    const finalizedProps: IAnswerProps = {
      id: crypto.randomUUID(),
      content: data.content.trim(),
      isCorrect: data.isCorrect,
      imageUrl: data.imageUrl || '',
      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
    };

    return new Answer(finalizedProps);
  }

  /**
   * @description Hồi sinh một đáp án từ DB (Dùng ở Mapper/Repository)
   */
  public static reconstitute(props: IAnswerProps): Answer {
    return new Answer(props);
  }

  // --- Getters (Để Question và Mapper có thể đọc dữ liệu công khai) ---

  public get id(): string { return this._props.id; }
  public get content(): string { return this._props.content; }
  public get isCorrect(): boolean { return this._props.isCorrect; }
  public get imageUrl(): string { return this._props.imageUrl; }
  public get createdAt(): Date { return this._props.createdAt; }
  public get updatedAt(): Date { return this._props.updatedAt; }
  public get deletedAt(): Date | undefined { return this._props.deletedAt; }

  // --- Domain Methods (Hành vi nghiệp vụ) ---

  public isDeleted(): boolean {
    return this._props.deletedAt !== undefined;
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  private validate(): void {
    if (this._props.content.length === 0) {
      throw new Error("Nội dung đáp án không được để trống.");
    }
  }

  /**
   * @description Cập nhật nội dung đáp án
   */
  public updateDetails(data: Partial<Pick<IAnswerProps, 'content' | 'isCorrect' | 'imageUrl'>>): void {
    if (data.content !== undefined) this._props.content = data.content.trim();
    if (data.isCorrect !== undefined) this._props.isCorrect = data.isCorrect;
    if (data.imageUrl !== undefined) this._props.imageUrl = data.imageUrl;

    this.validate();
    this.touch();
  }
}