import { CreateExamMatrixDTO } from "@/application/dtos/request/exam-matrix/create-exam-matrix.dto";
import { UpdateExamMatrixDTO } from "@/application/dtos/request/exam-matrix/update-exam-matrix.dto";
import { ExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";

/**
 * @interface IExamMatrixService
 * @description Giao diện định nghĩa các kịch bản nghiệp vụ (use cases) cho Ma trận đề thi (Exam Matrix).
 * Đảm bảo các luồng dữ liệu được điều phối chính xác giữa Controller và Repository.
 */
export interface IExamMatrixService {
  
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
   * @returns {Promise<void>}
   */
  delete(id: string): Promise<void>;

  /**
   * @description Truy vấn và lấy thông tin chi tiết của một Ma trận đề thi cụ thể.
   * @param {string} id - Mã định danh của ma trận cần tìm.
   * @returns {Promise<ExamMatrixResponseDTO>} Thông tin chi tiết của ma trận.
   */
  getById(id: string): Promise<ExamMatrixResponseDTO>;

  /**
   * @description Khôi phục Ma trận đề thi đã bị xóa mềm.
   * @param {string} id - Mã định danh của ma trận cần khôi phục.
   * @returns {Promise<ExamMatrixResponseDTO>}
   * @throws {AppError} Ném lỗi nếu không tìm thấy ma trận hoặc có lỗi hệ thống.
   */
  restore(id: string): Promise<ExamMatrixResponseDTO>;
}