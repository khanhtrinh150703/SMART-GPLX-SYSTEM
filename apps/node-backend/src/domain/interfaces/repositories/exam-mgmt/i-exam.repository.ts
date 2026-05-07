
import { IExamUserFilterOptions } from "@/application/dtos/request/exam/exam-query-list.request.dto";
import { ExamQueryDTO } from "@/application/dtos/request/exam/exam-query.request.dto";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { ExamRelatedCount } from "@/shared/types/count.types";

/**
 * @description Interface định nghĩa các phương thức thao tác dữ liệu cho Exam.
 */
export interface IExamRepository {
  /**
   * @description Lấy thông tin bài thi kèm theo danh sách câu hỏi (Snapshot).
   * @param id - ID của bài thi.
   * @returns {Promise<ExamEntity | null>}
   */
  getByIdWithQuestions(id: string): Promise<ExamEntity | null>;

  /**
   * @description Tìm kiếm thông tin cơ bản của bài thi theo ID.
   * @param id - ID của bài thi cần tìm.
   * @returns {Promise<ExamEntity | null>}
   */
  findById(id: string): Promise<ExamEntity | null>;

  /**
   * @description Lưu thông tin bài thi mới vào cơ sở dữ liệu.
   * @param exam - Đối tượng thực thể bài thi (ExamEntity) cần lưu.
   * @returns {Promise<ExamEntity>}
   */
  createExam(exam: ExamEntity): Promise<ExamEntity>;

  /**
   * @description Tìm kiếm đề thi theo ID, bao gồm cả các bản ghi đã bị xóa mềm.
   * Thường dùng cho các tác vụ hệ thống như khôi phục dữ liệu.
   * @param id - ID của đề thi.
   */
  findByIdSystem(id: string): Promise<ExamEntity | null>;

  /**
   * @description Lấy chi tiết bộ đề.
   * @param id - ID bộ đề.
   * @returns Thông tin bộ đề hoặc null.
   */
  findDetailById(id: string): Promise<ExamEntity | null>;

  /**
   * @description Tìm kiếm bài thi theo ID kết hợp với các điều kiện lọc bổ sung.
   * @param options - (Tùy chọn) Các tiêu chí lọc/tìm kiếm bổ sung.
   * @param skip - Số lượng bản ghi cần bỏ qua (Offset).
   * @param take - Số lượng bản ghi tối đa cần lấy trên một trang (Limit).
   * @returns {Promise<ExamEntity | null>} Trả về thực thể bài thi hoặc null nếu không khớp.
   */
  findAllUser(
    options: IExamUserFilterOptions,
    skip: number,
    take: number
  ): Promise<[ExamEntity[], number]>;

  /**
   * @description Cập nhật thông tin bài thi đã tồn tại trong cơ sở dữ liệu.
   * @param exam - Đối tượng thực thể bài thi (ExamEntity) mang dữ liệu cần cập nhật.
   * @returns {Promise<ExamEntity>} Trả về thực thể bài thi sau khi đã cập nhật thành công.
   */
  updateExam(exam: ExamEntity): Promise<ExamEntity>;

  /**
   * @description Xóa vĩnh viễn đề thi khỏi cơ sở dữ liệu (Hard Delete).
   * @param {string} id - ID của đề thi.
   * @returns {Promise<void>}
   */
  hardDelete(id: string): Promise<void>;

  /**
   * @description Đánh dấu xóa đề thi (Soft Delete) bằng cách cập nhật trường deletedAt.
   * @param {string} id - ID của đề thi.
   * @returns {Promise<void>}
   */
  softDelete(id: string): Promise<void>;

  /**
   * @description Khôi phục đề thi đã bị xóa mềm bằng cách gỡ bỏ đánh dấu thời gian xóa (deletedAt).
   * @param {string} id - ID của đề thi cần khôi phục.
   * @returns {Promise<void>}
   */
  restore(id: string): Promise<void>;

  /**
   * @description Tìm kiếm và đếm tổng số lượng đề thi có phân trang kèm bộ lọc.
   * @param {ExamQueryDTO} filter - Bộ lọc tìm kiếm chứa các điều kiện lọc đặc thù của Exam.
   * @param {number} skip - Số lượng bản ghi bỏ qua (thường là (page - 1) * limit).
   * @param {number} take - Số lượng bản ghi cần lấy ra (limit).
   * @returns {Promise<[ExamEntity[], number]>} Trả về một Tuple gồm danh sách Entity và tổng số bản ghi tìm thấy.
   */
  findAndCount(
    filter: ExamQueryDTO,
    skip: number,
    take: number
  ): Promise<[ExamEntity[], number]>;

  /**
   * @description Thống kê chi tiết số lượng các bản ghi đang tham chiếu đến Đề thi này.
   * Dùng để kiểm tra logic trước khi thực hiện Smart Delete.
   * @param {string} id - UUID của đề thi.
   * @returns {Promise<ExamRelatedCount>} Đối tượng chứa số lượng chi tiết.
   */
  countRelatedData(id: string): Promise<ExamRelatedCount>;
}