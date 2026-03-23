// src/constants/api-endpoints.ts

// Lấy domain gốc từ biến môi trường (Ví dụ: http://localhost:8080/api/v1)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  },
  // Thêm các tính năng khác sau này: EXAM, USER_PROFILE...
};