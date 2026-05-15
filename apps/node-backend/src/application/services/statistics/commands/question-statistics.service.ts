import { QuestionStatisticsEntity } from "@/domain/entities/statistics/question-statistics.entity";
import {
  IQuestionAttemptRequest,
  IRecordBulkAttemptsRequest,
} from "@/domain/entities/statistics/question-statistics.props";
import { IQuestionStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { IQuestionStatisticsService } from "@/domain/interfaces/services/statistics/commands";

/**
 * @interface IQuestionStatisticsServiceCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho QuestionStatisticsService qua DI Container (Awilix).
 */
export interface IQuestionStatisticsServiceCradle {
  questionStatisticsRepository: IQuestionStatisticsRepository;
}

/**
 * @class QuestionStatisticsService
 * @description Triển khai các nghiệp vụ thay đổi trạng thái thống kê câu hỏi.
 * Điều phối luồng dữ liệu: Repository -> Entity (Logic) -> Repository.
 */
export class QuestionStatisticsService implements IQuestionStatisticsService {
  private readonly _questionStatsRepo: IQuestionStatisticsRepository;

  /**
   * @description Khởi tạo Service với các phụ thuộc được tiêm (injected) dưới dạng Proxy.
   * @param {IQuestionStatisticsServiceCradle} cradle - Chứa các Repository cần thiết.
   */
  constructor({
    questionStatisticsRepository,
  }: IQuestionStatisticsServiceCradle) {
    this._questionStatsRepo = questionStatisticsRepository;
  }

  /**
   * @description Ghi nhận một lượt trả lời đơn lẻ.
   */
  public async recordAttempt(data: IQuestionAttemptRequest): Promise<void> {
    const { questionId, isCorrect, duration, isUnanswered = false } = data;

    // 1. Tìm kiếm thống kê đã tồn tại
    const existingStats = await this._questionStatsRepo.findById(questionId);

    if (!existingStats) {
      // 2. Khởi tạo thực thể mới nếu lần đầu câu hỏi này được trả lời
      const newStats = QuestionStatisticsEntity.create({
        id: questionId,
        totalAttempts: 1,
        correctCount: !isUnanswered && isCorrect ? 1 : 0,
        wrongCount: !isUnanswered && !isCorrect ? 1 : 0,
        unansweredCount: isUnanswered ? 1 : 0,
        totalDurationSum: duration,
      });

      await this._questionStatsRepo.create(newStats);
      return;
    }

    // 3. Đã tồn tại -> Cập nhật thông qua Entity (tự tính toán tỷ lệ bên trong)
    existingStats.recordAttempt(isCorrect, duration, isUnanswered);
    await this._questionStatsRepo.update(existingStats);
  }

  /**
   * @description Xử lý cập nhật thống kê hàng loạt (Tối ưu cho trang Kết quả thi).
   */
  public async recordBulkAttempts(
    request: IRecordBulkAttemptsRequest,
  ): Promise<void> {
    const { attempts } = request;
    if (!attempts || attempts.length === 0) return;

    // 1. Thu thập danh sách ID để Batch Fetch (truy vấn một lần cho nhanh)
    const questionIds = attempts.map((a) => a.questionId);
    const existingStatsList =
      await this._questionStatsRepo.findByIds(questionIds);

    // 2. Chuyển sang Map để tìm kiếm nhanh với độ phức tạp $O(1)$
    const statsMap = new Map(existingStatsList.map((s) => [s.id, s]));

    // 3. Chuẩn bị danh sách các task lưu trữ
    const persistencePromises = attempts.map(async (attempt) => {
      const { questionId, isCorrect, duration, isUnanswered = false } = attempt;
      const stats = statsMap.get(questionId);

      if (!stats) {
        // Trường hợp câu hỏi chưa bao giờ có thống kê
        const newStats = QuestionStatisticsEntity.create({
          id: questionId,
          totalAttempts: 1,
          correctCount: !isUnanswered && isCorrect ? 1 : 0,
          wrongCount: !isUnanswered && !isCorrect ? 1 : 0,
          unansweredCount: isUnanswered ? 1 : 0,
          totalDurationSum: duration,
        });
        return this._questionStatsRepo.create(newStats);
      }

      // Trường hợp đã có -> Ra lệnh cho Entity cập nhật logic
      stats.recordAttempt(isCorrect, duration, isUnanswered);
      return this._questionStatsRepo.update(stats);
    });

    // 4. Thực thi lưu trữ song song để tối ưu IO
    await Promise.all(persistencePromises);
  }
}
