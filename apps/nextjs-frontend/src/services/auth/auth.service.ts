import { authApi } from '@/api/auth/auth.api';
import type {
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ResendOtpPayload,
  LoginResponseData
} from '@/types/auth.type';
import { useUserStore } from '../../store/user/user.store';
/**
 * Auth Service: Lớp xử lý nghiệp vụ xác thực (Authentication Business Logic).
 * Đóng vai trò cầu nối (Bridge) giữa Giao diện (UI) và Tầng truy cập dữ liệu (API Layer).
 * Quy tắc: Tuyệt đối KHÔNG dùng try/catch tại đây (để UI chủ động bắt lỗi).
 */
export const authService = {

  /**
   * 1. Xử lý Đăng nhập (Login Business Logic)
   * Luồng: Gọi API -> Cập nhật Store (Zustand tự động sync xuống LocalStorage).
   */
  // src/services/auth.service.ts
  async login(data: LoginPayload): Promise<LoginResponseData | null> {
    // 1. Gọi API (Lúc này 'res' tự động mang kiểu StandardResponse<LoginResponseData>)
    const res = await authApi.login(data);

    // 2. Kiểm tra success từ Backend
    if (res.success && res.data) {
      const { user, accessToken, refreshToken } = res.data;

      // 3. Lưu vào Store (Dùng hàm setAuth 3 tham số chúng ta đã chốt)
      useUserStore.getState().setAuth(user, accessToken, refreshToken);

      return res.data;
    }

    return null;
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
   */
  async resendOtp(data: ResendOtpPayload) {
    const response = await authApi.resendOtp(data);
    return response.data;
  },

  /**
   * 7. Đăng xuất (Sign Out)
   * Thực hiện dọn dẹp bộ nhớ (Cleaning Cache) và đưa người dùng về trạng thái ban đầu.
   */
  logout() {
    // 1. Dọn dẹp Store (Hàm clear này đã xóa sạch user và accessToken trong cả RAM và LocalStorage)
    useUserStore.getState().logout();

    // 2. Xóa các dữ liệu rác ngoài Store (Manual Cleanup)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('register_email');
      localStorage.removeItem('reset_email');

      // 3. Điều hướng cứng (Hard Redirect) để reset hoàn toàn ứng dụng
      window.location.href = '/login';
    }
  }
};