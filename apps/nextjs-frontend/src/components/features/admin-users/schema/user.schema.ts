import { z } from "zod";


// 1. Zod Schema: Định nghĩa cấu trúc dữ liệu và các quy tắc kiểm tra (Validation Rules)
export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập (Username) phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được vượt quá 50 ký tự"),
  
  fullName: z
    .string()
    .min(1, "Họ và tên (Full Name) không được để trống"),

  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Định dạng email không hợp lệ (VD: luffy@gmail.com)"),

  password: z
    .string()
    .min(6, "Mật khẩu (Password) phải có ít nhất 6 ký tự"),

  confirmPassword: z
    .string()
    .min(1, "Vui lòng xác nhận lại mật khẩu (Confirm Password)"),
})
// Sử dụng .refine() để kiểm tra logic chéo giữa 2 trường dữ liệu (Cross-field validation)
.refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"], // Lỗi sẽ được hiển thị ở ô confirmPassword
});

// Trích xuất Type (Kiểu dữ liệu) để sử dụng cho React Hook Form
export type CreateUserPayload = z.input<typeof createUserSchema>;