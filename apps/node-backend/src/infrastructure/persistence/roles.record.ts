
import { Prisma } from "@prisma/client";

/**
 * @description Định nghĩa Payload chuẩn từ Prisma để map dữ liệu.
 * Giữ nguyên cấu trúc lồng nhau: rolePermissions -> permission.
 */
export type PrismaRoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    rolePermissions: {
      include: {
        permission: true;
      };
    };
  };
}>;

/**
 * Interface đại diện cho bản ghi Role kèm theo Permissions trong Database.
 */
export interface IRoleRecord {
  id: string;
  name: string;
  description: string | null;
  // Bảng trung gian RolePermission kết nối sang Permission
  role_permissions: {
    permission: {
      id: string;
      name: string;
      description: string | null;
    };
  }[];
}