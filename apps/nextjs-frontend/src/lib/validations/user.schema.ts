import { z } from 'zod';
import { emailField, fullNameField, passwordField, userNameField } from './common';

// --- PROFILE SCHEMA ---
export const profileSchema = z.object({
  fullName: fullNameField,
  username: userNameField,
  email: emailField,
  urlPicture: z.union([z.string(), z.instanceof(File)]).optional(),
  roles: z.array(z.string()),
});

export const adminUpdateSchema = profileSchema
  .pick({
    fullName: true,
    email: true
  }) // Chỉ lấy fullName và email từ profileSchema

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
  newPassword: passwordField, // Tái sử dụng passwordField từ common.ts
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// --- EMAIL UPDATE SCHEMA ---
export const emailSchema = z.object({
  email: emailField,
});

// Export Types
export type AdminUpdateFormValues = z.infer<typeof adminUpdateSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type EmailFormValues = z.infer<typeof emailSchema>;