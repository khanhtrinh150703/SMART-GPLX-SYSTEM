import { ExamEntity } from "@/domain/entities/exam/exam.entity";

/**
 * @description Interface điều phối các nghiệp vụ liên quan đến Exam.
 */
export interface IExamService {

  /**
   * @description Lấy thông tin chi tiết một bài thi theo ID.
   * @param id - Mã định danh bài thi.
   * @returns {Promise<ExamEntity>}
   * @throws {AppError} Nếu không tìm thấy bài thi hoặc ID trống.
   */
  getExamById(id: string): Promise<ExamEntity>;
}