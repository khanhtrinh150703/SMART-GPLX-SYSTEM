import { Prisma } from "@prisma/client";
import { Role } from "@/domain/entities/role/role.entity";
import { Permission } from "@/domain/entities/permission/permission.entity";

/**
 * @description Định nghĩa Payload chuẩn từ Prisma để map dữ liệu
 */
export type RoleWithPermissionsPayload = Prisma.RoleGetPayload<{
  include: {
    rolePermissions: {
      include: {
        permission: true;
      };
    };
  };
}>;

/**
 * @class RoleMapper
 * @description Chuyển đổi dữ liệu qua lại giữa Domain Role và Prisma Role
 */
export class RoleMapper {
  /**
   * @description Chuyển từ Prisma Data sang Domain Entity
   * @param raw Dữ liệu thô từ Prisma
   * @returns Thực thể Role
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

  /**
   * @description Chuyển từ Domain Entity sang dữ liệu thô để lưu vào DB
   * @param role Thực thể Role
   * @returns Object chứa dữ liệu thuần cho Prisma
   */
  public static toPersistence(role: Role) {
    return {
      id: role.id,
      name: role.name,
    };
  }
}