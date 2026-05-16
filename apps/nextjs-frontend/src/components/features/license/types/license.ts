import { QueryParams } from "@/types/paginaton.type";

/**
 * Định nghĩa thông tin cơ bản của một hạng bằng lái.
 * (Define basic information of a license category)
 */
export interface LicenseCategory {
  id: string;
  name: string;
  code: string;
  description?: string; // Thêm để đồng bộ với Payload
}

/**
 * Dữ liệu yêu cầu khi tạo mới bằng lái.
 * (Data payload required when creating a new license)
 */
export interface CreateLicensePayload {
  name: string;
  code: string;
  description?: string;
}

/**
 * Dữ liệu cập nhật (Sử dụng Type thay vì Interface rỗng để tránh lỗi ESLint).
 * (Update payload - Using Type instead of empty Interface to avoid ESLint errors)
 */
export type UpdateLicensePayload = Partial<CreateLicensePayload>;

/**
 * Trạng thái thông báo phản hồi trên UI.
 * (Notification state for UI feedback)
 */
export interface MessageState {
  intent: "success" | "error" | "warning";
  text: string;
}

/**
 * Kiểu dữ liệu gộp cho các tham số API License.
 * (Combined type for License API parameters)
 */
export interface LicenseQueryParams extends QueryParams {
  search?: string;
  field?: string;
  description?: string;
  status?: string;
}