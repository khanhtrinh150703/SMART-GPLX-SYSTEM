import { CreateExamMatrixDTO } from "@/application/dtos/request/exam-matrix/create-exam-matrix.request.dto";
import { ExamMatrixQueryDTO } from "@/application/dtos/request/exam-matrix/exam-matrix-query.request.dto";
import { UpdateExamMatrixDTO } from "@/application/dtos/request/exam-matrix/update-exam-matrix.request.dto";
import { ExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { DeleteResponse } from "@/domain/constants/delete.constant";
import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";

/**
 * @interface IExamMatrixService
 * @description Giao diện định nghĩa các kịch bản nghiệp vụ (use cases) cho Ma trận đề thi (Exam Matrix).
 * Đảm bảo các luồng dữ liệu được điều phối chính xác giữa Controller và Repository.
 */
export interface IExamMatrixService {


  /**
   * @description Lấy danh sách ma trận đề thi có phân trang, hỗ trợ lọc theo các tiêu chí nghiệp vụ.
   * @param {ExamMatrixQueryDTO} query - Tham số truy vấn bao gồm phân trang và các bộ lọc (name, licenseType, isActive).
   * @returns {Promise<PaginatedResult<ExamMatrixResponseDTO>>} Kết quả phân trang chứa danh sách các ma trận đề thi.
   */
  getPaginatedExamMatrices(query: ExamMatrixQueryDTO): Promise<PaginatedResult<ExamMatrixResponseDTO>>;

  /**
   * @description Khởi tạo một Ma trận đề thi mới dựa trên cấu trúc phân bổ câu hỏi.
   * @param {CreateExamMatrixDTO} dto - Dữ liệu yêu cầu tạo ma trận.
   * @returns {Promise<ExamMatrixResponseDTO>} Dữ liệu ma trận đã được khởi tạo thành công.
   */
  create(dto: CreateExamMatrixDTO): Promise<ExamMatrixResponseDTO>;

  /**
   * @description Cập nhật thông tin hoặc thay đổi cấu trúc tỷ lệ phần trăm của Ma trận hiện có.
   * @param {string} id - Mã định danh duy nhất của ma trận cần cập nhật.
   * @param {UpdateExamMatrixDTO} dto - Dữ liệu cập nhật mới.
   * @returns {Promise<ExamMatrixResponseDTO>} Dữ liệu ma trận sau khi được chỉnh sửa.
   */
  update(id: string, dto: UpdateExamMatrixDTO): Promise<ExamMatrixResponseDTO>;

  /**
   * @description Loại bỏ Ma trận đề thi khỏi hệ thống.
   * @param {string} id - Mã định danh của ma trận cần xóa.
   * @returns {Promise<DeleteResponse>}
   */
  delete(id: string): Promise<DeleteResponse>;

  /**
   * @description Truy vấn và lấy thông tin chi tiết của một Ma trận đề thi cụ thể.
   * @param {string} id - Mã định danh của ma trận cần tìm.
   * @returns {Promise<ExamMatrix>} Thông tin chi tiết của ma trận.
   */
  getById(id: string): Promise<ExamMatrix>;

  /**
   * @description Khôi phục Ma trận đề thi đã bị xóa mềm.
   * @param {string} id - Mã định danh của ma trận cần khôi phục.
   * @returns {Promise<ExamMatrixResponseDTO>}
   * @throws {AppError} Ném lỗi nếu không tìm thấy ma trận hoặc có lỗi hệ thống.
   */
  restore(id: string): Promise<ExamMatrixResponseDTO>;

  /**
   * @description Xác thực sự tồn tại và tính hợp lệ của Ma trận đề thi (Referential Integrity).
   * @param {string} id - Mã định danh duy nhất của Ma trận cần kiểm tra.
   * @returns {Promise<void>} Trả về Promise rỗng nếu hợp lệ.
   * @throws {AppError} Ném lỗi INVALID_MATRIX_ID nếu ma trận không tồn tại hoặc đã bị xóa mềm.
   */
  validateExistence(id: string): Promise<void>;

  /**
   * @description Lấy danh sách các hạng bằng lái định dạng selection (value/label) có hỗ trợ tìm kiếm (theo mã hạng hoặc tên).
   * @returns {Promise<SelectionResponseDto[]>} - Danh sách các hạng bằng lái rút gọn cho dropdown.
   */
  getExamMatrixSelections(): Promise<SelectionResponseDto[]>;

  /**
   * @description Chuyển đổi một thực thể ma trận đề thi sang định dạng phản hồi DTO.
   * @param {ExamMatrix} data - Thực thể Domain của ma trận đề thi cần chuyển đổi.
   * @returns {Promise<ExamMatrixResponseDTO>} Đối tượng DTO chứa dữ liệu phản hồi chuẩn hóa.
   */
  toResponse(data: ExamMatrix): Promise<ExamMatrixResponseDTO>;
}