import { IExamAttemptRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-attempt.repository";
import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";
import { CreateExamAttemptProps } from "@/domain/entities/exam-attempt/exam-attempt.props";
import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { AppError, ErrorCode } from "@/shared/errors";
import { IExamAttemptService } from "@/domain/interfaces/services/exam-session/i-exam-attempts.service";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers/exam-session/exam-attempt.mapper";

export interface IExamAttemptCradle {
    examAttemptRepository: IExamAttemptRepository;
}

/**
 * @class ExamAttemptService
 * @description Triển khai các xử lý nghiệp vụ cho lượt thi (Snapshot).
 * @principle Clean Architecture - Tập trung vào việc Persistence (Lưu trữ) và Retrieval (Truy xuất).
 */
export class ExamAttemptService implements IExamAttemptService {
    private readonly _attemptRepo: IExamAttemptRepository;

    constructor({ examAttemptRepository }: IExamAttemptCradle) {
        this._attemptRepo = examAttemptRepository;
    }

    /**
     * @description Thực hiện quy trình khởi tạo, lưu trữ snapshot và trả về dữ liệu lượt thi mới.
     * @param {CreateExamAttemptProps} props - Các thuộc tính nghiệp vụ cần thiết để cấu thành một bản ghi lượt thi hoàn chỉnh.
     * @returns {Promise<IExamAttemptResponseDTO>} DTO đại diện cho lượt thi đã được đồng bộ hóa thành công xuống cơ sở dữ liệu.
     */
    public async createAttempt(props: CreateExamAttemptProps): Promise<IExamAttemptResponseDTO> {
        // 1. Khởi tạo thực thể Domain (Tự sinh ID và timestamps nội bộ)
        const attempt = ExamAttemptEntity.create(props);

        // 2. Lưu xuống NoSQL Persistence
        const savedAttempt = await this._attemptRepo.createExamAttempt(attempt);

        // 3. Chuyển đổi sang DTO để trả về cho Client
        return ExamAttemptMapper.toResponseDTO(savedAttempt);
    }

    /**
     * @description Thực hiện xóa mềm lượt thi (Soft Delete) để ẩn dữ liệu phía người dùng nhưng vẫn giữ lại bản ghi phục vụ mục đích thống kê.
     * @param {string} id - ID định danh của lượt thi cần xử lý.
     * @returns {Promise<void>} 
     * @throws {AppError} EXAM_ATTEMPT.NOT_FOUND nếu lượt thi không tồn tại trong hệ thống.
     */
    public async softDeleteAttempt(id: string): Promise<void> {
        const attempt = await this._attemptRepo.findById(id);

        if (!attempt) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
        }

        await this._attemptRepo.softDelete(id);
    }

    /**
     * @description Xóa vĩnh viễn (Hard Delete) bản ghi lượt thi khỏi cơ sở dữ liệu. Hành động này không thể hoàn tác.
     * @param {string} id - ID định danh của lượt thi cần xóa bỏ hoàn toàn.
     * @returns {Promise<void>} 
     * @throws {AppError} EXAM_ATTEMPT.NOT_FOUND nếu lượt thi không tồn tại trong hệ thống.
     */
    public async hardDeleteAttempt(id: string): Promise<void> {
        const attempt = await this._attemptRepo.findById(id);

        if (!attempt) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
        }

        await this._attemptRepo.hardDelete(id);
    }
}