import { ExamQueryDTO } from "@/application/dtos/request/exam/exam-query.request.dto";
import { ExamUserFullContentResponseDTO } from "@/application/dtos/response/exam/exam-full-content.response.dto";
import { IExamSummaryResponseDTO } from "@/application/dtos/response/exam/exam-summary.response.dto";
import { IExamResponseDTO } from "@/application/dtos/response/exam/exam.response.dto";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { IExamRepository } from "@/domain/interfaces/repositories";
import { IExamQueryService } from "@/domain/interfaces/services";
import { ExamMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface IExamQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) phục vụ việc truy vấn dữ liệu Lượt thi.
 */
export interface IExamQueryServiceCradle {
    /** @description Repository chuyên trách truy xuất thông tin lịch sử, chi tiết và kết quả các bài thi. */
    examRepository: IExamRepository;
}

/**
 * @class ExamQueryService
 * @description Dịch vụ chuyên trách các tác vụ đọc dữ liệu (Read-side) liên quan đến lượt thi và kết quả thi.
 * @principle Data Integrity - Đảm bảo dữ liệu trả về dưới dạng DTO sạch, tuyệt đối không thay đổi trạng thái nghiệp vụ.
 */
export class ExamQueryService implements IExamQueryService {
    /** @private @readonly @description Instance truy xuất dữ liệu lượt thi (Exam Attempt). */
    private readonly _examRepo: IExamRepository;

    /**
     * @constructor
     * @description Khởi tạo Service thông qua cơ chế Dependency Injection (Awilix Proxy).
     * @param {IExamQueryServiceCradle} cradle - Chứa các Repository cần thiết cho việc truy vấn.
     */
    constructor({ examRepository }: IExamQueryServiceCradle) {
        this._examRepo = examRepository;
    }

    /**
     * @description Lấy danh sách đề thi đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch.
     * @param {ExamQueryDTO} query - DTO chứa các tiêu chí lọc và thông số phân trang từ Request.
     * @returns {Promise<PaginatedResult<IExamResponseDTO>>} Trả về DTO thay vì Entity để đảm bảo tính đóng gói và bảo mật.
     */
    public async getPaginatedExams(query: ExamQueryDTO): Promise<PaginatedResult<IExamResponseDTO>> {
        // 1. Chuẩn hóa thông số phân trang (Sử dụng dữ liệu đã được ép kiểu trong constructor của DTO)
        const page = query.page || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            query.limit || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );

        // 2. Tính toán skip cho Repository (Sử dụng Utility tập trung)
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn dữ liệu từ DB thông qua Repository
        // Kết quả nhận về là Tuple [ExamEntity[], total] để phục vụ phân trang
        const [exams, total] = await this._examRepo.findAndCount(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Response DTO
        // Đảm bảo dữ liệu trả về cho Client chỉ chứa các thông tin cần thiết (không chứa dữ liệu nhạy cảm)
        const examResponses = exams.map(exam => ExamMapper.toResponse(exam));

        // 5. Đóng gói kết quả cuối cùng kèm Metadata phân trang
        return PaginationUtil.createPaginatedResponse(
            examResponses,
            total,
            page,
            limit
        );
    }

    /**
     * @description Lấy danh sách bộ đề thi đã qua bộ lọc (tìm kiếm/hạng bằng) và ánh xạ sang DTO tóm tắt.
     * @param {ExamQueryDTO} query - DTO chứa tiêu chí lọc và thông số phân trang.
     * @returns {Promise<PaginatedResult<IExamSummaryResponseDTO>>} Trả về kết quả phân trang chứa các DTO tóm tắt.
     */
    public async getPaginatedVisualExams(query: ExamQueryDTO): Promise<PaginatedResult<IExamSummaryResponseDTO>> {
        // 1. Chuẩn hóa thông số phân trang từ Query DTO
        const page = query.page || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            query.limit || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );

        // 2. Tính toán số bản ghi cần bỏ qua (Skip/Offset)
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn song song dữ liệu và tổng số bản ghi (Tuple Pattern)
        const [exams, total] = await this._examRepo.findAllUser(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU: Chuyển đổi từ Entity sang Summary Response DTO
        // Đảm bảo chỉ trả về những thông tin cần thiết cho màn hình danh sách.
        const examResponses = exams.map(exam => ExamMapper.toSummaryResponseDTO(exam));

        // 5. Đóng gói Response thông qua Utility tập trung
        return PaginationUtil.createPaginatedResponse(
            examResponses,
            total,
            page,
            limit
        );
    }

    /**
     * @description Lấy thông tin chi tiết một bài thi theo ID.
     * @param id - Mã định danh bài thi.
     * @returns {Promise<ExamEntity>}
     * @throws {AppError} VALIDATION.ID_REQUIRED - Khi định danh (ID) của lượt thi bị thiếu hoặc không hợp lệ trong yêu cầu. (Exam attempt ID is required).
     * @throws {AppError} EXAM_ATTEMPT.NOT_FOUND - Khi không tìm thấy dữ liệu về lượt làm bài thi yêu cầu trong hệ thống. (Exam attempt not found).
     */
    public async getExamById(id: string): Promise<ExamEntity> {
        // 1. Kiểm tra ID đầu vào có hợp lệ không
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        // 2. Gọi Repository để truy vấn dữ liệu
        const exam = await this._examRepo.findById(id);

        // 3. Xử lý trường hợp không tìm thấy (Null Object)
        if (!exam) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND,);
        }

        // 4. Trả về thực thể (Entity) để xử lý tiếp ở tầng Controller
        return exam;
    }

    /**
     * @description Lấy thông tin chi tiết và toàn bộ nội dung câu hỏi của bộ đề.
     * @param id - Mã định danh duy nhất của bộ đề.
     * @returns {Promise<ExamUserFullContentResponseDTO>}
     * @throws {AppError} VALIDATION.ID_REQUIRED - Khi ID bị thiếu.
     * @throws {AppError} EXAM.NOT_FOUND - Khi không tìm thấy bộ đề.
     */
    public async getExamDetail(id: string): Promise<ExamUserFullContentResponseDTO> {
        // 1. Kiểm tra ID đầu vào
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        // 2. Gọi Repository bốc toàn bộ dữ liệu (Eager Loading questions/chapters)
        const exam = await this._examRepo.findDetailById(id);

        // 3. Xử lý trường hợp không tìm thấy dữ liệu
        if (!exam) {
            throw new AppError(ErrorCode.EXAM.NOT_FOUND);
        }

        // 4. Ánh xạ (Mapping) sang Full Content Response DTO và trả về
        return ExamMapper.toFullContentResponseDTO(exam);
    }

}