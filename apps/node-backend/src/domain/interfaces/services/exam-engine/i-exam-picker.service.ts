import { IExamMatrixProps } from "@/domain/entities/exam-matrix/exam-matrix.props";
import { Question } from "@/domain/entities/question/question.entity";

/**
 * @description Interface định nghĩa hành vi của dịch vụ bốc câu hỏi trong Domain.
 * Chịu trách nhiệm thực thi thuật toán chọn lọc câu hỏi từ kho dữ liệu dựa trên các quy tắc ma trận.
 */
export interface IExamPickerDomainService {
  /**
   * @description Thực thi thuật toán bốc câu hỏi theo định mức chương và ràng buộc điểm liệt.
   * @param {Question[]} pool - Kho câu hỏi thô đã được lọc theo hạng bằng lái.
   * @param {IExamMatrixProps} matrix - Cấu hình ma trận (số lượng câu mỗi chương, số câu điểm liệt).
   * @returns {Question[]} Danh sách các câu hỏi được chọn lọc cuối cùng cho đề thi.
   * @throws {AppError} Khi kho câu hỏi không đủ đáp ứng yêu cầu của ma trận.
   */
  execute(pool: Question[], matrix: IExamMatrixProps): Question[];
}