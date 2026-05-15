import {
  IUserStatisticsResponseDTO,
  UserStatisticsResponseDTO,
} from "@/application/dtos/response/statistics/user-statistics.response.dto";
import { UserStatisticsEntity } from "@/domain/entities/statistics/user-statistics.entity";
import { IUserStatisticsRecord } from "@/infrastructure/persistence";
import { BaseMapper } from "@/shared/mappers/base.mapper";

export class UserStatisticsMapper extends BaseMapper {
  /**
   * @description Quy tắc 1: Khôi phục thực thể từ DB (Reconstitute).
   */
  /**
   * @description Chuyển đổi dữ liệu thô từ Database (Persistence Layer) sang thực thể Domain.
   * Đảm bảo mọi chỉ số thống kê và kỷ lục được tái cấu trúc chính xác.
   */
  public static toDomain(raw: IUserStatisticsRecord): UserStatisticsEntity {
    return UserStatisticsEntity.reconstitute({
      // 1. Định danh: Vì userId là @id trong Prisma, ta ánh xạ nó vào id của Entity Base
      id: raw.userId,
      userId: raw.userId,

      // 2. Nhóm chỉ số bài thi
      totalExams: raw.totalExams,
      passedExams: raw.passedExams,
      failedExams: raw.failedExams,
      failedByCritical: raw.failedByCritical,

      // 3. Nhóm chi tiết câu hỏi
      totalQuestionsAnswered: raw.totalQuestionsAnswered,
      totalCorrectAnswers: raw.totalCorrectAnswers,
      totalWrongAnswers: raw.totalWrongAnswers,
      totalUnanswered: raw.totalUnanswered,

      // 4. Nhóm hiệu suất điểm số & Kỷ lục
      averageScore: raw.averageScore,
      highScore: raw.highScore,
      highScoreExamId: raw.highScoreExamId,
      highScoreExamName: raw.highScoreExamName,
      lowScore: raw.lowScore,
      lowScoreExamId: raw.lowScoreExamId,
      lowScoreExamName: raw.lowScoreExamName,

      // 5. Nhóm hiệu suất thời gian
      averageDuration: raw.averageDuration,
      fastestDuration: raw.fastestDuration,
      fastestExamId: raw.fastestExamId,
      fastestExamName: raw.fastestExamName,
      slowestDuration: raw.slowestDuration,

      // 6. Nhóm phong độ & Xếp hạng
      currentStreak: raw.currentStreak,
      maxStreak: raw.maxStreak,
      currentRank: raw.currentRank,

      // 7. Dấu thời gian hệ thống
      lastExamAt: raw.lastExamAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  /**
   * @description Ánh xạ từ thực thể Domain sang bản ghi Persistence (Full Sync).
   * Đảm bảo mọi chỉ số tính toán được lưu trữ bền vững xuống Database.
   */
  public static toPersistence(
    entity: UserStatisticsEntity,
  ): IUserStatisticsRecord {
    const props = entity.props; // Truy xuất bộ thuộc tính lõi của Entity
    return {
      userId: props.userId, // Khóa chính

      // 1. Nhóm chỉ số bài thi (Exam Totals)
      totalExams: props.totalExams,
      passedExams: props.passedExams,
      failedExams: props.failedExams,
      failedByCritical: props.failedByCritical,

      // 2. Nhóm chi tiết câu hỏi (Question Metrics)
      totalQuestionsAnswered: props.totalQuestionsAnswered,
      totalCorrectAnswers: props.totalCorrectAnswers,
      totalWrongAnswers: props.totalWrongAnswers,
      totalUnanswered: props.totalUnanswered,

      // 3. Nhóm hiệu suất điểm số & Kỷ lục (Score Records)
      averageScore: props.averageScore,
      highScore: props.highScore,
      highScoreExamId: props.highScoreExamId,
      highScoreExamName: props.highScoreExamName,
      lowScore: props.lowScore,
      lowScoreExamId: props.lowScoreExamId,
      lowScoreExamName: props.lowScoreExamName,

      // 4. Nhóm hiệu suất thời gian (Time Records)
      averageDuration: props.averageDuration,
      fastestDuration: props.fastestDuration,
      fastestExamId: props.fastestExamId,
      fastestExamName: props.fastestExamName,
      slowestDuration: props.slowestDuration,

      // 5. Nhóm phong độ & Xếp hạng (Streaks & Rank)
      currentStreak: props.currentStreak,
      maxStreak: props.maxStreak,
      currentRank: props.currentRank,

      // 6. Dấu thời gian hệ thống (Timestamps)
      lastExamAt: props.lastExamAt,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: new Date(),
      deletedAt: props.deletedAt ?? null,
    };
  }

  /**
   * @description Mở rộng: Chuyên biệt cho INSERT (Toàn bộ trường).
   */
  public static toCreateRecord(
    entity: UserStatisticsEntity,
  ): IUserStatisticsRecord {
    return this.toPersistence(entity);
  }

  /**
   * @description Mở rộng: Chuyên biệt cho UPDATE (Loại bỏ Immutable Fields).
   * userId là @id nên CẤM update.
   */
  public static toUpdateRecord(entity: UserStatisticsEntity) {
    const record = this.toPersistence(entity);

    // Destructuring Omit: Tường minh và an toàn
    const {
      userId: _u, // Khóa chính không đổi
      createdAt: _c, // Ngày tạo không đổi
      ...updateData
    } = record;

    return updateData;
  }

  /**
   * @description Quy tắc 3: Chuyển đổi thực thể Domain sang DTO sạch cho Client.
   * Thực hiện làm đẹp dữ liệu (Formatting) và tính toán các chỉ số phái sinh (Derived Metrics).
   */
  public static toResponse(
    entity: UserStatisticsEntity,
  ): IUserStatisticsResponseDTO {
    const { props } = entity; // Destructuring để code gọn hơn

    // 1. Tính toán tỷ lệ đỗ (Pass Rate) - Làm tròn 1 chữ số thập phân
    const passRate =
      props.totalExams > 0
        ? Number(((props.passedExams / props.totalExams) * 100).toFixed(1))
        : 0;

    // 2. Tính toán tỷ lệ chính xác (Accuracy Rate)
    // Dựa trên tổng số câu đã trả lời (đúng/sai), không tính câu bỏ qua
    const totalAttempted = props.totalCorrectAnswers + props.totalWrongAnswers;
    const accuracyRate =
      totalAttempted > 0
        ? Number(
            ((props.totalCorrectAnswers / totalAttempted) * 100).toFixed(1),
          )
        : 0;

    // 3. Trả về DTO hoàn chỉnh
    return new UserStatisticsResponseDTO({
      // --- EXAM OVERVIEW ---
      totalExams: props.totalExams,
      passedExams: props.passedExams,
      failedExams: props.failedExams,
      failedByCritical: props.failedByCritical,
      passRate: passRate,

      // --- QUESTIONS & ACCURACY ---
      totalQuestionsAnswered: props.totalQuestionsAnswered,
      totalCorrectAnswers: props.totalCorrectAnswers,
      totalWrongAnswers: props.totalWrongAnswers,
      totalUnanswered: props.totalUnanswered,
      accuracyRate: accuracyRate,

      // --- SCORES ---
      averageScore: Number(props.averageScore.toFixed(2)),
      highScore: props.highScore,
      lowScore: props.lowScore,

      // --- DURATION ---
      averageDuration: Math.round(props.averageDuration),
      fastestDuration: props.fastestDuration,
      slowestDuration: props.slowestDuration,

      // --- PERFORMANCE & RANKING ---
      currentStreak: props.currentStreak,
      maxStreak: props.maxStreak,
      currentRank: props.currentRank,

      // --- RECORDS & METADATA ---
      highScoreExamName: props.highScoreExamName,
      fastestExamName: props.fastestExamName,
      lastExamAt: props.lastExamAt,
    });
  }

  /**
   * @description Trả về DTO thống kê trống với các chỉ số mặc định bằng 0.
   * @returns {IUserStatisticsResponseDTO} DTO "sạch" để Frontend render trạng thái chưa có dữ liệu.
   */
  public static toEmptyResponse(): IUserStatisticsResponseDTO {
    return new UserStatisticsResponseDTO({
      // --- EXAM OVERVIEW ---
      totalExams: 0,
      passedExams: 0,
      failedExams: 0,
      failedByCritical: 0,
      passRate: 0,

      // --- QUESTIONS & ACCURACY ---
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalUnanswered: 0,
      accuracyRate: 0,

      // --- SCORES ---
      averageScore: 0,
      highScore: 0,
      lowScore: 0,

      // --- DURATION (Tính bằng giây/phút tùy logic của bạn) ---
      averageDuration: 0,
      fastestDuration: 0,
      slowestDuration: 0,

      // --- PERFORMANCE & RANKING ---
      currentStreak: 0,
      maxStreak: 0,
      currentRank: "N/A", // Hoặc "Chưa xếp hạng"

      // --- RECORDS & METADATA ---
      highScoreExamName: null,
      fastestExamName: null,
      lastExamAt: null,
    });
  }
}
