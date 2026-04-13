// src/api/auth/auth.api.ts
import axiosClient from '../../services/axios-client';
import { ENDPOINTS } from '@/constants/api-endpoints.constant';
import type { StandardResponse } from '@/types/common.type';

// Import (Nhập) thêm các Payload (Dữ liệu gửi lên) mới
import type {
  RegisterPayload,
  VerifyOtpPayload,
  LoginPayload,
  RegisterResponse,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  LoginResponseData,
  // ForgotPasswordPayload,  // Dữ liệu gửi lên khi yêu cầu quên mật khẩu
  // ResetPasswordPayload    // Dữ liệu gửi lên khi đặt lại mật khẩu mới
} from '@/types/auth.type';

export const authApi = {
  // Bọc RegisterResponse bên trong StandardResponse (Phản hồi tiêu chuẩn)
  register: async (data: RegisterPayload): Promise<StandardResponse<RegisterResponse>> => {
    const response = await axiosClient.post<StandardResponse<RegisterResponse>>(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data; // Trả về toàn bộ khối StandardResponse
  },

  // Xác thực OTP (Giả sử Backend không trả về data lõi, chỉ trả về message/thông báo thành công)
  verifyOtp: async (data: VerifyOtpPayload): Promise<StandardResponse<null>> => {
    const response = await axiosClient.post<StandardResponse<null>>(
      ENDPOINTS.AUTH.VERIFY_OTP,
      data
    );
    return response.data;
  },

  // Gửi yêu cầu Đăng nhập (Login Request)
  // Trả về: Promise<StandardResponse<LoginResponseData>>
  login: async (data: LoginPayload): Promise<StandardResponse<LoginResponseData>> => {
    const response = await axiosClient.post<StandardResponse<LoginResponseData>>(
      ENDPOINTS.AUTH.LOGIN,
      data
    );
    // Trả về toàn bộ response.data theo chuẩn StandardResponse
    return response.data;
  },

  // --- CÁC HÀM BỔ SUNG (ADDITIONAL FUNCTIONS) ---

  // Yêu cầu gửi lại mã OTP (Resend OTP)
  resendOtp: async (data: ResendOtpPayload): Promise<StandardResponse<null>> => {
    const response = await axiosClient.post<StandardResponse<null>>(
      ENDPOINTS.AUTH.RESEND_OTP,
      data
    );
    return response.data;
  },

  // Gửi yêu cầu quên mật khẩu (Forgot Password Request)
  // Thường gửi email lên để nhận link hoặc mã xác nhận
  forgotPassword: async (data: ForgotPasswordPayload): Promise<StandardResponse<null>> => {
    const response = await axiosClient.post<StandardResponse<null>>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data;
  },

  // Đặt lại mật khẩu mới (Reset Password)
  // Thường gửi kèm mật khẩu mới và token/mã xác nhận lấy từ URL hoặc email
  resetPassword: async (data: ResetPasswordPayload): Promise<StandardResponse<null>> => {
    const response = await axiosClient.post<StandardResponse<null>>(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },
};