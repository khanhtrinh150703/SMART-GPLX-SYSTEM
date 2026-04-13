import { ErrorCode } from "@/shared/errors/error-codes";
import { ILicenseCategoryProps } from "./license-category.props";
import { AppError } from "@/shared/errors";

/**
 * Rich Domain Model cho Hạng bằng lái.
 */
export class LicenseCategory {
  private readonly _id?: string;
  private _name: string;
  private _description: string;
  private _minAge: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private readonly _deletedAt?: Date | null;

  constructor(props: ILicenseCategoryProps) {
    this._id = props.id;
    this._minAge = props.minAge;
    this._name = props.name;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt;
  }

  // --- Getters ---
  get id(): string | undefined { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get minAge(): number { return this._minAge; }

  // Fix: Thêm | undefined vì trong constructor chúng là optional
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }
  get deletedAt(): Date | null | undefined { return this._deletedAt; }

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
      throw new AppError(ErrorCode.VALIDATION.MIN_AGE_MUST_BE_NUMBER); // "Độ tuổi phải là một con số hợp lệ."
    }

    if (minAge < 18) {
      throw new AppError(ErrorCode.VALIDATION.MIN_AGE_INVALID); // "Độ tuổi tối thiểu không được nhỏ hơn 18."
    }

    // Gán giá trị sau khi đã validate và trim
    this._name = trimmedName;
    this._description = trimmedDescription;
    this._minAge = minAge;
  }

  /**
   * Kiểm tra trạng thái xóa mềm.
   */
  public isDeleted(): boolean {
    return !!this._deletedAt; // Trả về true nếu có ngày xóa, false nếu null/undefined
  }
}