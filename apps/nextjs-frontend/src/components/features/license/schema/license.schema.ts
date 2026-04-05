import { z } from 'zod';

/**
 * licenseSchema - Lược đồ dùng cho việc THÊM MỚI hạng bằng lái.
 */
export const licenseSchema = z.object({
  code: z
    .string()
    .min(1, "Mã hạng không được để trống (VD: A1, B2)")
    .toUpperCase(), // Tự động chuyển code sang viết hoa

  name: z
    .string()
    .min(1, "Tên hạng bằng không được để trống")
    .min(5, "Tên hạng bằng phải ít nhất 5 ký tự"),

  description: z.string().optional(),

  // Sử dụng z.coerce để ép kiểu từ string sang number cho form input
  minAge: z.coerce
    .number()
    .min(16, "Độ tuổi tối thiểu phải từ 16 trở lên"),

  totalQuestions: z.coerce
    .number()
    .min(1, "Tổng số câu hỏi phải lớn hơn 0"),

  passingScore: z.coerce
    .number()
    .min(1, "Điểm đạt phải lớn hơn 0"),

  testDuration: z.coerce
    .number()
    .min(1, "Thời gian thi phải lớn hơn 0"),
});


// 1. Zod Schema: Định nghĩa chuẩn xác 100% theo JSON Payload (Dữ liệu gửi đi) của Backend
export const createLicenseSchema = z.object({
  name: z
    .string()
    .min(1, "Tên/Mã hạng không được để trống")
    .toUpperCase(), // Ép kiểu in hoa (VD: b1 -> B1)
  
  description: z
    .string()
    .min(1, "Mô tả không được để trống"),
  
  minAge: z.coerce
    .number()
    .min(16, "Độ tuổi tối thiểu phải từ 16 trở lên"),
});

// Trích xuất Type (Kiểu dữ liệu) để dùng cho Form
/**
 * licenseEditSchema - Lược đồ dùng cho việc CHỈNH SỬA hạng bằng lái.
 * Yêu cầu khắt khe hơn về mô tả và có thêm trạng thái (Status).
 */
export const licenseEditSchema = licenseSchema.extend({
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .min(10, "Mô tả phải ít nhất 10 ký tự"),

  status: z.enum(["active", "draft", "deleted"],
  ),
}).refine((data) => data.passingScore <= data.totalQuestions, {
  message: "Điểm đạt không được lớn hơn tổng số câu hỏi",
  path: ["passingScore"], // Báo lỗi tại trường passingScore
});

/** * --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ---
 * Sử dụng z.input và z.output để tách biệt dữ liệu Form thô và dữ liệu API sạch.
 */

// 1. Kiểu dữ liệu ĐẦU VÀO (Dùng cho useForm)
export type LicenseFormValues = z.input<typeof licenseSchema>;
export type LicenseFormEditValues = z.input<typeof licenseEditSchema>;

// 2. Kiểu dữ liệu ĐẦU RA (Dùng cho API call sau khi handleSubmit thành công)
export type LicenseOutputValues = z.output<typeof licenseSchema>;
export type LicenseEditOutputValues = z.output<typeof licenseEditSchema>;
export type CreateLicensePayload = z.input<typeof createLicenseSchema>;
