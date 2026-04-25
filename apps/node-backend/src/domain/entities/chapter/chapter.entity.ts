import { ErrorCode } from "@/shared/errors/error-codes";
import { CreateChapterProps, IChapterProps } from "./chapter.props";
import { AppError } from "@/shared/errors/error-app"; // Đổi sang ValidationError cho đúng chuẩn mình làm nãy giờ nhé
import { BaseEntity } from "@/domain/seedwork/entity.base";

/**
 * @description Thực thể Chương (Chapter) - Quản lý cấu trúc phân loại câu hỏi lý thuyết.
 * Kế thừa BaseEntity để đảm bảo tính nhất quán về định danh và thời gian.
 */
export class Chapter extends BaseEntity<IChapterProps> {

  /**
     * @description Constructor đơn giản, chỉ nhận dữ liệu đã "sạch".
     */
  private constructor(props: IChapterProps) {
    super(props);
  }

  /**
   * @description Factory: Tạo một Chương mới hoàn toàn với các quy tắc nghiệp vụ.
   */
  public static create(props: CreateChapterProps): Chapter {
    const now = new Date();

    const finalizedProps: IChapterProps = {
      ...props,
      id: crypto.randomUUID(),
      // Normalization: Chỉ thực hiện khi tạo mới
      name: props.name.trim(),
      description: props.description?.trim() || null,
      orderIndex: props.orderIndex ?? 0,

      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
    };

    return new Chapter(finalizedProps);
  }

  /**
   * @description Tái tạo thực thể từ dữ liệu cũ (Dùng ở tầng Infrastructure/Mapper).
   */
  public static reconstitute(props: IChapterProps): Chapter {
    return new Chapter(props);
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  // --- Getters: Phải trỏ vào trong _props ---
  get id(): string { return this._props.id; }
  get name(): string { return this._props.name; }
  get description(): string | null { return this._props.description; }
  get code(): string { return this._props.code; }
  get orderIndex(): number { return this._props.orderIndex; }
  get createdAt(): Date | undefined { return this._props.createdAt; }
  get updatedAt(): Date | undefined { return this._props.updatedAt; }
  get deletedAt(): Date | null | undefined { return this._props.deletedAt; }

  /**
   * Cập nhật thông tin chương với Business Rules.
   */
  public updateDetails(data: { name?: string; description?: string | null; orderIndex?: number }): void {
    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (trimmedName.length === 0) {
        throw new AppError(ErrorCode.VALIDATION.REQUIRED);
      }
      this._props.name = trimmedName; // Cập nhật vào props
    }

    if (data.description !== undefined) {
      this._props.description = data.description?.trim() || null;
    }

    if (data.orderIndex !== undefined) {
      if (data.orderIndex < 0) {
        throw new AppError(ErrorCode.VALIDATION.INVALID_FORMAT);
      }
      this._props.orderIndex = data.orderIndex;
    }

    this.touch();
  }

  /**
   * Đánh dấu xóa mềm.
   */
  public softDelete(): void {
    this._props.deletedAt = new Date();
    this.touch();
  }

  public restore(): void {
    this._props.deletedAt = undefined;
    this.touch();
  }

  /**
   * Kiểm tra trạng thái xóa.
   */
  public isDeleted(): boolean {
    return !!this._props.deletedAt;
  }
}