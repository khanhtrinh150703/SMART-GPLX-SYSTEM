import { LicenseCategoryResponse } from "@/application/dtos/response/license-category/license-category.respone.dto";
import { LicenseCategory } from "@/domain/entities/license-category/license-category.entity";
import { ILicenseCategoryRecord } from "@/infrastructure/persistence/license-category.record";

/**
 * Chuyển đổi dữ liệu giữa Database Record và Domain Entity.
 */
export class LicenseCategoryMapper {
  /**
   * Chuyển từ DB Record sang Domain Entity.
   * @param {ILicenseCategoryRecord} raw - Dữ liệu từ Database.
   * @returns {LicenseCategory}
   */
  public static toDomain(raw: ILicenseCategoryRecord): LicenseCategory {
    return new LicenseCategory({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      deletedAt: raw.deleted_at ?? null,
    });
  }

  /**
   * Chuyển từ Domain Entity sang định dạng lưu trữ Database.
   * @param {LicenseCategory} domain - Entity.
   * @returns {Partial<ILicenseCategoryRecord>}
   */
  public static toPersistence(domain: LicenseCategory): Partial<ILicenseCategoryRecord> {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
    };
  }

  /**
   * Chuyển đổi từ Domain Entity sang Response DTO cho Client.
   * @param {LicenseCategory} entity - Thực thể hạng bằng lái.
   * @returns {LicenseCategoryResponse}
   */
  public static toResponse(entity: LicenseCategory): LicenseCategoryResponse {
    return {
      id: entity.id || '',
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt ? entity.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  /**
   * Chuyển đổi danh sách thực thể sang danh sách DTO.
   * @param {LicenseCategory[]} entities - Danh sách thực thể.
   * @returns {LicenseCategoryResponse[]}
   */
  public static toResponseList(entities: LicenseCategory[]): LicenseCategoryResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}