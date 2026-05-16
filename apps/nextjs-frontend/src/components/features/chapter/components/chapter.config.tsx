// file: chapter-config.tsx

import { Chapter } from "@/components/features/chapter/types/chapter.types";
import { StatusOption } from "@/types/types";

// 1. Định nghĩa kiểu dữ liệu Chapter (Interface)
// Dịch: Cấu trúc dữ liệu của một Chương học

// 2. Cấu hình Tab (Status Tabs Configuration)
// Dịch: Cấu hình các Tab trạng thái (Phải khớp với status của Chapter)
export const CHAPTER_STATUS_OPTIONS: StatusOption<Chapter["status"] | "all">[] = [
  { 
    id: "all", 
    label: "Tất cả", 
    color: "bg-slate-500 shadow-lg shadow-slate-200/60" 
  },
  { 
    id: "active", 
    label: "Đang hoạt động", 
    color: "bg-emerald-500 shadow-lg shadow-emerald-200/50" 
  },
  { 
    id: "deleted", 
    label: "Thùng rác", 
    color: "bg-rose-500 shadow-lg shadow-rose-200/50" 
  },
];
// chapter.config.ts
export const FILTER_FIELDS = [
  // Đổi "title" thành "name" cho khớp với field bạn gửi từ ô Search
  { label: "Tên Chương", value: "name" },
  { label: "Mô tả", value: "description" },
  { label: "Trạng thái", value: "status" },
  { label: "Thứ tự", value: "orderIndex" },
];
