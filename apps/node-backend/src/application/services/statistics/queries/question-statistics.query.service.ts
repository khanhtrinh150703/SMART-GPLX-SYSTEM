import { QuestionStatisticsResponseDTO } from "@/application/dtos/response/statistics/question-statistics.response.dto";
import { IQuestionStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { IQuestionStatisticsQuery } from "@/domain/interfaces/services/statistics/queries";
import { QuestionStatisticsMapper } from "@/infrastructure/database/mappers/statistics";

/**
 * @interface IQuestionStatisticsQueryCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho QuestionStatisticsQuery qua Awilix.
 */
export interface IQuestionStatisticsQueryCradle {
  /** @description Repository chịu trách nhiệm truy xuất dữ liệu thống kê câu hỏi từ Database. */
  questionStatisticsRepository: IQuestionStatisticsRepository;
}

/**
 * @class QuestionStatisticsQuery
 * @description Triển khai các yêu cầu truy vấn dữ liệu thống kê câu hỏi.
 * Tập trung vào việc lấy dữ liệu nhanh và ánh xạ (mapping) sang DTO.
 */
export class QuestionStatisticsQuery implements IQuestionStatisticsQuery {
  private readonly _questionStatsRepo: IQuestionStatisticsRepository;

  /**
   * @description Khởi tạo Query Service.
   * @param {IQuestionStatisticsQueryCradle} cradle - Chỉ chứa Repository cho việc đọc.
   */
  constructor({
    questionStatisticsRepository,
  }: IQuestionStatisticsQueryCradle) {
    this._questionStatsRepo = questionStatisticsRepository;
  }

  /**
   * @description Truy vấn danh sách các câu hỏi có tỷ lệ lỗi cao nhất.
   * Thường dùng để hiển thị danh sách "Câu hỏi hay sai nhất".
   *
   * @param {number} limit - Số lượng bản ghi cần lấy.
   * @returns {Promise<QuestionStatisticsResponseDTO[]>} Danh sách DTO đã được lọc dữ liệu nhạy cảm.
   */
  public async getTopDifficultQuestions(
    limit: number,
  ): Promise<QuestionStatisticsResponseDTO[]> {
    // Gọi trực tiếp Repository để lấy danh sách Entity
    const entities =
      await this._questionStatsRepo.findTopDifficultQuestions(limit);

    // Sử dụng BaseMapper để chuyển đổi hàng loạt sang DTO
    // Dịch: Ánh xạ danh sách thực thể sang danh sách phản hồi.
    return QuestionStatisticsMapper.toResponseList(entities);
  }

  /**
   * @description Lấy thông tin thống kê chi tiết của một câu hỏi cụ thể.
   *
   * @param {string} questionId - ID định danh câu hỏi.
   * @returns {Promise<QuestionStatisticsResponseDTO | null>}
   */
  public async getById(
    questionId: string,
  ): Promise<QuestionStatisticsResponseDTO | null> {
    const entity = await this._questionStatsRepo.findById(questionId);

    if (!entity) return null;

    // Chuyển đổi thực thể đơn lẻ sang DTO
    return QuestionStatisticsMapper.toResponse(entity);
  }
}
