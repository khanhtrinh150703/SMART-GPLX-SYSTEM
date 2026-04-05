import { z } from 'zod';
import { emailField, passwordField, userNameField, otpField, fullNameField, loginSchema, phoneField } from './common';

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

/**
 * Mục đích (Purpose): Khởi tạo lược đồ kiểm tra tính hợp lệ (Validation schema) cho biểu mẫu thêm/sửa người dùng (User form). Đảm bảo tính toàn vẹn dữ liệu (Data integrity).
 * Tham số (Parameters): Không có (None).
 * Trả về (Returns): Lược đồ Zod (Zod Schema object).
 */
export const adminUserSchema = z.object({
  phone: phoneField,
  email: z.string().email("Định dạng email không hợp lệ (Invalid email format)"),
  name: z.string().min(2, "Tên phải chứa ít nhất 2 ký tự (Minimum 2 characters)"),
  licenseClass: z.enum(["A1", "B1", "B2"]),
  status: z.enum(["ACTIVE", "LOCKED"])
});

// Export Types
export type AdminUserFormValues = z.infer<typeof adminUserSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;