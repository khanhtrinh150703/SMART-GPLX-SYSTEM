// file: exam-matrix-config.tsx

import { IExamMatrixResponse } from "../types/exam-management";
import { StatusOption } from "@/types/types";

/**
 * 1. Cấu hình Tab trạng thái (Status Tabs Configuration)
 * Dịch: Cấu hình các bộ lọc trạng thái cho danh sách ma trận.
 */
export const EXAM_MATRIX_STATUS_OPTIONS: StatusOption<
  IExamMatrixResponse["status"] | "all"
>[] = [
  {
    id: "all",
    label: "Tất cả",
    color: "bg-slate-500 shadow-lg shadow-slate-200/60",
  },
  {
    id: "active",
    label: "Đang hoạt động",
    color: "bg-emerald-500 shadow-lg shadow-emerald-200/50",
  },
  {
    id: "deleted",
    label: "Thùng rác",
    color: "bg-rose-500 shadow-lg shadow-rose-200/50",
  },
];
/**
 * 2. Cấu hình các trường lọc (Filter Fields Configuration)
 * Dịch: Danh sách các trường dữ liệu cho phép tìm kiếm và lọc.
 */
export const FILTER_FIELDS = [
  { label: "Tên ma trận", value: "name" },
  { label: "Hạng bằng lái", value: "licenseCategoryName" },
  { label: "Tổng số câu", value: "totalQuestions" },
  { label: "Điểm đạt", value: "passingScore" },
  { label: "Thời gian", value: "durationMinutes" },
  { label: "Câu điểm liệt", value: "minCriticalQuestions" },
];
