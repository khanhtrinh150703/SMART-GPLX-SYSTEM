import { UserRoleEnum } from "@/constants/enum/use.enum";
import { emailField, fullNameField, userNameField } from "@/lib/validations/common";
import { z } from "zod";

// --- 1. ĐỊNH NGHĨA PHẦN LÕI (Raw Object) ---
// Không dùng refine ở đây để có thể .pick() hay .omit() tùy ý
const userBaseSchema = z.object({
  username: userNameField,
  fullName: fullNameField,
  email: emailField,
  password: z
    .string()
    .min(6, "Mật khẩu (Password) phải có ít nhất 6 ký tự"),
  confirmPassword: z
    .string()
    .min(1, "Vui lòng xác nhận lại mật khẩu (Confirm Password)"),
  roles: z.array(z.string()),
});

// --- 2. TẠO CREATE SCHEMA (Có logic so khớp mật khẩu) ---
export const createUserSchema = userBaseSchema.refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  }
);

// --- 3. TẠO ADMIN UPDATE SCHEMA (Bốc từ lõi ra) ---
// Bây giờ .pick() sẽ chạy mượt mà vì userBaseSchema vẫn là ZodObject
export const updateAdminRequestSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn (Full name too short)"),
  
  // 💡 Chấp nhận mảng các ID vai trò
  roles: z.array(z.string()).min(1, "Chọn ít nhất một vai trò (Select at least one role)"),
});

// --- 4. TRÍCH XUẤT TYPE ---
export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type AdminUpdatePayload = z.infer<typeof updateAdminRequestSchema>;