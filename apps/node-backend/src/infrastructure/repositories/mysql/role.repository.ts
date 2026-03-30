import { IRoleRepository } from "@/domain/interfaces/repositories/i-role.repository";
import { Role } from "@/domain/entities/role/role.entity";
import { RoleMapper, RoleWithPermissionsPayload } from "../../database/mappers/role.mapper";
import _prisma from "../../../../prisma/prisma";

/**
 * @class MySQLRoleRepository
 * @description Triển khai IRoleRepository với Prisma
 */
export class MySQLRoleRepository implements IRoleRepository {
  // Cấu hình include dùng chung để đảm bảo Type Safety thống nhất
  private readonly _includePermissions = {
    rolePermissions: {
      include: {
        permission: true,
      },
    },
  };


  /**
   * @description Tìm Role theo tên
   */
  public async findByName(name: string): Promise<Role | null> {
    const rawRole = await _prisma.role.findUnique({
      where: { name },
      include: this._includePermissions,
    });

    if (!rawRole) return null;

    return RoleMapper.toDomain(rawRole as RoleWithPermissionsPayload);
  }

  /**
   * @description Tìm Role theo ID
   */
  public async findById(id: string): Promise<Role | null> {
    const rawRole = await _prisma.role.findUnique({
      where: { id },
      include: this._includePermissions,
    });

    if (!rawRole) return null;

    return RoleMapper.toDomain(rawRole as RoleWithPermissionsPayload);
  }

  /**
   * @description Lấy toàn bộ Roles trong hệ thống
   */
  public async findAll(): Promise<Role[]> {
    const rawRoles = await _prisma.role.findMany({
      include: this._includePermissions,
    });

    return rawRoles.map((raw) =>
      RoleMapper.toDomain(raw as RoleWithPermissionsPayload)
    );
  }

  /**
   * @description Lưu hoặc cập nhật Role
   */
  public async save(role: Role): Promise<void> {
    const data = RoleMapper.toPersistence(role);

    await _prisma.role.upsert({
      where: { id: role.id },
      update: { name: data.name },
      create: {
        id: data.id,
        name: data.name
      },
    });
  }
}