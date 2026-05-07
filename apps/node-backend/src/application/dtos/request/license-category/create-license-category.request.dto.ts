import { REGEX } from "@/domain/constants/regex.constant";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu tạo mới Hạng bằng lái.
 */
export interface ICreateLicenseCategoryInputDTO {
    readonly id?: string;
    readonly name: string;
    readonly description: string;
    readonly minAge: number;
    readonly orderIndex: number;
}

/**
 * @description DTO xử lý tạo mới Hạng bằng lái.
 * Thực hiện gác cổng (validate) và làm sạch dữ liệu ngay trong constructor.
 */
export class CreateLicenseCategoryRequestDTO implements ICreateLicenseCategoryInputDTO {
    public readonly id?: string;
    public readonly name: string;
    public readonly description: string;
    public readonly minAge: number;
    public readonly orderIndex: number;

    constructor(data: ICreateLicenseCategoryInputDTO) {
        // 1. Chặn đứng dữ liệu lỗi ngay lập tức
        this.validate(data);

        // 2. Làm sạch và gán giá trị (Sanitization)
        this.id = data.id;
        this.name = data.name.trim();
        this.description = data.description.trim();
        this.minAge = data.minAge ?? 18;
        this.orderIndex = data.orderIndex ?? 1;
    }

    /**
     * @description Hàm gác cổng thực hiện ném AppError dựa trên mã lỗi hệ thống.
     * @private
     */
    private validate(data: ICreateLicenseCategoryInputDTO): void {
        if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

        // 1. Kiểm tra Tên hạng bằng
        const trimmedName = data.name?.trim() || '';
        if (trimmedName.length === 0) {
            throw new AppError(ErrorCode.LICENSE.NAME_REQUIRED);
        }

        if (trimmedName.length > 10) {
            throw new AppError(ErrorCode.LICENSE.NAME_INVALID_LENGTH);
        }

        if (!REGEX.LICENSE.NAME_FORMAT.test(trimmedName)) {
            throw new AppError(ErrorCode.LICENSE.NAME_FORMAT_INVALID);
        }

        // 2. Kiểm tra Độ tuổi
        if (data.minAge === undefined || data.minAge === null || typeof data.minAge !== 'number' || Number.isNaN(data.minAge)) {
            throw new AppError(ErrorCode.LICENSE.AGE_REQUIRED);
        }

        if (data.minAge < 18) {
            throw new AppError(ErrorCode.LICENSE.AGE_INVALID);
        }

        // 3. Kiểm tra Thứ tự sắp xếp
        if (data.orderIndex !== undefined && data.orderIndex < 0) {
            throw new AppError(ErrorCode.LICENSE.INVALID_ORDER);
        }

        // 4. Kiểm tra Mô tả
        const trimmedDesc = data.description?.trim() || '';
        if (trimmedDesc.length === 0) {
            throw new AppError(ErrorCode.LICENSE.DESCRIPTION_REQUIRED);
        }

        if (trimmedDesc.length > 500) {
            throw new AppError(ErrorCode.LICENSE.DESCRIPTION_TOO_LONG);
        }
    }
}