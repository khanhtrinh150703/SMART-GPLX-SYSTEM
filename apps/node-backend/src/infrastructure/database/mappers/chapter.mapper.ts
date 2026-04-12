import { ChapterResponseDTO } from "@/application/dtos/response/chapter/chapter.dto.respone";
import { Chapter } from "@/domain/entities/chapter/chapter.entity";
import { IChapterRecord } from "@/infrastructure/persistence/chapter.record";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";

/**
 * @description Lớp tiện ích ánh xạ dữ liệu (Data Mapper) cho phân hệ Chương lý thuyết (Chapter).
 * Đóng vai trò trung gian để chuyển đổi dữ liệu giữa các lớp: Persistence, Domain và Application.
 */
export class ChapterMapper {

  /**
   * @description Ánh xạ dữ liệu từ bản ghi cơ sở dữ liệu (Persistence Model) sang thực thể nghiệp vụ (Domain Entity).
   * Đảm bảo tính nhất quán của dữ liệu khi đi từ hạ tầng vào lõi nghiệp vụ.
   * @param {IChapterRecord} raw - Bản ghi thô trích xuất từ cơ sở dữ liệu.
   * @returns {Chapter} Thực thể Domain Chapter.
   */
  public static toDomain(raw: IChapterRecord): Chapter {
    return new Chapter({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      orderIndex: raw.orderIndex,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }

  /**
   * @description Chuyển đổi thực thể nghiệp vụ sang định dạng lưu trữ bền vững (Persistence Model).
   * Chuẩn bị dữ liệu để thực hiện các thao tác Create/Update thông qua Prisma ORM.
   * @param {Chapter} chapter - Thực thể Domain chứa dữ liệu mới nhất.
   * @returns {object} Đối tượng sẵn sàng để lưu trữ vào Database.
   */
  public static toPersistence(chapter: Chapter) {
    return {
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      orderIndex: chapter.orderIndex,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      deletedAt: chapter.deletedAt ?? null,
    };
  }

  /**
   * @description Chuyển đổi thực thể nghiệp vụ sang đối tượng phản hồi (DTO) để gửi về phía Client.
   * @param {Chapter} chapter - Thực thể Domain cần ánh xạ.
   * @returns {ChapterResponseDTO} Đối tượng truyền tải dữ liệu phía Client.
   */
  public static toResponse(chapter: Chapter): ChapterResponseDTO {
    return {
      id: chapter.id as string,
      name: chapter.name,
      description: chapter.description,
      orderIndex: chapter.orderIndex,
      createdAt: chapter.createdAt as Date,
      status: chapter.isDeleted() ? 'deleted' : 'active'
    };
  }

  /**
   * @description Chuyển đổi danh sách thực thể Chương sang danh sách DTO để trả về Client.
   * @param {Chapter[]} chapters - Danh sách thực thể Chương lý thuyết.
   * @returns {ChapterResponseDTO[]}
   */
  public static toResponseList(chapters: Chapter[]): ChapterResponseDTO[] {
    return chapters.map((chapter) => this.toResponse(chapter));
  }

  /**
   * @description Chuyển đổi sang định dạng Selection (Value/Label) cho Dropdown
   * @param {Chapter} entity 
   * @returns {SelectionResponseDto}
   */
  static toSelectionResponse(entity: Chapter): SelectionResponseDto {
    return new SelectionResponseDto({
      value: entity.id!,
      label: entity.name
    });
  }

  static toSelectionList(entities: Chapter[]): SelectionResponseDto[] {
    return entities.map(this.toSelectionResponse);
  }
}