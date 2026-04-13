/**
 * Interface đại diện cho một Hạng bằng lái trong hệ thống.
 * (Interface representing a License Category in the system)
 */
export interface LicenseCategory {
  id: string; // Định danh duy nhất (Unique Identifier - UUID)
  name: string; // Tên hạng bằng lái (ví dụ: A1, B2)
  minAge: number; // Độ tuổi tối thiểu (Minimum Age)
  description: string; // Mô tả chi tiết (Detailed Description)
  createdAt: string; // Ngày tạo (Creation Date - ISO format)
  status: "active" | "inactive" | "deleted";
}

/**
 * Dữ liệu đầu vào khi tạo mới hạng bằng lái.
 * (Input data for creating a new license category)
 */
export type CreateLicenseCategoryRequest = Pick<
  LicenseCategory,
  "name" | "description" | "minAge"
>;

/**
 * Dữ liệu đầu vào khi cập nhật hạng bằng lái.
 * (Input data for updating an existing license category)
 */
export type UpdateLicenseCategoryRequest = Partial<CreateLicenseCategoryRequest>;