import axiosClient from '@/services/axios-client';
import { ENDPOINTS } from '@/constants/api-endpoints.constant';
import type { StandardResponse } from '@/types/common.type';
import { IUpdateProfileResponse, UserChangePassword } from '@/types/user.type';

/**
 * Profile API: Các tác vụ tự quản lý của người dùng.
 */
export const profileApi = {
  /**
   * Cập nhật thông tin cá nhân (bao gồm cả ảnh đại diện).
   * (Update personal profile including avatar)
   */
  update: async (formData: FormData): Promise<StandardResponse<IUpdateProfileResponse>> => {
    const response = await axiosClient.patch<StandardResponse<IUpdateProfileResponse>>(
      ENDPOINTS.USER.UPDATE_PROFILE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data, 
      }
    );
    return response.data;
  },

  /**
   * Đổi mật khẩu cá nhân.
   */
  changePassword: async (data: UserChangePassword): Promise<StandardResponse<null>> => {
    const response = await axiosClient.patch<StandardResponse<null>>(
      ENDPOINTS.USER.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },
};