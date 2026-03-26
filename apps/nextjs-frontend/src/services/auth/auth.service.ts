// src/services/auth.service.ts
import { authApi } from '@/src/api/auth/auth.api';
import type { 
  LoginPayload, 
  RegisterPayload, 
  VerifyOtpPayload 
} from '@/src/types/auth.type';

/**
 * Lớp Dịch vụ Xác thực (Auth Service):
 * Chứa các Logic nghiệp vụ (Business Logic) độc lập với giao diện.
 */
export const authService = {
  
  // Xử lý luồng Đăng nhập
  login: async (data: LoginPayload) => {
    // 1. Gọi xuống tầng API (Data Access Layer) để lấy dữ liệu
    const response = await authApi.login(data);

    // 2. Xử lý logic nghiệp vụ: Lưu Token (Mã thông báo) vào LocalStorage (Bộ nhớ trình duyệt) ngay tại đây
    // Nhờ vậy, Component giao diện không cần quan tâm đến việc lưu Token nữa
    const token = response.data?.token;
    if (token) {
      localStorage.setItem('accessToken', token);
    }

    // 3. Trả kết quả về cho Component
    return response;
  },

  // Xử lý luồng Đăng ký
  register: async (data: RegisterPayload) => {
    // Nếu có logic mã hóa mật khẩu trước khi gửi, bạn sẽ viết ở đây
    return await authApi.register(data);
  },

  // Xử lý luồng Xác thực OTP
  verifyOtp: async (data: VerifyOtpPayload) => {
    return await authApi.verifyOtp(data);
  }
};