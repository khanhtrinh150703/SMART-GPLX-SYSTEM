import { z } from 'zod';


/**
 * createLicenseSchema - Lược đồ dùng cho việc THÊM MỚI hạng bằng lái.
 */
export const createLicenseSchema = z.object({
  name: z
    .string()
    .min(1, "Tên hạng không được để trống")
    .max(10, "Tên hạng quá dài"),

  minAge: z
    .union([z.number()]) // Chấp nhận cả chuỗi và số ở đầu vào
    .pipe(z.coerce.number())        // Sau đó mới ép về kiểu number sạch
    .refine((val) => val >= 18, "Độ tuổi tối thiểu phải từ 18"),

  description: z
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả quá dài"),
  orderIndex: z
    .union([z.number()])
    .pipe(z.coerce.number())
    .refine((val) => val >= 1, "Thứ tự phải lớn hơn 0"),
});

/**
 * editLicenseSchema - Lược đồ dùng cho việc CHỈNH SỬA hạng bằng lái.
 */
export const editLicenseSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  minAge: z
    .union([z.number()])
    .pipe(z.coerce.number())
    .refine((val) => val >= 18, "Độ tuổi tối thiểu phải từ 18"),
  status: z.enum(["active", "inactive", "deleted"]),
  orderIndex: z
    .union([z.number()])
    .pipe(z.coerce.number())
    .refine((val) => val >= 1, "Thứ tự phải lớn hơn 0"),
});

/** * --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES) ---
 * Sử dụng z.infer để lấy kiểu dữ liệu "sạch" (đã ép kiểu) cho cả Form và API.
 */

// Kiểu dữ liệu dùng cho biểu mẫu (Form Values)
export type LicenseFormEditValues = z.infer<typeof editLicenseSchema>;

// Kiểu dữ liệu dùng cho Payload gửi lên API (API Payloads)
export type UpdateLicensePayload = z.infer<typeof editLicenseSchema>;
export type CreateLicensePayload = z.infer<typeof createLicenseSchema>;