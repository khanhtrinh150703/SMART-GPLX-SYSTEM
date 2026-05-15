import { ExamMatrixQueryDTO } from "@/application/dtos/request/exam-matrix/exam-matrix-query.request.dto";
import { IExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { IExamMatrixSelectionResponseDTO } from "@/application/dtos/response/exam-matrix/selection-exam-matrix.respone.dto";
import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { PaginatedResult } from "@/shared/types/pagination.types";

export interface IExamMatrixQueryService {
    /**
     * @description Lấy danh sách các hạng bằng lái định dạng selection (value/label) có hỗ trợ tìm kiếm (theo mã hạng hoặc tên).
     * @returns {Promise<IExamMatrixSelectionResponseDTO[]>} - Danh sách các hạng bằng lái rút gọn cho dropdown.
     */
    getExamMatrixSelections(): Promise<IExamMatrixSelectionResponseDTO[]>;

    /**
     * @description Lấy danh sách ma trận đề thi có phân trang, hỗ trợ lọc theo các tiêu chí nghiệp vụ.
     * @param {ExamMatrixQueryDTO} query - Tham số truy vấn bao gồm phân trang và các bộ lọc (name, licenseType, isActive).
     * @returns {Promise<PaginatedResult<IExamMatrixResponseDTO>>} Kết quả phân trang chứa danh sách các ma trận đề thi.
     */
    getPaginatedExamMatrices(query: ExamMatrixQueryDTO): Promise<PaginatedResult<IExamMatrixResponseDTO>>;

    /**
     * @description Truy vấn và lấy thông tin chi tiết của một Ma trận đề thi cụ thể.
     * @param {string} id - Mã định danh của ma trận cần tìm.
     * @returns {Promise<ExamMatrix>} Thông tin chi tiết của ma trận.
     */
    getById(id: string): Promise<ExamMatrix>;

    /**
     * @description Truy vấn và lấy thông tin chi tiết của một Ma trận đề thi định dạng DTO để phản hồi cho Client.
     * @param {string} id - Mã định danh của ma trận cần tìm.
     * @returns {Promise<IExamMatrixResponseDTO>} Đối tượng DTO chứa thông tin chi tiết của ma trận.
     */
    getDetail(id: string): Promise<IExamMatrixResponseDTO>;

    /**
     * @description Truy vấn và lấy thông tin chi tiết của một Ma trận đề thi cụ thể theo tên.
     * @param {string} name - Tên của ma trận cần tìm.
     * @returns {Promise<ExamMatrix>} Thông tin chi tiết của ma trận.
     */
    getByName(name: string): Promise<ExamMatrix>;
}
