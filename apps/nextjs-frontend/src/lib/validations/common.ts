import { z } from 'zod';
import { REGEX } from '@/constants/regex.constants';

/**
 * Shared Validation Atoms 
 * (Các nguyên tử xác thực dùng chung)
 */
export const emailField = z
  .string()
  .min(1, { message: 'Email không được để trống' })
  .regex(REGEX.EMAIL, { message: 'Email không đúng định dạng' });

export const passwordField = z
  .string()
  .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  .regex(REGEX.PASSWORD, { message: 'Mật khẩu yếu! Cần chữ hoa, chữ thường, số và ký tự đặc biệt.' });

export const phoneField = z
  .string()
  .regex(REGEX.PHONE_VN, { message: 'Số điện thoại không hợp lệ.' });

export const userNameField = z
  .string()
  .regex(REGEX.USERNAME, { message: "Tên tài khoản không đúng định dạng" });

export const fullNameField = z
  .string()
  .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" });

export const otpField = z
  .string()
  .length(6, { message: 'Mã xác thực OTP phải có đúng 6 chữ số' });

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
});
