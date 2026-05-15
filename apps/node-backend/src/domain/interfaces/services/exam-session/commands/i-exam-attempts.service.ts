import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";

/**
 * @interface IExamAttemptService
 * @description Dịch vụ quản lý nghiệp vụ thay đổi trạng thái (Write-side) cho các lượt thi.
 * Chịu trách nhiệm lưu trữ Snapshot bất biến và điều phối việc xóa dữ liệu.
 */
export interface IExamAttemptService {
  /**
   * @description Thực hiện đồng bộ hóa thực thể lượt thi vào hệ thống lưu trữ.
   * @param {ExamAttemptEntity} entity - Thực thể lượt thi đã được định danh và kiểm soát tính toàn vẹn.
   * @returns {Promise<ExamAttemptEntity>} Thực thể lượt thi sau khi đã được lưu trữ thành công.
   */
  createAttempt(entity: ExamAttemptEntity): Promise<ExamAttemptEntity>;

  /**
   * @description Xóa mềm (Soft Delete) lượt thi.
   * @param {string} id - ID định danh lượt thi.
   */
  softDeleteAttempt(id: string): Promise<void>;

  /**
   * @description Xóa vĩnh viễn (Hard Delete) bản ghi lượt thi khỏi hệ thống.
   * @param {string} id - ID định danh lượt thi.
   */
  hardDeleteAttempt(id: string): Promise<void>;
}
