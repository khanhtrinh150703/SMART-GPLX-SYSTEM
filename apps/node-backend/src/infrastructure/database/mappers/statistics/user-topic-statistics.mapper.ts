import { UserTopicStatisticsResponseDTO } from "@/application/dtos/response/statistics/user-topic-statistics.response.dto";
import { UserTopicStatisticsEntity } from "@/domain/entities/statistics/user-topic-statistics.entity";
import { IUserTopicStatisticsRecord } from "@/infrastructure/persistence";
import { BaseMapper } from "@/shared/mappers/base.mapper";

export class UserTopicStatisticsMapper extends BaseMapper {
  /**
   * @description Ánh xạ từ bản ghi cơ sở dữ liệu sang thực thể nghiệp vụ (Reconstitute).
   */
  public static toDomain(
    raw: IUserTopicStatisticsRecord,
  ): UserTopicStatisticsEntity {
    return UserTopicStatisticsEntity.reconstitute({
      id: raw.id,
      userId: raw.userId,
      topicId: raw.topicId,
      topicName: raw.topicName,

      // --- QUESTION METRICS ---
      totalQuestions: raw.totalQuestions,
      correctAnswers: raw.correctAnswers,
      wrongAnswers: raw.wrongAnswers,
      unanswered: raw.unanswered,
      questionsAttempted: raw.questionsAttempted,

      // --- TIME METRICS ---
      totalDurationSum: raw.totalDurationSum,
      averageDuration: raw.averageDuration,

      // --- ANALYTICS ---
      accuracyRate: raw.accuracyRate,
      errorRate: raw.errorRate,

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  /**
   * @description Chuyển đổi từ Domain Entity sang Database Record để lưu trữ.
   */
  public static toPersistence(
    entity: UserTopicStatisticsEntity,
  ): IUserTopicStatisticsRecord {
    const { props } = entity;

    return {
      id: props.id,
      userId: props.userId,
      topicId: props.topicId,
      topicName: props.topicName,

      // --- QUESTION METRICS ---
      totalQuestions: props.totalQuestions,
      correctAnswers: props.correctAnswers,
      wrongAnswers: props.wrongAnswers,
      unanswered: props.unanswered,
      questionsAttempted: props.questionsAttempted,

      // --- TIME METRICS ---
      totalDurationSum: props.totalDurationSum,
      averageDuration: props.averageDuration,

      // --- ANALYTICS ---
      accuracyRate: props.accuracyRate,
      errorRate: props.errorRate,

      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  /**
   * @description Chuyên biệt cho hành động INSERT (Toàn bộ các trường).
   * @param {UserTopicStatisticsEntity} entity
   * @returns {IUserTopicStatisticsRecord}
   */
  public static toCreateRecord(
    entity: UserTopicStatisticsEntity,
  ): IUserTopicStatisticsRecord {
    return this.toPersistence(entity);
  }

  /**
   * @description Chuyên biệt cho hành động UPDATE.
   * Loại bỏ các trường bất biến: id, userId, topicId và createdAt.
   * @param {UserTopicStatisticsEntity} entity
   */
  public static toUpdateRecord(entity: UserTopicStatisticsEntity) {
    const record = this.toPersistence(entity);

    // Destructuring Omit: Đảm bảo không bao giờ ghi đè các trường định danh
    const {
      id: _i,
      userId: _u,
      topicId: _t,
      createdAt: _c,
      ...updateData
    } = record;

    return updateData;
  }

  /**
   * @description Chuyển đổi từ Domain Entity sang Response DTO (Client-facing).
   * Đảm bảo mọi chỉ số từ DB đều được map chính xác để Frontend hiển thị Dashboard.
   */
  public static toResponse(
    entity: UserTopicStatisticsEntity,
  ): UserTopicStatisticsResponseDTO {
    const props = entity.props;

    return UserTopicStatisticsResponseDTO.create({
      topicId: props.topicId,
      topicName: props.topicName,

      // --- Progress ---
      totalQuestions: props.totalQuestions,
      questionsAttempted: props.questionsAttempted, 

      // --- Results ---
      correctAnswers: props.correctAnswers, 
      wrongAnswers: props.wrongAnswers,
      unanswered: props.unanswered, 
      accuracyRate: props.accuracyRate,
      errorRate: props.errorRate,

      // --- Time ---
      averageDuration: props.averageDuration, 

      // --- Timestamps ---
      createdAt: props.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: props.updatedAt?.toISOString() ?? new Date().toISOString(),
    });
  }
}
