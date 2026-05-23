import { REGEX } from "@/domain/constants/regex.constant";
import { AppError } from "@/shared/errors";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu Admin tạo tài khoản người dùng mới.
 */
export interface IAdminCreateUserInputDTO {
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string; // Thêm trường confirmPassword vào interface đầu vào
  readonly roles: string[];
}

/**
 * @class AdminCreateUserRequestDTO
 * @description DTO xử lý nghiệp vụ Admin tạo người dùng, mapping an toàn dữ liệu và tự kiểm tra (Self-validating).
 */
export class AdminCreateUserRequestDTO implements IAdminCreateUserInputDTO {
  public readonly username: string;
  public readonly fullName: string;
  public readonly email: string;
  public readonly password: string;
  public readonly confirmPassword: string; 
  public readonly roles: string[];

  /**
   * @param {IAdminCreateUserInputDTO} data
   * @throws {AppError}
   */
  constructor(data: IAdminCreateUserInputDTO) {
    // 0. Guard Clause chặn object null/undefined
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Mapping & Sanitization (Gán và làm sạch dữ liệu vào các thuộc tính của instance)
    this.username =
      typeof data.username === "string"
        ? data.username.trim().toLowerCase()
        : "";

    this.fullName =
      typeof data.fullName === "string" ? data.fullName.trim() : "";

    this.email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    this.password = typeof data.password === "string" ? data.password : "";

    this.confirmPassword =
      typeof data.confirmPassword === "string" ? data.confirmPassword : "";

    // Đảm bảo roles là một mảng chuỗi hợp lệ, loại bỏ các phần tử trống hoặc khoảng trắng thừa
    this.roles = Array.isArray(data.roles)
      ? data.roles
          .filter((role): role is string => typeof role === "string")
          .map((role) => role.trim())
      : [];

    // 2. Validation (Gọi validate trực tiếp bằng dữ liệu đã có trong `this`)
    this.validate();
  }

  /**
   * @private
   * @description Kiểm tra tính hợp lệ đa tầng của các trường dữ liệu dựa trên thuộc tính của class.
   * @throws {AppError}
   */
  private validate(): void {
    // --- Validate Username ---
    if (!this.username || this.username.length < 3) {
      throw new AppError(ErrorCode.AUTH.USERNAME_INVALID);
    }

    // --- Validate Full Name ---
    if (!this.fullName || this.fullName.length === 0) {
      throw new AppError(ErrorCode.AUTH.FULL_NAME_INVALID);
    }

    // --- Validate Email ---
    if (!this.email || !REGEX.EMAIL.BASIC.test(this.email)) {
      throw new AppError(ErrorCode.AUTH.EMAIL_INVALID);
    }

    // --- Validate Password (Theo schema tối thiểu 8 ký tự) ---
    if (
      !this.password ||
      this.password.length < 8 ||
      !REGEX.PASSWORD.COMPLEXITY.test(this.password)
    ) {
      throw new AppError(ErrorCode.AUTH.PASSWORD_TOO_WEAK);
    }

    // --- Validate Confirm Password ---
    // So sánh trực tiếp giá trị của password và confirmPassword trong `this`
    if (this.password !== this.confirmPassword) {
      throw new AppError(ErrorCode.AUTH.PASSWORD_MISMATCH);
    }

    // --- Validate Roles ---
    if (this.roles.length === 0) {
      throw new AppError(ErrorCode.AUTH.ROLES_REQUIRED);
    }
  }
}
