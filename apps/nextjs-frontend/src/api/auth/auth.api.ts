// src/api/auth/auth.api.ts
import axiosClient from '../axios-client';
import { ENDPOINTS } from '@/src/constants/api-endpoints';
import type { StandardResponse } from '@/src/types/common.type';
import type { 
  RegisterPayload, 
  VerifyOtpPayload, 
  LoginPayload,
  RegisterResponse 
} from '@/src/types/auth.type';

export const authApi = {
  // Bọc RegisterResponse bên trong StandardResponse
  register: async (data: RegisterPayload): Promise<StandardResponse<RegisterResponse>> => {
    const response = await axiosClient.post<StandardResponse<RegisterResponse>>(
      ENDPOINTS.AUTH.REGISTER, 
      data
    );
    return response.data; // Đây chính là toàn bộ cục StandardResponse
  },

  // Giả sử API này BE không trả về data lõi, chỉ trả về message thành công
  verifyOtp: async (data: VerifyOtpPayload): Promise<StandardResponse<null>> => {
    const response = await axiosClient.post<StandardResponse<null>>(
      ENDPOINTS.AUTH.VERIFY_OTP, 
      data
    );
    return response.data;
  },

  // Bọc dữ liệu Login (chứa Token)
  login: async (data: LoginPayload): Promise<StandardResponse<{ token: string }>> => {
    const response = await axiosClient.post<StandardResponse<{ token: string }>>(
      ENDPOINTS.AUTH.LOGIN, 
      data
    );
    return response.data;
  }
};