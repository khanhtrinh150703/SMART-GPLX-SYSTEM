import { ErrorCode } from "@/shared/errors/error-codes";
import { CreateLicenseCategoryProps, ILicenseCategoryProps } from "./license-category.props";
import { AppError } from "@/shared/errors";
import { BaseEntity } from "@/domain/seedwork/entity.base";

/**
 * @description Thực thể Hạng bằng lái (License Category).
 * Quản lý các quy định về độ tuổi và định danh hạng bằng (A1, B2, C...).
 */
export class LicenseCategory extends BaseEntity<ILicenseCategoryProps> {

  /**
     * @description Constructor "câm": Chỉ nhận dữ liệu đã được gọt giũa sạch sẽ.
     */
  private constructor(props: ILicenseCategoryProps) {
    super(props);
    // this.validate(); // Kiểm tra các điều kiện bất biến (Invariants)
  }

  /**
   * @description Factory Method: Khởi tạo một Hạng bằng lái mới.
   * Đây là nơi duy nhất thực hiện Normalization và gán giá trị hệ thống.
   */
  public static create(props: CreateLicenseCategoryProps): LicenseCategory {
    const now = new Date();

    const finalizedProps: ILicenseCategoryProps = {
      ...props,
      id: crypto.randomUUID(),

      // Normalization: Gọt giũa văn bản
      name: props.name.trim(),
      description: props.description?.trim() || '',

      // Nghiệp vụ mặc định
      minAge: props.minAge ?? 18,

      // Dấu mốc thời gian hệ thống
      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
    } as ILicenseCategoryProps;

    return new LicenseCategory(finalizedProps);
  }

  /**
   * @description Tái tạo thực thể từ dữ liệu Database (Resurrection).
   */
  public static reconstitute(props: ILicenseCategoryProps): LicenseCategory {
    return new LicenseCategory(props);
  }

  /**
   * @description Truy xuất thuộc tính dưới dạng Read-only.
   */
  public get props(): Readonly<ILicenseCategoryProps> {
    return Object.freeze({ ...this._props });
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  // --- Getters ---
  get id(): string | undefined { return this._props.id; }
  get name(): string { return this._props.name; }
  get description(): string { return this._props.description; }
  get minAge(): number { return this._props.minAge; }

  // Fix: Thêm | undefined vì trong constructor chúng là optional
  get createdAt(): Date | undefined { return this._props.createdAt; }
  get updatedAt(): Date | undefined { return this._props.updatedAt; }
  get deletedAt(): Date | null | undefined { return this._props.deletedAt; }

  /**
   * Cập nhật thông tin hạng bằng với logic kiểm tra nghiệp vụ (Business Rules).
   */
  public updateDetails(name: string, description: string, minAge: number): void {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    // 1. Validate Tên: Không dùng mã AUTH.INVALID_TOKEN (lỗi bảo mật)
    // Phải dùng mã VALIDATION (lỗi nhập liệu)
    if (trimmedName.length === 0) {
      throw new AppError(ErrorCode.VALIDATION.NAME_REQUIRED);
    }

    if (trimmedName.length < 1 || trimmedName.length > 10) {
      throw new AppError(ErrorCode.VALIDATION.NAME_INVALID_LENGTH);
    }

    // 2. Validate Mô tả
    if (trimmedDescription.length === 0) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_REQUIRED);
    }

    if (trimmedDescription.length > 500) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG);
    }

    if (minAge === undefined || minAge === null || typeof minAge !== 'number' || Number.isNaN(minAge)) {
      throw new AppError(ErrorCode.VALIDATION.AGE_MUST_BE_NUMBER);
    }

    if (minAge < 18) {
      throw new AppError(ErrorCode.VALIDATION.AGE_INVALID);
    }

    // Gán giá trị sau khi đã validate và trim
    this._props.name = trimmedName;
    this._props.description = trimmedDescription;
    this._props.minAge = minAge;
  }

  public restore(): void {
    this._props.deletedAt = undefined;
    this.touch()
  }

  /**
   * Đánh dấu xóa mềm.
   */
  public softDelete(): void {
    this._props.deletedAt = new Date();
    this.touch();
  }

  /**
   * Kiểm tra trạng thái xóa mềm.
   */
  public isDeleted(): boolean {
    return !!this._props.deletedAt;
  }
}