import axiosClient from '@/services/axios-client';
import { ENDPOINTS } from '@/constants/api-endpoints.constant';
import type { StandardResponse } from '@/types/common.type';
import { PaginatedResult } from '@/types/paginaton.type';
import { UserQueryDTO } from '@/types/query-user';
import { UserResponseDTO } from '@/components/features/admin-users/types/user-respone';
import { IUpdateProfileResponse } from '@/types/user.type';
import { AdminUpdatePayload } from '../schema/user.schema';
import { DeleteResponse } from '@/types/respone/delete.common';

/**
 * User Admin API: Quản trị viên quản lý danh sách người dùng.
 * (User Admin API: Administrator manages the user list)
 */
export const userAdminApi = {
  /**
   * Lấy danh sách toàn bộ người dùng (có lọc và phân trang).
   * (Fetch all users list with filters and pagination)
   */
  getAll: async (params: UserQueryDTO): Promise<StandardResponse<PaginatedResult<UserResponseDTO>>> => {
    const response = await axiosClient.get<StandardResponse<PaginatedResult<UserResponseDTO>>>(
      ENDPOINTS.USER.GET_ALL,
      { params }
    );
    return response.data;
  },

  /**
   * Admin cập nhật thông tin cho một người dùng bất kỳ.
   * (Admin updates info for a specific user)
   */
  updateUserByAdmin: async (userId: string, data: AdminUpdatePayload): Promise<StandardResponse<IUpdateProfileResponse>> => {
    const response = await axiosClient.put<StandardResponse<IUpdateProfileResponse>>(
      ENDPOINTS.USER.UPDATE_BY_ADMIN(userId),
      data
    );
    return response.data;
  },

  /**
   * Xóa tài khoản người dùng (Soft delete).
   * (Delete user account)
   */
  delete: async (id: string): Promise<StandardResponse<DeleteResponse>> => {
    const response = await axiosClient.delete<StandardResponse<DeleteResponse>>(
      `${ENDPOINTS.USER.DELETE(id)}`
    );
    return response.data;
  },

  /**
   * Khôi phục tài khoản người dùng đã xóa.
   * (Restore deleted user account)
   */
  restore: async (id: string): Promise<StandardResponse<null>> => {
    const response = await axiosClient.patch<StandardResponse<null>>(
      `${ENDPOINTS.USER.RESTORE(id)}`
    );
    return response.data;
  },
};