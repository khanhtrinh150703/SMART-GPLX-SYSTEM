import { LicenseCategoryResponse } from "@/application/dtos/response/license-category/license-category.respone.dto";
import { LicenseCategory } from "@/domain/entities/license-category/license-category.entity";
import { ILicenseCategoryProps } from "@/domain/entities/license-category/license-category.props";
import { ILicenseCategoryRecord } from "@/infrastructure/persistence/exam-mgmt/license-category.record";
import { ICachedCategory } from "@/shared/master-data";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";
import { Prisma } from "@prisma/client";

/**
 * @description Chuyển đổi dữ liệu giữa Database Record và Domain Entity.
 */
export class LicenseCategoryMapper {
  /**
   * @description Chuyển từ DB Record sang Domain Entity.
   * @param {ILicenseCategoryRecord} raw - Dữ liệu từ Database.
   * @returns {LicenseCategory}
   */
  public static toDomain(raw: ILicenseCategoryRecord): LicenseCategory {
    const props: ILicenseCategoryProps = {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      minAge: raw.minAge,
      orderIndex: raw.orderIndex,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt || undefined,
    };
    return LicenseCategory.reconstitute(props)
  }

  /**
   * @description Ánh xạ sang cấu trúc Prisma cho hành động CREATE (Tạo mới).
   * Bao gồm cả ID vì ID thường được tạo từ tầng Domain.
   */
  public static toCreatePersistence(domain: LicenseCategory): Prisma.LicenseCategoryCreateInput {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      minAge: domain.minAge,
      orderIndex: domain.orderIndex,
      // Thêm các trường audit nếu cần
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * @description Ánh xạ sang cấu trúc Prisma cho hành động UPDATE (Cập nhật).
   * Loại bỏ ID để tránh lỗi P2002 (Primary Key conflict).
   */
  public static toUpdatePersistence(domain: LicenseCategory): Prisma.LicenseCategoryUpdateInput {
    return {
      name: domain.name,
      description: domain.description,
      minAge: domain.minAge,
      orderIndex: domain.orderIndex,
      updatedAt: new Date(), // Tự động cập nhật dấu thời gian
    };
  }

  /**
   * @description Chuyển đổi từ Domain Entity sang Response DTO cho Client.
   * @param {LicenseCategory} entity - Thực thể hạng bằng lái.
   * @returns {LicenseCategoryResponse}
   */
  public static toResponse(entity: LicenseCategory): LicenseCategoryResponse {
    return {
      id: entity.id || '',
      name: entity.name,
      minAge: entity.minAge,
      description: entity.description,
      createdAt: entity.createdAt ? entity.createdAt.toISOString() : new Date().toISOString(),
      status: entity.isDeleted() ? 'deleted' : 'active'
    };
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang danh sách DTO.
   * @param {LicenseCategory[]} entities - Danh sách thực thể.
   * @returns {LicenseCategoryResponse[]}
   */
  public static toResponseList(entities: LicenseCategory[]): LicenseCategoryResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  /**
   * @description Chuyển đổi sang định dạng Selection dùng License Code làm Label (A1, B2...)
   * @param {ICachedCategory} entity 
   * @returns {SelectionResponseDto}
   */
  public static toSelectionResponse(entity: ICachedCategory): SelectionResponseDto {
    return new SelectionResponseDto({
      value: entity.id!,
      label: entity.name,
      orderIndex: entity.orderIndex,
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể hạng bằng lái sang DTO dùng cho lựa chọn.
   * Dữ liệu được sắp xếp theo chỉ số thứ tự (orderIndex) để đảm bảo trình tự A1 -> A -> B1...
   * @param {LicenseCategory[]} entities - Mảng các thực thể LicenseCategory Domain.
   * @returns {SelectionResponseDto[]} Danh sách DTO đã sắp xếp để hiển thị trong Dropdown.
   */
  public static toSelectionList(entities: ICachedCategory[]): SelectionResponseDto[] {
    // 1. Sử dụng Spread Operator để tạo bản sao, tránh gây ra Side Effect cho mảng gốc
    // 2. Sắp xếp tăng dần theo orderIndex (ưu tiên thứ tự nghiệp vụ)
    return [...entities]
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map((entity) => this.toSelectionResponse(entity));
  }
}