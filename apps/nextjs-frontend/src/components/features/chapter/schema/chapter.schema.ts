import { z } from 'zod';

/**
 * chapterSchema - Lược đồ thêm mới chương học
 */
export const chapterSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Tiêu đề không được để trống' })
    .min(5, { message: 'Tiêu đề phải ít nhất 5 ký tự' }),

  description: z.string().optional(),

  order: z
    .union([z.number()])
    .pipe(z.coerce.number())
    .refine((val) => val >= 1, "Thứ tự phải lớn hơn 0"),
});

/**
 * chapterEditSchema - Lược đồ chỉnh sửa chương học
 */
export const chapterEditSchema = z.object({
  name: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .min(5, "Tiêu đề phải ít nhất 5 ký tự"),

  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .min(10, "Mô tả phải ít nhất 10 ký tự"),

  orderIndex: z
    .union([z.number()])
    .pipe(z.coerce.number())
    .refine((val) => val >= 1, "Thứ tự phải lớn hơn 0"),

  status: z.enum(["active", "draft", "deleted"],
  ),
});

// 1. Zod Schema: Định nghĩa đúng chuẩn theo JSON Payload của Backend
export const createChapterSchema = z.object({
  name: z.string().min(1, "Tên chương không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  // Sử dụng z.coerce để ép kiểu Input String -> Number an toàn
  orderIndex: z
    .union([z.number()])
    .pipe(z.coerce.number())
    .refine((val) => val >= 1, "Thứ tự phải lớn hơn 0"),

});

// Trích xuất Type để dùng cho Form
export type CreateChapterPayload = z.infer<typeof createChapterSchema>;

// Kiểu dữ liệu ĐẦU VÀO (Input Type) - Dùng cho useForm để khớp với thẻ Input
export type ChapterFormValues = z.input<typeof chapterSchema>;
export type ChapterFormEditValues = z.input<typeof chapterEditSchema>;

// Kiểu dữ liệu ĐẦU RA (Output Type) - Dùng khi nhận dữ liệu sạch từ handleSubmit để gọi API
export type ChapterOutputValues = z.output<typeof chapterSchema>;
export type UpdateChapterPayload = z.output<typeof chapterEditSchema>;