import { IExamAttemptRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-attempt.repository";
import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";
import { CreateExamAttemptProps } from "@/domain/entities/exam-attempt/exam-attempt.props";
import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { AppError, ErrorCode } from "@/shared/errors";
import { IExamAttemptService } from "@/domain/interfaces/services/exam-session/i-exam-attempts.service";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers/exam-session/exam-attempt.mapper";

export interface IExamAttemptCradle {
    attemptRepository: IExamAttemptRepository;
}

/**
 * @class ExamAttemptService
 * @description Triển khai các xử lý nghiệp vụ cho lượt thi (Snapshot).
 * @principle Clean Architecture - Tập trung vào việc Persistence (Lưu trữ) và Retrieval (Truy xuất).
 */
export class ExamAttemptService implements IExamAttemptService {
    private readonly _attemptRepo: IExamAttemptRepository;

    constructor({ attemptRepository }: IExamAttemptCradle) {
        this._attemptRepo = attemptRepository;
    }

    /**
     * @description Tạo và lưu một bản ghi lượt thi mới (Snapshot).
     * @param props Dữ liệu khởi tạo lượt thi từ kết quả chấm điểm.
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
     * @description Lấy chi tiết một lượt thi để hiển thị bài làm.
     * @param id ID của lượt thi (NoSQL UUID).
     */
    public async getAttemptDetail(id: string): Promise<IExamAttemptResponseDTO> {
        const attempt = await this._attemptRepo.findById(id);

        if (!attempt) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
        }

        return ExamAttemptMapper.toResponseDTO(attempt);
    }

    /**
     * @description Lấy danh sách lịch sử thi của người dùng.
     * @param userId ID người dùng.
     */
    public async getUserAttemptHistory(userId: string): Promise<IExamAttemptResponseDTO[]> {
        const attempts = await this._attemptRepo.findByUserId(userId);

        // Map mảng các thực thể sang mảng DTOs
        return ExamAttemptMapper.toResponseDTOList(attempts);
    }

    /**
     * @description Xóa mềm một lượt thi.
     * @param id ID của lượt thi.
     */
    public async softDeleteAttempt(id: string): Promise<void> {
        const attempt = await this._attemptRepo.findById(id);

        if (!attempt) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
        }

        await this._attemptRepo.softDelete(id);
    }

    /**
     * @description Xóa  một lượt thi.
     * @param id ID của lượt thi.
     */
    public async hardDeleteAttempt(id: string): Promise<void> {
        const attempt = await this._attemptRepo.findById(id);

        if (!attempt) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
        }

        await this._attemptRepo.hardDelete(id);
    }
}