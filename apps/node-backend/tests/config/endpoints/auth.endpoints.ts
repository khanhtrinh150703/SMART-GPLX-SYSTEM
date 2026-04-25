import { API_BASE } from '../api-base.config';

/** @description Các điểm cuối (endpoints) phục vụ xác thực và phân quyền */
export const AUTH_ENDPOINTS = {
  REGISTER_INIT: `${API_BASE.AUTH}/register/init`,
  REGISTER_VERIFY: `${API_BASE.AUTH}/register/verify`,
  LOGIN: `${API_BASE.AUTH}/login`,
  LOGOUT: `${API_BASE.AUTH}/logout`,
  RESEND_OTP: `${API_BASE.AUTH}/resend-otp`,
  FORGOT_PASSWORD: `${API_BASE.AUTH}/forgot-password`,
  RESET_PASSWORD: `${API_BASE.AUTH}/reset-password`,
  REFRESH_TOKEN: `${API_BASE.AUTH}/refresh-token`,
} as const;