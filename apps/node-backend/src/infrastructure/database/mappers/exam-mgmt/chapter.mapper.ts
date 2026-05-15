import {
  ChapterResponseDTO,
  IChapterResponseDTO,
} from "@/application/dtos/response/chapter/chapter.respone.dto";
import { Chapter } from "@/domain/entities/chapter/chapter.entity";
import { IChapterProps } from "@/domain/entities/chapter/chapter.props";
import { IChapterRecord } from "@/infrastructure/persistence/exam-mgmt/chapter.record";
import { ICachedChapter } from "@/shared/master-data";
import {
  ISelectionResponseDTO,
  SelectionResponseDTO,
} from "@/application/dtos/response/shared/selection.response.dto";
import { Prisma } from "@prisma/client";

/**
 * @description Lớp tiện ích ánh xạ dữ liệu (Data Mapper) cho phân hệ Chương lý thuyết (Chapter).
 * Đóng vai trò trung gian để chuyển đổi dữ liệu giữa các lớp: Persistence, Domain và Application.
 */
export class ChapterMapper {
  /**
   * @description Ánh xạ dữ liệu từ bản ghi cơ sở dữ liệu (Persistence Model) sang thực thể nghiệp vụ (Domain Entity).
   * @param {IChapterRecord} raw - Bản ghi thô trích xuất từ cơ sở dữ liệu.
   * @returns {Chapter} Thực thể Domain Chapter.
   */
  public static toDomain(raw: IChapterRecord): Chapter {
    // 1. Thiết lập Blueprint (Props) cho Chapter
    const props: IChapterProps = {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      orderIndex: raw.orderIndex,
      code: raw.code,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? undefined, // Dùng Nullish Coalescing cho "chỉnh chu"
    };

    // 2. Reconstitute - Hồi sinh Entity từ dữ liệu quá khứ
    return Chapter.reconstitute(props);
  }

  /**
   * @description Ánh xạ sang cấu trúc Prisma dành cho hành động CREATE (Tạo mới).
   * Dùng khi lần đầu lưu Chapter vào Database.
   */
  public static toCreatePersistence(
    chapter: Chapter,
  ): Prisma.ChapterCreateInput {
    return {
      id: chapter.id, // ID được tạo từ tầng Domain (UUID)
      name: chapter.name,
      description: chapter.description,
      orderIndex: chapter.orderIndex,
      code: chapter.code,
      createdAt: chapter.createdAt || new Date(),
      updatedAt: chapter.updatedAt || new Date(),
      deletedAt: chapter.deletedAt ?? null,
    };
  }

  /**
   * @description Ánh xạ sang cấu trúc Prisma dành cho hành động UPDATE (Cập nhật).
   * Tuyệt đối không bao gồm 'id' và 'createdAt' để bảo vệ dữ liệu.
   */
  public static toUpdatePersistence(
    chapter: Chapter,
  ): Prisma.ChapterUpdateInput {
    return {
      name: chapter.name,
      description: chapter.description,
      orderIndex: chapter.orderIndex,
      code: chapter.code,
      updatedAt: new Date(),
      deletedAt: chapter.deletedAt ?? null,
    };
  }

  /**
   * @description Chuyển đổi thực thể nghiệp vụ sang đối tượng phản hồi (DTO) để gửi về phía Client.
   * @param {Chapter} chapter - Thực thể Domain cần ánh xạ.
   * @returns {IChapterResponseDTO} Đối tượng truyền tải dữ liệu phía Client.
   */
  public static toResponse(chapter: Chapter): IChapterResponseDTO {
    return new ChapterResponseDTO({
      id: chapter.id as string,
      name: chapter.name,
      description: chapter.description,
      code: chapter.code,
      orderIndex: chapter.orderIndex,
      createdAt: chapter.createdAt as Date,
      status: chapter.isDeleted() ? "deleted" : "active",
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể Chương sang danh sách DTO để trả về Client.
   * @param {Chapter[]} chapters - Danh sách thực thể Chương lý thuyết.
   * @returns {IChapterResponseDTO[]}
   */
  public static toResponseList(chapters: Chapter[]): IChapterResponseDTO[] {
    return chapters.map((chapter) => this.toResponse(chapter));
  }

  /**
   * @description Chuyển đổi sang định dạng Selection (Value/Label) cho Dropdown
   * @param {ICachedChapter} entity
   * @returns {SelectionResponseDto}
   */
  public static toSelectionResponse(
    entity: ICachedChapter,
  ): ISelectionResponseDTO {
    return new SelectionResponseDTO({
      value: entity.id!,
      label: entity.name,
      orderIndex: entity.orderIndex,
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang DTO dùng cho Dropdown.
   * Dữ liệu được sắp xếp theo chỉ số thứ tự (orderIndex) tăng dần.
   * @param {ICachedChapter[]} entities - Danh sách các thực thể Chapter Domain.
   * @returns {ISelectionResponseDTO[]} Mảng DTO đã sắp xếp theo thứ tự (1 -> N).
   */
  public static toSelectionList(
    entities: ICachedChapter[],
  ): ISelectionResponseDTO[] {
    // 1. Sử dụng Spread Operator để tạo bản sao, tránh "Mutate" mảng gốc
    // 2. Sắp xếp theo orderIndex. Nếu orderIndex undefined, mặc định về 0.
    return [...entities]
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map((entity) => this.toSelectionResponse(entity));
  }
}
