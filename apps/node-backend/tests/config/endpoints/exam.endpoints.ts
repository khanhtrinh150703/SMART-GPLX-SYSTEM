import { API_BASE } from '../api-base.config'; // Giả định file cấu hình gốc của bạn

/** 
 * @description Tập hợp các điểm cuối (endpoints) phục vụ quản lý và tổ chức thi 
 * Tuân thủ tiêu chuẩn đóng băng kiểu literal 'as const' bảo vệ an toàn kiểu dữ liệu.
 */
export const EXAM_ENDPOINTS = {
  // --- Nhóm công cộng (Public Access - Không cần Token) ---
  /** @description Học viên truy vấn danh sách bài thi (Phân trang & Bộ lọc) */
  LIST_PUBLIC: `${API_BASE.EXAMS}/list`,
  /** @description Lấy chi tiết đề thi và danh sách câu hỏi snapshot để học viên làm bài */
  DETAIL_PUBLIC: (id: string) => `${API_BASE.EXAMS}/detail/${id}`,

  // --- Nhóm nội bộ (Private Access - Yêu cầu Auth Token & Quyền hạn) ---
  /** @description Quản trị viên truy vấn danh sách tổng quan hệ thống (exams:read) */
  LIST_PRIVATE: `${API_BASE.EXAMS}`,
  /** @description Tự động tạo đề thi dựa trên ma trận đề (exams:manage) */
  GENERATE_AUTO: `${API_BASE.EXAMS}/generate-auto`,
  /** @description Khởi tạo bài thi thủ công từ danh sách câu hỏi chỉ định (exams:manage) */
  CREATE_MANUAL: `${API_BASE.EXAMS}/manual`,
  /** @description Cập nhật thông tin/trạng thái/thời gian đề thi (exams:manage) */
  EDIT: (id: string) => `${API_BASE.EXAMS}/${id}`,
  /** @description Thực thi chiến lược xóa thông minh (exams:manage) */
  DELETE: (id: string) => `${API_BASE.EXAMS}/${id}`,
  /** @description Khôi phục đề thi đã bị xóa mềm (exams:manage) */
  RESTORE: (id: string) => `${API_BASE.EXAMS}/${id}/restore`,
} as const;

// Định nghĩa kiểu dữ liệu từ hằng số để phục vụ rào cản type guard khi cần
export type ExamEndpoints = typeof EXAM_ENDPOINTS;