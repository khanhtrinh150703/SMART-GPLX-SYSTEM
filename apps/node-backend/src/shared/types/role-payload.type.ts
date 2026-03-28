import { Role } from "@/domain/entities/role/role.entity";
import { Permission } from "@/domain/entities/permission/permission.entity";
import { RoleWithPermissionsPayload } from "@/infrastructure/database/mappers/role.mapper";

/**
 * @class RoleMapper
 * @description Chuyển đổi dữ liệu giữa Prisma Payload và Domain Entity.
 */
export class RoleMapper {
  /**
   * @description Chuyển từ dữ liệu thô (Prisma) sang thực thể Role (Domain).
   * @param {RoleWithPermissionsPayload} raw - Dữ liệu thô từ Prisma.
   */
  public static toDomain(raw: RoleWithPermissionsPayload): Role {
    const permissions = raw.rolePermissions.map((rp) =>
      Permission.reconstitute({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description,
      })
    );

    return Role.reconstitute({
      id: raw.id,
      name: raw.name,
      description: raw.description ?? "",
      permissions: permissions,
    });
  }
}