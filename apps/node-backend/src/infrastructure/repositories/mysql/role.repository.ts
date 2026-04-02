import { IRoleRepository } from "@/domain/interfaces/repositories/i-role.repository";
import { Role } from "@/domain/entities/role/role.entity";
import _prisma from "../../../../prisma/prisma";
import { IRoleRecord, PrismaRoleWithPermissions } from "@/infrastructure/persistence/roles.record";
import { RoleMapper } from "@/infrastructure/database/mappers/role.mapper";

/**
 * @description Triển khai Repository quản lý Vai trò (Role) sử dụng MySQL và Prisma ORM.
 */
export class MySQLRoleRepository implements IRoleRepository {
  /** * Cấu hình Eager Loading. 
   * Lưu ý: Tên 'rolePermissions' phải khớp với tên relation trong schema.prisma.
   */
  private readonly _includePermissions = {
    rolePermissions: {
      include: {
        permission: true,
      },
    },
  };

  /**
   * Helper "Thông dịch viên": Chuyển đổi dữ liệu từ Prisma (CamelCase/ORM-specific) 
   * sang IRoleRecord (SnakeCase/Database-contract) trước khi đưa vào Domain.
   */
  private _toDomain(raw: PrismaRoleWithPermissions | null): Role | null {
    if (!raw) return null;

    // Ép kiểu sang IRoleRecord một cách an toàn
    const record: IRoleRecord = {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      // Map từ camelCase của Prisma sang snake_case của IRoleRecord
      role_permissions: raw.rolePermissions.map((rp) => ({
        permission: {
          id: rp.permission.id,
          name: rp.permission.name,
          description: rp.permission.description,
        },
      })),
    };

    return RoleMapper.toDomain(record);
  }

  public async findByName(name: string): Promise<Role | null> {
    const rawRole = await _prisma.role.findUnique({
      where: { name },
      include: this._includePermissions,
    });

    return this._toDomain(rawRole as PrismaRoleWithPermissions);
  }

  public async findById(id: string): Promise<Role | null> {
    const rawRole = await _prisma.role.findUnique({
      where: { id },
      include: this._includePermissions,
    });

    return this._toDomain(rawRole as PrismaRoleWithPermissions);
  }

  public async findAll(): Promise<Role[]> {
    const rawRoles = await _prisma.role.findMany({
      include: this._includePermissions,
    });

    // Lọc bỏ null để đảm bảo trả về mảng Role chuẩn
    return rawRoles
      .map((raw) => this._toDomain(raw as PrismaRoleWithPermissions))
      .filter((role): role is Role => role !== null);
  }

  /**
   * Đồng bộ hóa Domain Entity xuống Database.
   */
  public async save(role: Role): Promise<void> {
    const data = RoleMapper.toPersistence(role);

    await _prisma.role.upsert({
      where: { id: role.id },
      update: { 
        name: data.name,
        description: data.description 
      },
      create: {
        id: data.id,
        name: data.name,
        description: data.description
      },
    });
  }
}