import { QuestionStatisticsResponseDTO } from "@/application/dtos/response/statistics/question-statistics.response.dto";
import { QuestionStatisticsEntity } from "@/domain/entities/statistics/question-statistics.entity";
import { IQuestionStatisticsRecord } from "@/infrastructure/persistence";
import { BaseMapper } from "@/shared/mappers/base.mapper";

export class QuestionStatisticsMapper extends BaseMapper {
  /**
   * @description Ánh xạ từ bản ghi Persistence (DB) sang thực thể Domain.
   * Sử dụng khi lấy dữ liệu từ Repository lên để xử lý nghiệp vụ.
   */
  public static toDomain(
    raw: IQuestionStatisticsRecord,
  ): QuestionStatisticsEntity {
    return QuestionStatisticsEntity.reconstitute({
      id: raw.questionId,

      // --- ATTEMPT METRICS ---
      totalAttempts: raw.totalAttempts,
      correctCount: raw.correctCount,
      wrongCount: raw.wrongCount,
      unansweredCount: raw.unansweredCount,

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
   * @description Chuyển đổi thực thể sang bản ghi Persistence để lưu xuống Database.
   * Đảm bảo dữ liệu thô và các tỷ lệ đã tính toán được bảo toàn.
   */
  public static toPersistence(
    entity: QuestionStatisticsEntity,
  ): IQuestionStatisticsRecord {
    const { props } = entity;

    return {
      questionId: props.id,

      // --- ATTEMPT METRICS ---
      totalAttempts: props.totalAttempts,
      correctCount: props.correctCount,
      wrongCount: props.wrongCount,
      unansweredCount: props.unansweredCount,

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
   * @description Chuyên biệt cho hành động INSERT.
   * Trả về toàn bộ các trường để ghi mới vào Database.
   */
  public static toCreateRecord(
    entity: QuestionStatisticsEntity,
  ): IQuestionStatisticsRecord {
    return this.toPersistence(entity);
  }

  /**
   * @description Chuyên biệt cho hành động UPDATE.
   */
  public static toUpdateRecord(entity: QuestionStatisticsEntity) {
    const record = this.toPersistence(entity);

    // Destructuring Omit: Loại bỏ các trường bất biến
    const {
      questionId: _q, // Khóa chính - Cấm update
      createdAt: _c, // Ngày tạo - Cấm update
      ...updateData
    } = record;

    return updateData;
  }

  /**
   * @description Chuyển đổi thực thể sang DTO phản hồi cho Client (Toàn hệ thống).
   * Cung cấp cái nhìn tổng quan về độ khó của câu hỏi dựa trên dữ liệu cộng dồn.
   */
  public static toResponse(
    entity: QuestionStatisticsEntity,
  ): QuestionStatisticsResponseDTO {
    const props = entity.props;

    return QuestionStatisticsResponseDTO.create({
      totalAttempts: props.totalAttempts,
      correctCount: props.correctCount, 
      wrongCount: props.wrongCount,
      errorRate: props.errorRate,

      // Chỉ số thời gian trung bình (giây) giúp xác định độ phức tạp câu hỏi
      averageDuration: props.averageDuration,

      // Đảm bảo định dạng string cho ISO Date
      createdAt: props.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: props.updatedAt?.toISOString() ?? new Date().toISOString(),
    });
  }
}
