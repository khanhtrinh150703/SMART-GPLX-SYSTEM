import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { CreateExamAttemptProps } from "@/domain/entities/exam-attempt/exam-attempt.props";

/**
 * @interface IExamAttemptService
 * @description Dịch vụ quản lý nghiệp vụ thay đổi trạng thái (Write-side) cho các lượt thi.
 * Chịu trách nhiệm lưu trữ Snapshot bất biến và điều phối việc xóa dữ liệu.
 */
export interface IExamAttemptService {
  /**
   * @description Lưu kết quả một lượt thi mới vào hệ thống.
   * Thường được kích hoạt sau khi hoàn tất quy trình chấm điểm (Grading logic).
   * @param {CreateExamAttemptProps} props - Dữ liệu khởi tạo bao gồm thông tin Snapshot và kết quả đạt/trượt.
   * @returns {Promise<IExamAttemptResponseDTO>} DTO của lượt thi vừa được tạo.
   */
  createAttempt(props: CreateExamAttemptProps): Promise<IExamAttemptResponseDTO>;

  /**
   * @description Xóa mềm (Soft Delete) lượt thi.
   * Ẩn dữ liệu phía người dùng nhưng vẫn giữ lại trong Database phục vụ thống kê và Audit.
   * @param {string} id - ID định danh lượt thi.
   */
  softDeleteAttempt(id: string): Promise<void>;

  /**
   * @description Xóa vĩnh viễn (Hard Delete) bản ghi lượt thi khỏi hệ thống.
   * @param {string} id - ID định danh lượt thi.
   */
  hardDeleteAttempt(id: string): Promise<void>;
}