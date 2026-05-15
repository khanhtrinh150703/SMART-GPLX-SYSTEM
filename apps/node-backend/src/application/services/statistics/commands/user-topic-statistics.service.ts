import { UpdateUserTopicStatisticsCommand } from "@/application/dtos/request/statistics/update-user-topic-statistics.request.dto";
import { UserTopicStatisticsEntity } from "@/domain/entities/statistics/user-topic-statistics.entity";
import { IUserTopicStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { IUserTopicStatisticsService } from "@/domain/interfaces/services/statistics/commands";

/**
 * @interface IUserTopicStatisticsServiceCradle
 * @description Các phụ thuộc cần thiết cho UserTopicStatisticsService.
 */
export interface IUserTopicStatisticsServiceCradle {
  userTopicStatisticsRepository: IUserTopicStatisticsRepository;
}

/**
 * @class UserTopicStatisticsService
 * @description Điều phối các hành động thay đổi trạng thái thống kê theo chủ đề của người dùng.
 */
export class UserTopicStatisticsService implements IUserTopicStatisticsService {
  private readonly _userTopicRepo: IUserTopicStatisticsRepository;

  /**
   * @description Khởi tạo Service.
   * @param {IUserTopicStatisticsServiceCradle} cradle - Dependencies từ DI Container.
   */
  constructor({
    userTopicStatisticsRepository,
  }: IUserTopicStatisticsServiceCradle) {
    this._userTopicRepo = userTopicStatisticsRepository;
  }

  public async updateBulkProgress(
    command: UpdateUserTopicStatisticsCommand,
  ): Promise<void> {
    const { userId, results } = command;

    // 1. Aggregation: Gom nhóm kết quả theo TopicId ngay trên RAM
    // Mục tiêu: Tính tổng Correct, Wrong, Unanswered và Duration cho từng Topic
    const topicSummary = results.reduce(
      (acc, cur) => {
        if (!acc[cur.topicId]) {
          acc[cur.topicId] = {
            name: cur.topicName,
            correct: 0,
            wrong: 0,
            unanswered: 0,
            duration: 0,
          };
        }

        const stats = acc[cur.topicId];
        stats.duration += cur.duration;

        if (cur.isUnanswered) {
          stats.unanswered += 1;
        } else if (cur.isCorrect) {
          stats.correct += 1;
        } else {
          stats.wrong += 1;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          correct: number;
          wrong: number;
          unanswered: number;
          duration: number;
        }
      >,
    );

    // 2. Batch Persistence: Xử lý song song từng Topic đã gom nhóm
    await Promise.all(
      Object.entries(topicSummary).map(async ([topicId, data]) => {
        let statsEntity = await this._userTopicRepo.findByUserAndTopic(
          userId,
          topicId,
        );
        const initialAttempted = data.correct + data.wrong + data.unanswered;
        if (!statsEntity) {
          // Trường hợp 1: Tạo mới (Lần đầu học chủ đề này)
          statsEntity = UserTopicStatisticsEntity.create({
            userId,
            topicId,
            topicName: data.name,
            totalQuestions: 20,
            correctAnswers: data.correct,
            questionsAttempted: initialAttempted,
            wrongAnswers: data.wrong,
            unanswered: data.unanswered,
            totalDurationSum: data.duration,
          });
          return this._userTopicRepo.create(statsEntity);
        }

        // Trường hợp 2: Đã tồn tại -> Cộng dồn (Incremental Update)
        statsEntity.updateStats({
          additionalCorrect: data.correct,
          additionalWrong: data.wrong,
          additionalUnanswered: data.unanswered,
          additionalDuration: data.duration,
          additionalAttempted: 10,
        });

        return this._userTopicRepo.update(statsEntity);
      }),
    );
  }
}
