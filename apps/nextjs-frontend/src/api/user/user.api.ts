import axiosClient from '../../services/axios-client';
import { ENDPOINTS } from '@/constants/api-endpoints.constant';
import type { StandardResponse } from '@/types/common.type';
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

   changePassword: async (data: UserChangePassword): Promise<StandardResponse<null>> => {
    const response = await axiosClient.patch<StandardResponse<null>>(
      ENDPOINTS.USER.CHANGEPASSWORD,
      data
    );
    return response.data;
  },
};