import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";

/**
 * @description Giao diện Repository cho Ma trận đề thi.
 * Chỉ làm việc với Domain Entity, không phụ thuộc vào công nghệ Database cụ thể.
 */
export interface IExamMatrixRepository {

  /**
   * @description Tìm một ma trận theo ID.
   * @param {string} id - UUID của ma trận.
   * @returns {Promise<ExamMatrix | null>} Trả về thực thể Domain hoặc null nếu không thấy.
   */
  findById(id: string): Promise<ExamMatrix | null>;

  /**
   * @description Truy vấn một ma trận theo ID, bao gồm cả các bản ghi đã xóa mềm (Persistence/Database).
   * @param {string} id - UUID định danh duy nhất của ma trận.
   * @returns {Promise<ExamMatrix | null>} Thực thể Domain hoặc null nếu không tồn tại trong DB.
   */
  findByIdSystem(id: string): Promise<ExamMatrix | null>;

  /**
   * @description Lưu mới một thực thể ma trận vào hệ thống.
   * @param {ExamMatrix} entity - Thực thể Domain cần lưu trữ.
   * @returns {Promise<ExamMatrix>} Thực thể đã được lưu kèm ID (nếu tạo mới).
   */
  save(entity: ExamMatrix): Promise<ExamMatrix>;

  /**
   * @description Cập nhật dữ liệu cho một ma trận hiện có.
   * @param {string} id - ID của ma trận cần cập nhật.
   * @param {ExamMatrix} entity - Thực thể chứa dữ liệu mới.
   * @returns {Promise<ExamMatrix>} Thực thể sau khi đã cập nhật.
   */
  update(id: string, entity: ExamMatrix): Promise<ExamMatrix>;

  /**
   * @description Xóa vĩnh viễn ma trận khỏi cơ sở dữ liệu (Hard Delete).
   * @param {string} id - ID của ma trận.
   * @returns {Promise<void>}
   */
  delete(id: string): Promise<void>;

  /**
   * @description Đánh dấu xóa ma trận (Soft Delete) bằng cách cập nhật trường deletedAt.
   * @param {string} id - ID của ma trận.
   * @returns {Promise<void>}
   */
  softDelete(id: string): Promise<void>;

  /**
   * @description Kiểm tra số lượng đề thi đang sử dụng ma trận này.
   * Phục vụ cho chiến lược Smart Delete.
   * @param {string} id - ID của ma trận.
   * @returns {Promise<number>} Số lượng liên kết tìm thấy.
   */
  countLinkedExams(id: string): Promise<number>;

  /**
   * @description Khôi phục Ma trận đề thi đã bị xóa mềm.
   * @param {string} id - Mã định danh của ma trận cần khôi phục.
   * @returns {Promise<void>}
   * @throws {AppError} Ném lỗi nếu không tìm thấy ma trận hoặc có lỗi hệ thống.
   */
  restore(id: string): Promise<void>;
}