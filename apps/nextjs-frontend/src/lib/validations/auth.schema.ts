import { z } from 'zod';
import { REGEX } from '@/src/constants/regex.constants';

// --- CÁC TRƯỜNG DÙNG CHUNG (Shared Fields) ---
const emailField = z
  .string()
  .min(1, { message: 'Email không được để trống' })
  .regex(REGEX.EMAIL, { message: 'Email không đúng định dạng' });

const passwordField = z
  .string()
  .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  .regex(REGEX.PASSWORD, { message: 'Mật khẩu yếu! Cần chữ hoa, chữ thường, số và ký tự đặc biệt.' });

// --- 1. LOGIN SCHEMA (Đăng nhập) ---
export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
});

// --- 2. REGISTER SCHEMA (Đăng ký) ---
export const registerSchema = z.object({
  username: z.string().min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
  email: emailField,
  password: passwordField,
  confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"],
});

// --- 3. FORGOT PASSWORD SCHEMA (Quên mật khẩu - Bước 1) ---
export const forgotPasswordSchema = z.object({
  email: emailField,
});

// --- 4. RESET PASSWORD SCHEMA (Đặt lại mật khẩu - Bước 2) ---
// Schema này khớp hoàn toàn với kịch bản Test (email, otp, newPassword)
export const resetPasswordSchema = z.object({
  otp: z.string().length(6, { message: 'Mã xác thực OTP phải có đúng 6 chữ số' }),
  newPassword: passwordField,
  confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống (Required)'),
  nickname: z.string().optional(),
  email: z.string().email('Email không đúng định dạng (Invalid Email)'),
  roles: z.array(z.string()).min(1, 'Phải có ít nhất một vai trò (Role required)'),
});


// --- EXPORT TYPES (Trích xuất kiểu dữ liệu) ---
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
