import { REGEX } from "@/domain/constants/regex.constant";
import { AppError } from '@/shared/errors';
import { ErrorCode } from '@/shared/errors/error-codes';

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu đăng ký tài khoản.
 */
export interface IRegisterInputDTO {
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string;
    readonly fullName?: string;
}

/**
 * @description DTO xử lý đăng ký tài khoản mới.
 * Tự chịu trách nhiệm xác thực định dạng, độ phức tạp mật khẩu và khớp mật khẩu.
 */
export class RegisterRequestDTO implements IRegisterInputDTO {
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string;
    readonly fullName?: string;

    constructor(data: IRegisterInputDTO) {
        // 1. Chặn lỗi undefined và validate toàn bộ logic
        this.validate(data);

        // 2. Gán giá trị và làm sạch (Sanitization)
        this.username = data.username.trim();
        this.email = data.email.trim().toLowerCase(); // Email nên viết thường để tránh trùng lặp logic
        this.password = data.password;
        this.confirmPassword = data.confirmPassword;
        this.fullName = data.fullName?.trim();
    }

    /**
     * @description Hàm kiểm tra tính hợp lệ đa tầng.
     * @throws {AppError} Ném lỗi ngay khi gặp vi phạm đầu tiên (Fail-fast).
     */
    private validate(data: IRegisterInputDTO): void {
        if (!data) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        // --- Validate Username ---
        if (!data.username || data.username.trim().length < 3) {
            throw new AppError(ErrorCode.AUTH.USERNAME_INVALID);
        }

        // --- Validate Email ---
        if (!data.email || !REGEX.EMAIL.BASIC.test(data.email)) {
            throw new AppError(ErrorCode.AUTH.EMAIL_INVALID);
        }

        // --- Validate Password (Gộp chung độ dài và độ phức tạp) ---
        if (!data.password || data.password.length < 8 || !REGEX.PASSWORD.COMPLEXITY.test(data.password)) {
            throw new AppError(ErrorCode.AUTH.PASSWORD_TOO_WEAK);
        }

        // --- Validate Confirm Password ---
        if (data.password !== data.confirmPassword) {
            throw new AppError(ErrorCode.AUTH.PASSWORD_MISMATCH);
        }
    }
}