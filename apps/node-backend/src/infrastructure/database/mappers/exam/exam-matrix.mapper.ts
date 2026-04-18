import { IExamMatrixRecord } from "@/infrastructure/persistence/exam-matrix/exam-matrix.record";
import { ExamMatrix} from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { ExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { Prisma } from "@prisma/client";
import { IExamMatrixDetailProps } from "@/domain/entities/exam-matrix/exam-matrix.props";

/**
 * @description Định nghĩa Type cho Record được trả về từ Prisma kèm theo quan hệ details.
 * Sử dụng Prisma Namespace để đảm bảo Type-safe tuyệt đối.
 */
export type ExamMatrixWithDetails = Prisma.ExamMatrixGetPayload<{
  include: { details: true };
}>;

export class ExamMatrixMapper {

  /**
   * @description Chuyển đổi từ dữ liệu thô (Database Record) sang thực thể Domain (Rich Entity).
   * @param {IExamMatrixRecord} raw - Dữ liệu thô từ Database.
   * @returns {ExamMatrix} Thực thể Domain với logic nghiệp vụ.
   */
  public static toDomain(raw: IExamMatrixRecord): ExamMatrix {
    // Map mảng details
    const details: IExamMatrixDetailProps[] = (raw.details ?? []).map((d) => ({
      id: d.id,
      chapterId: d.chapterId,
      percentage: d.percentage
    }));

    // Trả về thực thể Domain
    return ExamMatrix.create({
      id: raw.id,
      licenseCategoryId: raw.licenseCategoryId,
      totalQuestions: raw.totalQuestions,
      passingScore: raw.passingScore,
      durationMinutes: raw.durationMinutes,
      minCriticalQuestions: raw.minCriticalQuestions,
      deletedAt: raw.deletedAt,
      details
    });
  }

  /**
   * @description Chuyển đổi thực thể Domain sang cấu trúc dữ liệu cho Prisma (Persistence).
   * @param {ExamMatrix} entity - Thực thể Domain.
   * @returns {Prisma.ExamMatrixUncheckedCreateInput} Dữ liệu đã chuẩn hóa cho Prisma.
   */
  public static toPersistence(entity: ExamMatrix): Prisma.ExamMatrixUncheckedCreateInput {
    const props = entity.props;

    return {
      id: props.id, // UUID của ExamMatrix
      licenseCategoryId: props.licenseCategoryId,
      totalQuestions: props.totalQuestions,
      passingScore: props.passingScore,
      durationMinutes: props.durationMinutes,
      minCriticalQuestions: props.minCriticalQuestions,
      // Lưu ý: deletedAt thường không truyền khi create, nhưng nếu cần:
      deletedAt: props.deletedAt ?? null,

      details: {
        create: props.details.map(d => ({
          id: d.id, // BẮT BUỘC: Phải có ID cho từng ExamMatrixDetail
          chapterId: d.chapterId, // Đảm bảo d.chapterId là String
          percentage: d.percentage
        }))
      }
    };
  }

  /**
   * @description Chuyển đổi thực thể Domain sang DTO trả về cho phía Client.
   * @param {ExamMatrix} entity - Thực thể Domain.
   * @returns {ExamMatrixResponseDTO} Dữ liệu đã lọc và chuẩn hóa.
   */
  public static toResponse(entity: ExamMatrix): ExamMatrixResponseDTO {
    const props = entity.props;
    return new ExamMatrixResponseDTO({
      id: props.id ?? "",
      licenseCategoryId: props.licenseCategoryId,
      totalQuestions: props.totalQuestions,
      passingScore: props.passingScore,
      durationMinutes: props.durationMinutes,
      minCriticalQuestions: props.minCriticalQuestions,
      details: props.details.map(d => ({
        chapterId: d.chapterId,
        percentage: d.percentage
      }))
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang danh sách DTO.
   * @param {ExamMatrix[]} entities - Danh sách thực thể.
   * @returns {ExamMatrixResponseDTO[]} Danh sách DTO.
   */
  public static toResponseList(entities: ExamMatrix[]): ExamMatrixResponseDTO[] {
    return entities.map(entity => this.toResponse(entity));
  }
}