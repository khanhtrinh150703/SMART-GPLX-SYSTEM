import { Prisma } from "@prisma/client";

/**
 * @description Định nghĩa cấu trúc dữ liệu User đầy đủ từ Prisma.
 * Bao gồm: User -> UserRole -> Role -> RolePermission -> Permission.
 */
export type UserWithRolesPayload = Prisma.UserGetPayload<{
  include: { userRoles: { select: { roleId: true } } }
}>;