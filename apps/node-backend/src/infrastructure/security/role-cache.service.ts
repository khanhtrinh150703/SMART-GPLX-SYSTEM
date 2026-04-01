import prisma from "../../../prisma/prisma";

export interface CachedRoleData {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Lưu tên các quyền để check nhanh
}

export class RoleCacheService {
  private static _roles = new Map<string, CachedRoleData>();

  public static async initialize(): Promise<void> {
    const rolesFromDb = await prisma.role.findMany({
      include: {
        rolePermissions: { include: { permission: true } }
      }
    });

    this._roles.clear();
    rolesFromDb.forEach(role => {
      this._roles.set(role.id, {
        id: role.id,
        name: role.name,
        description: role.description || "",
        permissions: role.rolePermissions.map(rp => rp.permission.name)
      });
    });
  }

  public static getRole(id: string): CachedRoleData | undefined {
    return this._roles.get(id);
  }

  public static getByName(name: string): CachedRoleData | undefined {
    // Chuyển Map thành mảng và tìm (vì Map của chúng ta đang index theo ID)
    return Array.from(this._roles.values()).find(r => r.name === name);
  }
}