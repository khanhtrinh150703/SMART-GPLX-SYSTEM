import axiosClient from '../../services/axios-client';
import { ENDPOINTS } from '@/constants/api-endpoints.constant';
import type { StandardResponse } from '@/types/common.type';
import { PaginatedResult } from '@/types/paginaton.type';
import { UserQueryDTO } from '@/types/query-user';
import { UserResponseDTO } from '@/types/user-respone';
import { IUpdateProfileResponse, UserChangePassword } from '@/types/user.type';


export const userApi = {
  // 🚀 Đổi từ StandardResponse<User> sang StandardResponse<IUpdateProfileResponse>
  updateProfile: async (formData: FormData): Promise<StandardResponse<IUpdateProfileResponse>> => {
    const response = await axiosClient.patch<StandardResponse<IUpdateProfileResponse>>(
      ENDPOINTS.USER.UPDATE_PROFILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => data,
      }
    );
    return response.data;
  },

  updateProfileAdmin: async (formData: FormData, userId: string): Promise<StandardResponse<IUpdateProfileResponse>> => {
    const response = await axiosClient.patch<StandardResponse<IUpdateProfileResponse>>(
      `${ENDPOINTS.USER.UPDATE_PROFILE_ADMIN}/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => data,
      }
    );
    return response.data;
  },

  changePassword: async (data: UserChangePassword): Promise<StandardResponse<null>> => {
    const response = await axiosClient.patch<StandardResponse<null>>(
      ENDPOINTS.USER.CHANGEPASSWORD,
      data
    );
    return response.data;
  },

  /**
   * Mục đích (Purpose): Lấy danh sách toàn bộ người dùng có phân trang và lọc.
   * Tham số (Parameters):
   * @param data (UserQueryDTO): Các tham số truy vấn như trang, giới hạn, tìm kiếm.
   * Trả về (Returns): 
   * @returns {Promise<StandardResponse<PaginatedResult<UserResponseDTO>>>}: Dữ liệu chuẩn từ Server.
   */
  /**
   * Lấy danh sách người dùng đầy đủ.
   * Trả về (Returns): Một Promise chứa phản hồi chuẩn với dữ liệu phân trang.
   */
  getAllUsers: async (params: UserQueryDTO): Promise<StandardResponse<PaginatedResult<UserResponseDTO>>> => {
    const response = await axiosClient.get<StandardResponse<PaginatedResult<UserResponseDTO>>>(
      ENDPOINTS.USER.GET_ALL,
      { params }
    );
    return response.data;
  },

  /**
   * Mục đích (Purpose): Xóa tài khoản người dùng khỏi hệ thống.
   * @param id (string): ID duy nhất của người dùng cần xóa.
   * @returns {Promise<StandardResponse<null>>}: Phản hồi xác nhận xóa thành công.
   */
  delete: async (id: string): Promise<StandardResponse<null>> => {
    const response = await axiosClient.delete<StandardResponse<null>>(
      `${ENDPOINTS.USER.DELETE}/${id}`,
    );
    return response.data;
  },

  restore: async (id: string): Promise<StandardResponse<null>> => {
    const response = await axiosClient.patch<StandardResponse<null>>(
      `${ENDPOINTS.USER.RESTORE}/${id}/restore`,
    );
    return response.data;
  },
};