import { Role } from "@/domain/entities/role/role.entity";
import { Permission } from "@/domain/entities/permission/permission.entity";
import { IRoleRecord } from "@/infrastructure/persistence/identity/roles.record";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";
import { IRoleProps } from "@/domain/entities/role/role.props";
import { IPermissionProps } from "@/domain/entities/permission/permission.props";

/**
 * @class RoleMapper
 * @description Chuyển đổi dữ liệu qua lại giữa Domain Role và Persistence Role (Record).
 */
export class RoleMapper {

  /**
   * @description Chuyển từ bản ghi Database (Record) sang Domain Entity.
   * @param raw Dữ liệu thô từ Database được ép kiểu qua IRoleRecord.
   * @returns Thực thể Role
   */
  public static toDomain(raw: IRoleRecord): Role {
    // 1. Blueprint cho các Permission liên quan
    const permissionEntities = (raw.role_permissions || []).map((rp) => {
      const pProps: IPermissionProps = {
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description,
      };
      return Permission.reconstitute(pProps);
    });

    // 2. Blueprint (Props) chính cho Role
    const roleProps: IRoleProps = {
      id: raw.id,
      name: raw.name,
      description: raw.description ?? "",
      permissions: permissionEntities,
    };

    // 3. Hồi sinh Role Entity
    return Role.reconstitute(roleProps);
  }

  /**
   * @description Chuyển từ Domain Entity sang dữ liệu thuần để lưu vào DB.
   * @param role Thực thể Role
   * @returns Object dữ liệu cho Prisma
   */
  public static toPersistence(role: Role) {
    return {
      id: role.id,
      name: role.name,
      // Cậu có thể thêm description vào đây nếu Prisma Schema yêu cầu
      description: role.description,
    };
  }

  /**
   * @description Chuyển đổi sang định dạng Selection dùng License Code làm Label (A1, B2...)
   * @param {Role} entity 
   * @returns {SelectionResponseDto}
   */
  public static toSelectionResponse(entity: Role): SelectionResponseDto {
    return new SelectionResponseDto({
      value: entity.id!,
      label: entity.name
    });
  }

  /**
   * @description Chuyển đổi danh sách vai trò sang định dạng DTO cho các thành phần lựa chọn.
   * @param {Role[]} entities - Mảng các thực thể vai trò (Role Entities).
   * @returns {SelectionResponseDto[]} Danh sách DTO dùng cho hiển thị/lựa chọn (Selection List).
   */
  public static toSelectionList(entities: Role[]): SelectionResponseDto[] {
    return entities.map(this.toSelectionResponse);
  }
}


