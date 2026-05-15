import { ExamHistorySummaryResponseDTO, IExamHistorySummaryResponseDTO } from "@/application/dtos/response/exam-history/exam-history-summary.response.dto";
import { ExamHistorySummaryEntity } from "@/domain/entities/exam-history/exam-history-summary.entity";
import { IExamHistorySummaryRecord } from "@/infrastructure/persistence";
import { BaseMapper } from "@/shared/mappers/base.mapper";

export class ExamHistorySummaryMapper extends BaseMapper {
  /**
   * @description Quy tắc 1: Khôi phục thực thể từ Database (Reconstitute).
   */
  public static toDomain(raw: IExamHistorySummaryRecord): ExamHistorySummaryEntity {
    return ExamHistorySummaryEntity.reconstitute({
      id: raw.id,
      userId: raw.userId,
      examName: raw.examName,
      licenseCategoryId: raw.licenseCategoryId,
      licenseCategoryName: raw.licenseCategoryName,
      score: raw.score,
      totalQuestions: raw.totalQuestions,
      isPassed: raw.isPassed,
      durationSeconds: raw.duration,
      snapshotId: raw.snapshotId,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      updatedAt: raw.createdAt, 
    });
  }

  /**
   * @description Quy tắc 2: Ánh xạ từ Entity sang Record đầy đủ (Full Persistence).
   */
  public static toPersistence(entity: ExamHistorySummaryEntity): IExamHistorySummaryRecord {
    return {
      id: entity.id!, 
      userId: entity.userId,
      examName: entity.examName,
      licenseCategoryId: entity.licenseCategoryId,
      licenseCategoryName:  entity.licenseCategoryName,
      score: entity.score,
      totalQuestions: entity.totalQuestions,
      isPassed: entity.isPassed,
      duration: entity.durationSeconds,
      snapshotId: entity.snapshotId,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
      deletedAt: entity.deletedAt,
    };
  }

  /**
   * @description Quy tắc 3: Trả về DTO sạch cho Client.
   */
  public static toResponse(entity: ExamHistorySummaryEntity): IExamHistorySummaryResponseDTO {
    return new ExamHistorySummaryResponseDTO({
      examName: entity.examName,
      score: entity.score,
      totalQuestions: entity.totalQuestions,
      licenseCategoryName: entity.licenseCategoryName,
      snapshotId: entity.snapshotId,
      isPassed: entity.isPassed,
      createdAt: entity.createdAt ?? new Date(),
      durationSeconds: entity.durationSeconds,
    });
  }

  /**
   * @description Mở rộng: Chuyên biệt cho INSERT (Toàn bộ các trường).
   */
  public static toCreateRecord(entity: ExamHistorySummaryEntity): IExamHistorySummaryRecord {
    return this.toPersistence(entity);
  }

  /**
   * @description Mở rộng: Chuyên biệt cho UPDATE (Loại bỏ Immutable Fields).
   * Sử dụng Destructuring để loại bỏ các trường không được phép sửa đổi.
   */
  public static toUpdateRecord(entity: ExamHistorySummaryEntity) {
    const record = this.toPersistence(entity);

    // Destructuring Omit: Tường minh trường ID, UserID và Ngày tạo bị loại bỏ.
    const {
      id: _unusedId,
      userId: _unusedUserId,
      createdAt: _unusedCreatedAt,
      ...updateData
    } = record;

    return updateData;
  }
}
