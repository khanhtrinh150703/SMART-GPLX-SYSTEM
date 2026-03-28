// src/types/auth.type.ts


// 1. Request Payloads (Dữ liệu gửi lên BE)
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// 2. Response Data (Dữ liệu BE trả về)
export interface RegisterResponse {
  message: string;
  userId: string;
}

// Định nghĩa kiểu dữ liệu nhận về (Response Data Type)
export interface LoginResponseData {
  accessToken: string; // Mã thông báo truy cập
  refreshToken: string; // Mã thông báo làm mới
}

export interface ResendOtpPayload {
  email: string;
}
