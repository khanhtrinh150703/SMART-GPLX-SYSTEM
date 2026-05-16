import { CreateExamMatrixRequestDTO } from "@/application/dtos/request/exam-matrix/create-exam-matrix.request.dto";
import { UpdateExamMatrixRequestDTO } from "@/application/dtos/request/exam-matrix/update-exam-matrix.request.dto";
import { IExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";

/**
 * @interface IExamMatrixService
 * @description Giao diện định nghĩa các kịch bản nghiệp vụ (use cases) cho Ma trận đề thi (Exam Matrix).
 * Đảm bảo các luồng dữ liệu được điều phối chính xác giữa Controller và Repository.
 */
export interface IExamMatrixService {

  /**
   * @description Khởi tạo một Ma trận đề thi mới dựa trên cấu trúc phân bổ câu hỏi.
   * @param {CreateExamMatrixRequestDTO} dto - Dữ liệu yêu cầu tạo ma trận.
   * @returns {Promise<IExamMatrixResponseDTO>} Dữ liệu ma trận đã được khởi tạo thành công.
   */
  create(dto: CreateExamMatrixRequestDTO): Promise<IExamMatrixResponseDTO>;

  /**
   * @description Cập nhật thông tin hoặc thay đổi cấu trúc tỷ lệ phần trăm của Ma trận hiện có.
   * @param {string} id - Mã định danh duy nhất của ma trận cần cập nhật.
   * @param {UpdateExamMatrixRequestDTO} dto - Dữ liệu cập nhật mới.
   * @returns {Promise<IExamMatrixResponseDTO>} Dữ liệu ma trận sau khi được chỉnh sửa.
   */
  update(id: string, dto: UpdateExamMatrixRequestDTO): Promise<IExamMatrixResponseDTO>;

  /**
   * @description Loại bỏ Ma trận đề thi khỏi hệ thống.
   * @param {string} id - Mã định danh của ma trận cần xóa.
   * @returns {Promise<IDeleteResponseDTO>}
   */
  delete(id: string): Promise<IDeleteResponseDTO>;

  /**
   * @description Khôi phục Ma trận đề thi đã bị xóa mềm.
   * @param {string} id - Mã định danh của ma trận cần khôi phục.
   * @returns {Promise<IExamMatrixResponseDTO>}
   * @throws {AppError} Ném lỗi nếu không tìm thấy ma trận hoặc có lỗi hệ thống.
   */
  restore(id: string): Promise<IExamMatrixResponseDTO>;

  /**
   * @description Xác thực sự tồn tại và tính hợp lệ của Ma trận đề thi (Referential Integrity).
   * @param {string} id - Mã định danh duy nhất của Ma trận cần kiểm tra.
   * @returns {Promise<void>} Trả về Promise rỗng nếu hợp lệ.
   * @throws {AppError} Ném lỗi INVALID_MATRIX_ID nếu ma trận không tồn tại hoặc đã bị xóa mềm.
   */
  validateExistence(id: string): Promise<void>;
}