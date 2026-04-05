import { User } from "./user.type";

// Request Payloads (Dữ liệu gửi lên Backend)
export interface RegisterPayload {
  username: string;
  email: string;
  fullName: string;
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

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  otp: string;
  newPassword: string;
  email: string;
}

// Response Data (Dữ liệu phản hồi từ API)
export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}


