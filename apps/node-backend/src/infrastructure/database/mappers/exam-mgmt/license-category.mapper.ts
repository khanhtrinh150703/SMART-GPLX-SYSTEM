import { LicenseCategoryResponse } from "@/application/dtos/response/license-category/license-category.respone.dto";
import { LicenseCategory } from "@/domain/entities/license-category/license-category.entity";
import { ILicenseCategoryProps } from "@/domain/entities/license-category/license-category.props";
import { ILicenseCategoryRecord } from "@/infrastructure/persistence/exam-mgmt/license-category.record";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";

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
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt || undefined,
    };
    return LicenseCategory.reconstitute(props)
  }

  /**
   * @description Chuyển từ Domain Entity sang định dạng lưu trữ Database.
   * @param {LicenseCategory} domain - Entity.
   * @returns {Partial<ILicenseCategoryRecord>}
   */
  public static toPersistence(domain: LicenseCategory): Partial<ILicenseCategoryRecord> {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      minAge: domain.minAge,
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
   * @param {LicenseCategory} entity 
   * @returns {SelectionResponseDto}
   */
  public static toSelectionResponse(entity: LicenseCategory): SelectionResponseDto {
    return new SelectionResponseDto({
      value: entity.id!,
      label: entity.name
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể hạng bằng lái sang DTO dùng cho lựa chọn.
   * @param {LicenseCategory[]} entities - Mảng các thực thể LicenseCategory.
   * @returns {SelectionResponseDto[]} Danh sách DTO hiển thị trong Dropdown/Selection.
   */
  public static toSelectionList(entities: LicenseCategory[]): SelectionResponseDto[] {
    return entities.map(this.toSelectionResponse);
  }
}