import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật hồ sơ cá nhân.
 */
export interface IUpdateProfileInputDTO {
    readonly fullName?: string;
    readonly pictureFile?: IUploadedFile;
}

/**
 * @description DTO xử lý cập nhật hồ sơ cá nhân.
 * Đảm bảo dữ liệu được chuẩn hóa và ngăn chặn các yêu cầu rỗng.
 */
export class UpdateProfileRequestDTO implements IUpdateProfileInputDTO {
    public readonly fullName?: string;
    public readonly pictureFile?: IUploadedFile;

    constructor(data: IUpdateProfileInputDTO) {
        // 1. Chặn đứng dữ liệu lỗi/undefined ngay từ constructor
        this.validate(data);

        // 2. Làm sạch và gán giá trị
        this.fullName = data.fullName?.trim();
        this.pictureFile = data.pictureFile;
    }

    /**
     * @description Hàm gác cổng thực hiện ném AppError dựa trên mã lỗi hệ thống.
     * @private
     */
    private validate(data: IUpdateProfileInputDTO): void {
        // Guard Clause: Chống sập hệ thống
        if (!data) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        const { USER } = ErrorCode;

        // 1. Phải cung cấp ít nhất một trường để cập nhật (fullName hoặc avatar)
        const hasFullName = data.fullName !== undefined;
        const hasAvatar = data.pictureFile !== undefined;

        if (!hasFullName && !hasAvatar) {
            throw new AppError(USER.MISSING_UPDATE_FIELDS);
        }

        // 2. Kiểm tra độ dài tên (nếu có cung cấp)
        if (hasFullName) {
            const trimmedName = data.fullName?.trim() || '';

            // Nếu gửi fullName nhưng lại để chuỗi rỗng
            if (trimmedName.length === 0) {
                throw new AppError(USER.NAME_REQUIRED); // Tận dụng lại USER_101
            }

            if (trimmedName.length > 50) {
                throw new AppError(USER.NAME_TOO_LONG);
            }
        }
    }
}