// src/constants/api-endpoints.ts

import { Delete } from "lucide-react";

// Lấy domain gốc từ biến môi trường (Ví dụ: http://localhost:8080/api/v1)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register/init`,
    VERIFY_OTP: `${API_BASE_URL}/auth/register/verify`,
    RESEND_OTP: `${API_BASE_URL}/auth/resend-otp`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  USER: {
    UPDATE_PROFILE: `${API_BASE_URL}/users/me/profile`,
    UPDATE_PROFILE_ADMIN: `${API_BASE_URL}/users/admin`,
    CHANGEPASSWORD: `${API_BASE_URL}/users/me/password`,
    DELETE: `${API_BASE_URL}/users`,
    GET_ALL: `${API_BASE_URL}/users`,
    RESTORE: `${API_BASE_URL}/users`,
  }
  // Thêm các tính năng khác sau này: EXAM, USER_PROFILE...
};