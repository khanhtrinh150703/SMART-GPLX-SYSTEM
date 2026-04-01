import { z } from 'zod';
import { emailField, passwordField, userNameField, otpField, fullNameField, loginSchema } from './common';

// --- 1. LOGIN SCHEMA (Đăng nhập) ---

// --- 2. REGISTER SCHEMA (Đăng ký) ---
export const registerSchema = z.object({
  username: userNameField,
  fullName: fullNameField,
  email: emailField,
  password: passwordField,
  confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"],
});

// --- 3. FORGOT/RESET PASSWORD ---
export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  otp: otpField,
  newPassword: passwordField,
  confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"],
});


// Export Types
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;