import { IExamUserFilterOptions } from "@/application/dtos/request/exam/exam-query-list.request.dto";
import { ExamQueryDTO } from "@/application/dtos/request/exam/exam-query.request.dto";
import { ExamUserFullContentResponseDTO } from "@/application/dtos/response/exam/exam-full-content.response.dto";
import { IExamSummaryResponseDTO } from "@/application/dtos/response/exam/exam-summary.response.dto";
import { IExamResponseDTO } from "@/application/dtos/response/exam/exam.response.dto";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { PaginatedResult } from "@/shared/types/pagination.types";

export interface IExamQueryService {

    /**
     * @description Lấy thông tin chi tiết một bài thi theo ID.
     * @param id - Mã định danh bài thi.
     * @returns {Promise<ExamEntity>}
     * @throws {AppError} Nếu không tìm thấy bài thi hoặc ID trống.
     */
    getExamById(id: string): Promise<ExamEntity>;

    /**
     * @description Lấy danh sách đề thi có phân trang, hỗ trợ lọc theo trạng thái, người dùng và hạng bằng lái.
     * @param {ExamQueryDTO} query - Tham số truy vấn bao gồm phân trang và bộ lọc đặc thù của Exam.
     * @returns {Promise<PaginatedResult<IExamResponseDTO>>} Kết quả phân trang chứa danh sách dữ liệu đề thi.
     */
    getPaginatedExams(query: ExamQueryDTO): Promise<PaginatedResult<IExamResponseDTO>>;

    /**
     * @description Lấy danh sách bộ đề thi dựa trên bộ lọc.
     * @param options - Các tiêu chí lọc (search, categoryId).
     * @returns {Promise<IExamSummaryResponseDTO[]>}
     */
    getPaginatedVisualExams(options?: IExamUserFilterOptions): Promise<PaginatedResult<IExamSummaryResponseDTO>>;

    /**
     * @description Lấy thông tin chi tiết và nội dung câu hỏi của bộ đề.
     * @param id - ID của bộ đề.
     * @returns {Promise<ExamUserFullContentResponseDTO>}
     * @throws {AppError} Nếu không tìm thấy hoặc chưa PUBLISHED.
     */
    getExamDetail(id: string): Promise<ExamUserFullContentResponseDTO>;
}