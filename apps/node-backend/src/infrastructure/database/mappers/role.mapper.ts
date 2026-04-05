import { Role } from "@/domain/entities/role/role.entity";
import { Permission } from "@/domain/entities/permission/permission.entity";
import { IRoleRecord } from "@/infrastructure/persistence/roles.record";

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
    // 1. Ánh xạ danh sách Permission từ cấu trúc bảng trung gian
    const permissions = (raw.role_permissions || []).map((rp) =>
      Permission.reconstitute({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description,
      })
    );

    // 2. Tái tạo Role Entity bằng phương thức reconstitute với Props
    return Role.reconstitute({
      id: raw.id,
      name: raw.name,
      description: raw.description ?? "",
      permissions: permissions,
    });
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
}