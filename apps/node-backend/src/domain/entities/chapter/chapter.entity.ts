import { ErrorCode } from "@/shared/errors/error-codes";
import { IChapterProps } from "./chapter.props";
import { AppError } from "@/shared/errors/error-app"; // Đổi sang ValidationError cho đúng chuẩn mình làm nãy giờ nhé

/**
 * Thực thể đại diện cho một Chương lý thuyết (Domain Entity).
 */
export class Chapter {
  // Thay vì khai báo từng cái, mình dùng 1 object props duy nhất
  constructor(private _props: IChapterProps) { }

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

    this._props.updatedAt = new Date();
  }

  /**
   * Đánh dấu xóa mềm.
   */
  public softDelete(): void {
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }


  public restore(): void {
    this._props.deletedAt = null;
  }
  /**
   * Kiểm tra trạng thái xóa.
   */
  public isDeleted(): boolean {
    return !!this._props.deletedAt;
  }
}