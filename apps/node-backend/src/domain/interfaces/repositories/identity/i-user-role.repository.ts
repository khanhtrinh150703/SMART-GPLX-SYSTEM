export interface IUserRoleRepository {
  /**
   * @description Đồng bộ hóa danh sách Role của User (Differential Sync).
   * @param userId - ID người dùng.
   * @param roleIds - Danh sách ID roles mới.
   * @param tx - Transaction client của Prisma.
   */
  syncUserRoles(
    userId: string, 
    roleIds: string[], 
  ): Promise<void>;
}