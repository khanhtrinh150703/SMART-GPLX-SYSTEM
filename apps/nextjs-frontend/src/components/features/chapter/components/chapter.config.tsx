// file: chapter-config.tsx

import { Chapter } from "@/components/features/chapter/types/chapter.types";
import { StatusOption } from "@/types/types";

// 1. Định nghĩa kiểu dữ liệu Chapter (Interface)
// Dịch: Cấu trúc dữ liệu của một Chương học

// 2. Cấu hình Tab (Status Tabs Configuration)
// Dịch: Cấu hình các Tab trạng thái (Phải khớp với status của Chapter)
export const CHAPTER_STATUS_OPTIONS: StatusOption<Chapter["status"] | "all">[] =
  [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Đang Hoạt động", color: "text-emerald-600" },
    { id: "deleted", label: "Thùng rác", color: "text-rose-600" },
  ];
// chapter.config.ts
export const FILTER_FIELDS = [
  // Đổi "title" thành "name" cho khớp với field bạn gửi từ ô Search
  { label: "Tên Chương", value: "name" },
  { label: "Mô tả", value: "description" },
  { label: "Trạng thái", value: "status" },
  { label: "Thứ tự", value: "orderIndex" },
];
