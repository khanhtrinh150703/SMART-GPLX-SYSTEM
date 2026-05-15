import { ReactNode } from "react";

// 1. Kiểu dữ liệu cho một bản ghi Chương (Chapter Record)
// Dịch: Cấu trúc dữ liệu của một Chương
export interface ChapterRecord {
  id: string;
  order: number;
  name: string;
  description: string;
  status: "active" | "draft"; // Chỉ chấp nhận 2 giá trị cụ thể
}

// 2. Kiểu dữ liệu cho cấu hình Tab trạng thái (Status Option)
// Dịch: Tùy chọn trạng thái (Sử dụng Generic <T> để linh hoạt kiểu ID)
export interface StatusOption<T> {
  id: T;           // ID của tab (ví dụ: "all", "active")
  label: string;   // Nhãn hiển thị tiếng Việt
  color?: string;  // Màu sắc (không bắt buộc)
  activeBgClass?: string;  // Màu sắc (không bắt buộc)
}

// 3. Kiểu dữ liệu cho cấu hình cột của bảng (Table Column)
// Dịch: Cấu hình cột của bảng
export interface Column<T> {
  header: string;                                  // Tiêu đề cột
  accessor: keyof T | ((item: T) => ReactNode);    // Truy xuất dữ liệu bằng key hoặc hàm trả về JSX
  className?: string;                              // Class CSS tùy chỉnh (Tailwind)
}