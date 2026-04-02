import { IRoleRepository } from "@/domain/interfaces/repositories/i-role.repository";
import { Role } from "@/domain/entities/role/role.entity";
import { RoleMapper, RoleWithPermissionsPayload } from "../../database/mappers/role.mapper";
import _prisma from "../../../../prisma/prisma";

/**
 * @description Triển khai Repository quản lý Vai trò (Role) sử dụng MySQL và Prisma ORM.
 * Thực hiện các thao tác truy vấn và lưu trữ dữ liệu vai trò kèm danh sách quyền (Permissions) liên quan.
 */
export class MySQLRoleRepository implements IRoleRepository {
  /** @description Cấu hình truy vấn lồng (Eager Loading) để lấy đầy đủ thông tin quyền của Vai trò. */
  private readonly _includePermissions = {
    rolePermissions: {
      include: {
        permission: true,
      },
    },
  };

  /**
   * @description Tìm kiếm vai trò theo tên định danh duy nhất (VD: 'ADMIN', 'STUDENT').
   * @param {string} name - Tên vai trò cần tìm kiếm.
   * @returns {Promise<Role | null>} Thực thể Domain Role kèm quyền, hoặc null nếu không tồn tại.
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
   * @description Tìm kiếm vai trò dựa trên mã định danh (ID).
   * @param {string} id - UUID của vai trò cần tìm.
   * @returns {Promise<Role | null>} Thực thể Domain Role kèm quyền, hoặc null nếu không tồn tại.
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
   * @description Truy vấn danh sách toàn bộ vai trò hiện có trong hệ thống.
   * @returns {Promise<Role[]>} Danh sách thực thể Domain Role đã được ánh xạ.
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
   * @description Lưu mới hoặc cập nhật thông tin vai trò (Cơ chế Upsert).
   * @param {Role} role - Thực thể Domain Role cần đồng bộ vào cơ sở dữ liệu.
   * @returns {Promise<void>}
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