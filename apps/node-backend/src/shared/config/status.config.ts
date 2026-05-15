// 1. Định nghĩa một Object chứa các giá trị (Runtime)
export const STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  DELETED: 'DELETED',
  ARCHIVED: 'ARCHIVED',
} as const;

// 2. Tự động trích xuất Type từ Object trên (Compile-time)
// Kết quả vẫn là: "ACTIVE" | "DRAFT" | "DELETED" | "ARCHIVED"
export type Status = typeof STATUS[keyof typeof STATUS];