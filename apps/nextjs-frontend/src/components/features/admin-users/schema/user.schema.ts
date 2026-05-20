import {
  emailField,
  fullNameField,
  passwordField,
  userNameField,
} from "@/lib/validations/common";
import { z } from "zod";

// --- 1. ĐỊNH NGHĨA PHẦN LÕI (Raw Object) ---
// Không dùng refine ở đây để có thể .pick() hay .omit() tùy ý
const userBaseSchema = z.object({
  username: userNameField,
  fullName: fullNameField,
  email: emailField,
  password: passwordField,
  confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu "),
  roles: z.array(z.string()),
});

// --- 2. TẠO CREATE SCHEMA (Có logic so khớp mật khẩu) ---
export const createUserSchema = userBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  },
);

// --- 3. TẠO ADMIN UPDATE SCHEMA (Bốc từ lõi ra) ---
// Bây giờ .pick() sẽ chạy mượt mà vì userBaseSchema vẫn là ZodObject
export const updateAdminRequestSchema = z.object({
  fullName: fullNameField,

  // 💡 Chấp nhận mảng các ID vai trò
  roles: z.array(z.string()).min(1, "Chọn ít nhất một vai trò "),
});

// --- 4. TRÍCH XUẤT TYPE ---
export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type AdminUpdatePayload = z.infer<typeof updateAdminRequestSchema>;
