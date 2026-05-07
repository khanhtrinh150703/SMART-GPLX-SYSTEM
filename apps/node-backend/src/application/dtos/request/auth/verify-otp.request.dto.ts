import { AppError } from '@/shared/errors/error-app';
import { ErrorCode } from '@/shared/errors/error-codes';

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu xác thực người dùng (OTP).
 */
export interface IVerifyUserInputDTO {
    readonly email: string;
    readonly otp: string;
}

/**
 * @description DTO xử lý xác thực tài khoản qua OTP.
 * Đảm bảo dữ liệu hiện diện và đúng định dạng cơ bản trước khi đẩy vào tầng nghiệp vụ.
 */
export class VerifyUserRequestDTO implements IVerifyUserInputDTO {
    readonly email: string;
    readonly otp: string;

    constructor(data: IVerifyUserInputDTO) {
        // 1. Chặn đứng mọi dữ liệu rác hoặc undefined
        this.validate(data);

        // 2. Làm sạch dữ liệu trước khi gán
        this.email = data.email.trim().toLowerCase();
        this.otp = data.otp.trim();
    }

    /**
     * @description Hàm gác cổng, ném AppError chỉ với mã lỗi (ErrorCode).
     * @private
     */
    private validate(data: IVerifyUserInputDTO): void {
        // Chặn lỗi sập app nếu req.body bị undefined
        if (!data) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        // Kiểm tra tính hiện diện của email và otp
        if (!data.email || !data.otp) {
            throw new AppError(ErrorCode.AUTH.MISSING_FIELDS);
        }

        // Kiểm tra định dạng OTP (thường là 6 ký tự cho hệ thống thi GPLX)
        if (data.otp.trim().length !== 6) {
            throw new AppError(ErrorCode.AUTH.OTP_INVALID);
        }
    }
}