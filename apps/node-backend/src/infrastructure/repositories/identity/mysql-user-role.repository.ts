import { PrismaClient, Prisma } from '@prisma/client';
import { IUserRoleRepository } from '@/domain/interfaces/repositories/identity/i-user-role.repository';

export class MySQLUserRoleRepository implements IUserRoleRepository {
  private readonly _prisma: PrismaClient;

  constructor({ prisma }: { prisma: PrismaClient }) {
    this._prisma = prisma;
  }

  public async syncUserRoles(
    userId: string, 
    roleIds: string[], 
    tx: Prisma.TransactionClient
  ): Promise<void> {
    // 1. Lấy danh sách role hiện tại (Dùng tx để đảm bảo tính nhất quán trong transaction)
    const currentRecords = await tx.userRole.findMany({
      where: { userId },
      select: { roleId: true }
    });

    const currentRoleIds = currentRecords.map(r => r.roleId);

    // 2. Phân tách logic (Differential Calculation)
    const rolesToRemove = currentRoleIds.filter(id => !roleIds.includes(id));
    const rolesToAdd = roleIds.filter(id => !currentRoleIds.includes(id));

    // 3. Thực thi xóa các liên kết cũ không còn trong danh sách mới
    if (rolesToRemove.length > 0) {
      await tx.userRole.deleteMany({
        where: {
          userId,
          roleId: { in: rolesToRemove }
        }
      });
    }

    // 4. Thực thi thêm các liên kết mới chưa có trong DB
    if (rolesToAdd.length > 0) {
      await tx.userRole.createMany({
        data: rolesToAdd.map(roleId => ({
          userId,
          roleId
        }))
      });
    }
  }
}