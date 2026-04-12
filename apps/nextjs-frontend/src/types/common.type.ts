// src/types/common.type.ts

export interface StandardResponse<T> {
  success: boolean;
  code: string;       
  statusCode: number; 
  message: string;
  data?: T; // <T> là phần lõi dữ liệu sẽ thay đổi tùy theo từng API           
}

export interface SelectionData {
  value: string; // Thường là ID (UUID)
  label: string; // Tên hiển thị trên giao diện (ví dụ: "A1", "B2")
}