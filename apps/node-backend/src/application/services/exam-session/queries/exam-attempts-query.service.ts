import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { IExamAttemptRepository } from "@/domain/interfaces/repositories";
import { IExamAttemptQueryService } from "@/domain/interfaces/services";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers";
import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * @interface IExamAttemptQueryServiceCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho ExamAttemptQueryService qua Awilix.
 */
export interface IExamAttemptQueryServiceCradle {
    /** @description Repository chuyên trách truy vấn dữ liệu Snapshot lượt thi từ Database. */
    examAttemptRepository: IExamAttemptRepository;
}

/**
 * @class ExamAttemptQueryService
 * @implements {IExamAttemptQueryService}
 * @description Triển khai các xử lý truy vấn (Read-side) cho lượt thi.
 * Tập trung vào việc trích xuất dữ liệu Snapshot bất biến để phục vụ hiển thị.
 */
export class ExamAttemptQueryService implements IExamAttemptQueryService {
    private readonly _attemptRepo: IExamAttemptRepository;

    constructor({ examAttemptRepository }: IExamAttemptQueryServiceCradle) {
        this._attemptRepo = examAttemptRepository;
    }

    /**
     * @description Truy xuất thông tin chi tiết một lượt thi bao gồm snapshot nội dung đề bài và kết quả.
     * @param {string} id - ID định danh duy nhất của lượt thi (Dạng UUID từ NoSQL).
     * @returns {Promise<IExamAttemptResponseDTO>} DTO chứa thông tin snapshot và kết quả bài làm.
     * @throws {AppError} Ném lỗi EXAM_ATTEMPT.NOT_FOUND nếu không tìm thấy dữ liệu trong hệ thống.
     */
    public async getAttemptDetail(id: string): Promise<IExamAttemptResponseDTO> {
        const attempt = await this._attemptRepo.findById(id);

        if (!attempt) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
        }

        return ExamAttemptMapper.toResponseDTO(attempt);
    }

    /**
     * @description Truy xuất danh sách lịch sử tất cả các lượt thi của một người dùng cụ thể.
     * @param {string} userId - ID định danh của người dùng cần lấy lịch sử thi.
     * @returns {Promise<IExamAttemptResponseDTO[]>} Mảng chứa các DTO tóm tắt danh sách lượt thi.
     */
    public async getUserAttemptHistory(userId: string): Promise<IExamAttemptResponseDTO[]> {
        const attempts = await this._attemptRepo.findByUserId(userId);

        // Map mảng các thực thể sang mảng DTOs
        return ExamAttemptMapper.toResponseDTOList(attempts);
    }
}