import axiosClient from "@/services/axios-client";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import type { StandardResponse } from "@/types/common.type";
import { PaginatedResult } from "@/types/paginaton.type";
import { UserQueryDTO } from "@/types/query-user";
import { UserResponseDTO } from "@/components/features/admin-users/types/user-respone";
import { IUpdateProfileResponse, User } from "@/types/user.type";
import { AdminUpdatePayload, CreateUserPayload } from "../schema/user.schema";
import { DeleteResponse } from "@/types/respone/delete.common";

/**
 * User Admin API: Quản trị viên quản lý danh sách người dùng.
 */
export const userAdminApi = {
  /**
   * Lấy danh sách toàn bộ người dùng (có lọc và phân trang).
   */
  getAll: async (
    params: UserQueryDTO,
  ): Promise<StandardResponse<PaginatedResult<UserResponseDTO>>> => {
    const response = await axiosClient.get<
      StandardResponse<PaginatedResult<UserResponseDTO>>
    >(ENDPOINTS.USER.GET_ALL, { params });
    return response.data;
  },

  /**
   * Admin cập nhật thông tin cho một người dùng bất kỳ.
   */
  updateUserByAdmin: async (
    userId: string,
    data: AdminUpdatePayload,
  ): Promise<StandardResponse<IUpdateProfileResponse>> => {
    const response = await axiosClient.put<
      StandardResponse<IUpdateProfileResponse>
    >(ENDPOINTS.USER.UPDATE_BY_ADMIN(userId), data);
    return response.data;
  },

  /**
   * @description Quản trị viên khởi tạo một tài khoản người dùng mới (Học viên, Giáo viên, Điều phối viên).
   * @route POST /api/v1/users/admin
   */
  adminCreateUser: async (
    dto: CreateUserPayload,
  ): Promise<StandardResponse<User>> => {
    // Đối với POST, đường dẫn URL giữ sạch, toàn bộ dữ liệu dto nằm gọn gàng trong Request Body
    const response = await axiosClient.post<
      StandardResponse<User>
    >(ENDPOINTS.USER.CREATE_USER_BY_ADMIN, dto);
    return response.data;
  },
  
  /**
   * Xóa tài khoản người dùng (Soft delete).
   */
  delete: async (id: string): Promise<StandardResponse<DeleteResponse>> => {
    const response = await axiosClient.delete<StandardResponse<DeleteResponse>>(
      `${ENDPOINTS.USER.DELETE(id)}`,
    );
    return response.data;
  },

  /**
   * Khôi phục tài khoản người dùng đã xóa.
   */
  restore: async (id: string): Promise<StandardResponse<null>> => {
    const response = await axiosClient.patch<StandardResponse<null>>(
      `${ENDPOINTS.USER.RESTORE(id)}`,
    );
    return response.data;
  },
};
