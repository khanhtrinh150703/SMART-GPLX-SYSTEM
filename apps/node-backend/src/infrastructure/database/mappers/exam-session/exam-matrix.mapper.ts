import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { ExamMatrixResponseDTO, IExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { Prisma } from "@prisma/client";
import { IExamMatrixDetailProps } from "@/domain/entities/exam-matrix/exam-matrix.props";
import { ICachedExamMatrix } from "@/shared/master-data/exam-matrix";
import { ExamMatrixSelectionResponseDTO, IExamMatrixSelectionResponseDTO } from "@/application/dtos/response/exam-matrix/selection-exam-matrix.respone.dto";

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
  public static toDomain(raw: ExamMatrixWithDetails): ExamMatrix {
    // Map mảng details
    const details: IExamMatrixDetailProps[] = (raw.details ?? []).map((d) => ({
      id: d.id,
      chapterId: d.chapterId,
      percentage: d.percentage,
    }));

    // Trả về thực thể Domain
    return ExamMatrix.reconstitute({
      id: raw.id,
      name: raw.name,
      licenseCategoryId: raw.licenseCategoryId,
      totalQuestions: raw.totalQuestions,
      passingScore: raw.passingScore,
      durationMinutes: raw.durationMinutes,
      minCriticalQuestions: raw.minCriticalQuestions,
      details,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt || undefined,
      isDefault: raw.isDefault,
    });
  }

  /**
   * @description Chuyển đổi thực thể Domain sang cấu trúc dữ liệu cho Prisma (Persistence).
   * @param {ExamMatrix} entity - Thực thể Domain.
   * @returns {Prisma.ExamMatrixUncheckedCreateInput} Dữ liệu đã chuẩn hóa cho Prisma.
   */
  /**
     * @description Ánh xạ sang cấu trúc Prisma cho hành động CREATE.
     * @param {ExamMatrix} entity - Thực thể Domain.
     * @returns {Prisma.ExamMatrixCreateInput}
     */
  public static toCreatePersistence(entity: ExamMatrix): Prisma.ExamMatrixCreateInput {
    const props = entity.props;

    return {
      id: props.id, // ID do Entity tự gen (UUID)
      name: props.name,
      totalQuestions: props.totalQuestions,
      passingScore: props.passingScore,
      durationMinutes: props.durationMinutes,
      minCriticalQuestions: props.minCriticalQuestions,
      isDefault: props.isDefault,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      // Kết nối với Hạng bằng lái thông qua connect (Chuẩn Prisma)
      licenseCategory: {
        connect: { id: props.licenseCategoryId }
      },
      // Tạo mới toàn bộ details lồng nhau
      details: {
        create: props.details.map(d => ({
          chapterId: d.chapterId,
          percentage: d.percentage,
        }))
      }
    };
  }

  /**
   * @description Ánh xạ sang cấu trúc Prisma cho hành động UPDATE.
   * @param {ExamMatrix} entity - Thực thể Domain.
   * @returns {Prisma.ExamMatrixUpdateInput}
   */
  public static toUpdatePersistence(entity: ExamMatrix): Prisma.ExamMatrixUpdateInput {
    const props = entity.props;

    return {
      name: props.name,
      totalQuestions: props.totalQuestions,
      passingScore: props.passingScore,
      durationMinutes: props.durationMinutes,
      minCriticalQuestions: props.minCriticalQuestions,
      isDefault: props.isDefault,
      updatedAt: new Date(), // Luôn cập nhật thời gian sửa

      // Logic đồng bộ chi tiết (Re-sync pattern)
      details: {
        deleteMany: {}, // Xóa sạch cũ
        create: props.details.map(d => ({
          chapterId: d.chapterId,
          percentage: d.percentage,
        }))
      }
    };
  }

  /**
   * @description Chuyển đổi thực thể Domain sang DTO trả về cho phía Client.
   * @param {ExamMatrix} entity - Thực thể Domain.
   * @returns {IExamMatrixResponseDTO} Dữ liệu đã lọc và chuẩn hóa.
   */
  public static toResponse(entity: ExamMatrix): IExamMatrixResponseDTO {
    const props = entity.props;
    return new ExamMatrixResponseDTO({
      id: props.id ?? "",
      name: props.name,
      licenseCategoryId: props.licenseCategoryId,
      totalQuestions: props.totalQuestions,
      passingScore: props.passingScore,
      durationMinutes: props.durationMinutes,
      isDefault: props.isDefault,
      status: props.deletedAt ? 'DELETED' : 'ACTIVE',
      minCriticalQuestions: props.minCriticalQuestions,
      details: props.details.map(d => ({
        chapterId: d.chapterId,
        percentage: d.percentage,
      }))
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang danh sách DTO.
   * @param {ExamMatrix[]} entities - Danh sách thực thể.
   * @returns {IExamMatrixResponseDTO[]} Danh sách DTO.
   */
  public static toResponseList(entities: ExamMatrix[]): IExamMatrixResponseDTO[] {
    return entities.map(entity => this.toResponse(entity));
  }

  /**
   * @description Chuyển đổi sang định dạng Selection (Value/Label) cho Dropdown
   * @param {ExamMatrix} entity 
   * @returns {IExamMatrixSelectionResponseDTO}
   */
  public static toSelectionResponse(entity: ICachedExamMatrix): IExamMatrixSelectionResponseDTO {
    return new ExamMatrixSelectionResponseDTO({
      value: entity.id!,
      label: entity.name,
      orderIndex: 1,

      // Các thuộc tính bổ sung (Extended metadata)
      createdAt: entity.createdAt,
      minCriticalQuestions: entity.minCriticalQuestions,
      licenseCategoryId: entity.licenseCategoryId,
      licenseCategoryName: entity.licenseCategoryName,
      totalQuestions: entity.totalQuestions,
      durationMinutes: entity.durationMinutes,
      passingScore: entity.passingScore,
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang DTO dùng cho Dropdown.
   * @param {ICachedExamMatrix[]} entities - Danh sách các thực thể ExamMatrix Domain.
   * @returns {ExamMatrixSelectionResponseDto[]} Mảng DTO đã sắp xếp theo thời gian.
   */
  public static toSelectionList(entities: ICachedExamMatrix[]): ExamMatrixSelectionResponseDTO[] {
    // Nếu muốn cũ nhất lên đầu, hãy đổi thành a.props.createdAt.getTime() - b.props.createdAt.getTime().
    return [...entities]
      .sort((a, b) => {
        const timeA = a.createdAt?.getTime() || 0;
        const timeB = b.createdAt?.getTime() || 0;
        return timeB - timeA;
      })
      .map((entity) => this.toSelectionResponse(entity));
  }
}