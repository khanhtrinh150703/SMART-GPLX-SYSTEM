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

// ... Bạn có thể thêm LoginResponse vào đây sau