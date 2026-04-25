import { ExamEntity } from "@/domain/entities/exam/exam.entity";

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
}