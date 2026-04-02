import prisma from "../../../prisma/prisma";

/**
 * @description Cấu trúc dữ liệu Vai trò được lưu trữ trong bộ nhớ đệm.
 */
export interface CachedRoleData {
  /** @property {string} id - UUID của vai trò. */
  id: string;
  /** @property {string} name - Tên định danh (VD: 'ADMIN'). */
  name: string;
  /** @property {string} description - Mô tả chi tiết. */
  description: string;
  /** @property {string[]} permissions - Danh sách tên các quyền hạn được gán (VD: ['user:create']). */
  permissions: string[];
}

/**
 * @description Dịch vụ quản lý bộ nhớ đệm cho Vai trò và Quyền hạn (Role & Permission Cache).
 * Giúp tối ưu hóa tốc độ kiểm tra quyền truy cập bằng cách giảm thiểu truy vấn vào Database.
 */
export class RoleCacheService {
  /** @description Lưu trữ Role theo mã định danh (ID). */
  private static _rolesById = new Map<string, CachedRoleData>();
  
  /** @description Lưu trữ Role theo tên (Name) để truy xuất O(1). */
  private static _rolesByName = new Map<string, CachedRoleData>();

  /**
   * @description Khởi tạo và nạp toàn bộ dữ liệu Vai trò từ Database vào bộ nhớ đệm.
   * Cần được gọi một lần khi ứng dụng khởi động (Bootstrap).
   */
  public static async initialize(): Promise<void> {
    const rolesFromDb = await prisma.role.findMany({
      include: {
        rolePermissions: { 
          include: { permission: true } 
        }
      }
    });

    this._rolesById.clear();
    this._rolesByName.clear();

    rolesFromDb.forEach(role => {
      const cachedRole: CachedRoleData = {
        id: role.id,
        name: role.name,
        description: role.description || "",
        permissions: role.rolePermissions.map(rp => rp.permission.name)
      };

      this._rolesById.set(role.id, cachedRole);
      this._rolesByName.set(role.name, cachedRole);
    });
  }

  /**
   * @description Truy xuất thông tin vai trò từ bộ nhớ đệm thông qua ID.
   * @param {string} id - UUID của vai trò.
   * @returns {CachedRoleData | undefined}
   */
  public static getRole(id: string): CachedRoleData | undefined {
    return this._rolesById.get(id);
  }

  /**
   * @description Truy xuất thông tin vai trò từ bộ nhớ đệm thông qua Tên định danh.
   * @param {string} name - Tên vai trò (VD: 'ADMIN').
   * @returns {CachedRoleData | undefined}
   */
  public static getByName(name: string): CachedRoleData | undefined {
    return this._rolesByName.get(name);
  }

  /**
   * @description Làm mới lại toàn bộ bộ nhớ đệm (thường dùng khi có thay đổi quyền hạn ở trang Admin).
   */
  public static async refresh(): Promise<void> {
    await this.initialize();
  }
}