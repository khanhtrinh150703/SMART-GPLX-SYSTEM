// src/lib/validations/auth.schema.ts
import { z } from 'zod';
import { REGEX } from '@/src/constants/regex.constants';

// ... (phần loginSchema giữ nguyên)

/**
 * Lược đồ kiểm tra dữ liệu Đăng ký (Register Validation Schema)
 */
export const registerSchema = z.object({
  username: z.string().min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
  email: z
    .string()
    .min(1, { message: 'Email không được để trống' })
    .regex(REGEX.EMAIL, { message: 'Email không đúng định dạng' }),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .regex(REGEX.PASSWORD, { message: 'Mật khẩu yếu! Cần chữ hoa, chữ thường , số và ký tự đặc biệt.' }),
  confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"], // Trỏ lỗi này vào ô confirmPassword
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;