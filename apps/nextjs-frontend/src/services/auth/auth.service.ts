// src/services/auth.service.ts
import { authApi } from '@/src/api/auth/auth.api';
import type {
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ResendOtpPayload
} from '@/src/types/auth.type';
import { useUserStore } from '../user/user.service';

/**
 * Auth Service: Xử lý Logic nghiệp vụ (Business Logic)
 * Đóng vai trò cầu nối (Bridge) giữa Giao diện (UI) và Tầng truy cập dữ liệu (API/Data Access Layer).
 * Quy tắc: KHÔNG dùng try/catch tại đây (để UI chủ động bắt lỗi).
 */
export const authService = {

  /**
   * 1. Xử lý Đăng nhập (Login Business Logic)
   * Thực hiện: Gọi API -> Lưu Token -> Cập nhật Cache người dùng.
   */
  async login(data: LoginPayload) {
    const response = await authApi.login(data);
    const authData = response.data; // Cấu trúc: { user, accessToken, refreshToken }

    // KIỂM TRA & LƯU TRỮ TOKEN (Authentication Tokens)
    // Sửa lỗi: Phải lấy từ authData thay vì authApi
    if (authData && authData.accessToken) {
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
    }

    // CẬP NHẬT TRẠNG THÁI TOÀN CỤC (Global State Management)
    // Lưu thông tin người dùng vào Zustand Store để dùng cho trang Profile/Header mà không cần gọi lại DB
    // Kiểm tra authData tồn tại VÀ authData.user tồn tại
    if (authData && authData.user) {
      useUserStore.getState().setUser(authData.user);
    }

    return authData;
  },

  /**
   * 2. Gửi yêu cầu mã OTP khi quên mật khẩu (Request Forgot Password OTP)
   */
  async requestForgotPassword(data: ForgotPasswordPayload) {
    const response = await authApi.forgotPassword(data);
    return response.data;
  },

  /**
   * 3. Xử lý Đăng ký tài khoản (User Registration)
   */
  async register(data: RegisterPayload) {
    const response = await authApi.register(data);
    return response.data;
  },

  /**
   * 4. Xác thực mã OTP (OTP Verification)
   * Thường dùng sau khi đăng ký hoặc trong luồng đặt lại mật khẩu.
   */
  async verifyOtp(data: VerifyOtpPayload) {
    const response = await authApi.verifyOtp(data);
    return response.data;
  },

  /**
   * 5. Thực thi đặt lại mật khẩu mới (Reset Password Execution)
   */
  async resetPassword(data: ResetPasswordPayload) {
    const response = await authApi.resetPassword(data);
    return response.data;
  },

  /**
   * 6. Gửi lại mã OTP (Resend OTP)
   * Hỗ trợ trải nghiệm người dùng khi mã OTP bị hết hạn hoặc không nhận được.
   */
  async resendOtp(data: ResendOtpPayload) {
    const response = await authApi.resendOtp(data);
    return response.data;
  },

  /**
   * 7. Đăng xuất (Sign Out)
   * Xóa sạch dấu vết định danh (Cleaning Identifiers) và đưa người dùng về trang đăng nhập.
   */
  logout() {
    // 1. Xóa các Token bảo mật
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // 2. Dọn dẹp các dữ liệu tạm (Temporary Email)
    localStorage.removeItem('register_email');
    localStorage.removeItem('reset_email');

    // 3. Reset Store (Xóa Cache người dùng)
    useUserStore.getState().clearUser();

    // 4. Điều hướng cứng về Login (Hard Redirect)
    window.location.href = '/login';
  }
};