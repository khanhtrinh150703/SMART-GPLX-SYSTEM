import { userAdminApi } from "../api/user-admin.api";
import { StandardResponse } from "@/types/common.type";
import { PaginatedResult } from "@/types/paginaton.type";
import { UserQueryDTO } from "@/types/query-user";
import { UserResponseDTO } from "@/components/features/admin-users/types/user-respone";
import { IUpdateProfileResponse } from "@/types/user.type";
import { AdminUpdatePayload } from "@/components/features/admin-users/schema/user.schema";
import { DeleteResponse } from "@/types/respone/delete.common";

/**
 * userAdminService: Nghiệp vụ quản lý người dùng dành cho Admin.
 * (Business logic for user management - Admin only)
 */
export const userAdminService = {
  /**
   * Lấy danh sách người dùng phân trang.
   * (Get paginated users list)
   */
  getUsers: async (
    params: UserQueryDTO,
  ): Promise<StandardResponse<PaginatedResult<UserResponseDTO>>> => {
    return await userAdminApi.getAll(params);
  },

  /**
   * Admin cập nhật thông tin học viên (JSON Mode).
   * @param userId - ID của học viên cần sửa.
   * @param data - Dữ liệu bao gồm fullName và roles[].
   */
  updateProfileAdmin: async (
    userId: string,
    data: AdminUpdatePayload,
  ): Promise<StandardResponse<IUpdateProfileResponse>> => {
    const response = await userAdminApi.updateUserByAdmin(userId, data);
    return response;
  },

  /**
   * Xóa người dùng (Delete User)
   */
  deleteUser: async (id: string): Promise<StandardResponse<DeleteResponse>> => {
    const respone = await userAdminApi.delete(id);
    return respone;
  },

  /**
   * Khôi phục người dùng (Restore User)
   */
  restoreUser: async (id: string): Promise<StandardResponse<null>> => {
    return await userAdminApi.restore(id);
  },
};
