// src/types/auth.type.ts

import { FieldValues, UseFormRegister } from "react-hook-form";


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

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  otp: string,
  newPassword: string;
  email: string;
}


export interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  // Thay <any> bằng <FieldValues>
  register: UseFormRegister<FieldValues>;
  error?: {
    message?: string;
  };
}

interface UserRole {
  id: string;
  name: string;
  displayName: string;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  fullName: string;
  urlPicture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

// 2. Định nghĩa Data trả về từ API Login
export interface LoginResponseData {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}