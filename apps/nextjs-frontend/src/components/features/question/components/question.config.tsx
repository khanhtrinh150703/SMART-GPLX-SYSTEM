import { StatusOption } from "@/types/types";
// Lưu ý: Import type Question từ file types của feature (Import Question type)
import { Question } from "../types/question.types";

/**
 * QUESTION_STATUS_OPTIONS: Cấu hình các Tab trạng thái cho câu hỏi
 * (Status Tabs Configuration for Questions)
 */
export const QUESTION_STATUS_OPTIONS: StatusOption<
  NonNullable<Question["status"]> | "all"
>[] = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Đang hoạt động", color: "text-emerald-600" },
  { id: "draft", label: "Bản nháp", color: "text-slate-500" },
  { id: "deleted", label: "Thùng rác", color: "text-rose-600" },
];

/**
 * FILTER_FIELDS: Danh sách các trường hỗ trợ tìm kiếm/lọc
 * (List of fields supported for searching/filtering)
 */
export const FILTER_FIELDS = [
  { label: "Nội dung câu hỏi", value: "content" }, // Tìm kiếm theo nội dung (Search by content)
  { label: "Câu hỏi điểm liệt", value: "isCritical" }, // Lọc câu hỏi quan trọng (Filter critical questions)
  { label: "Hạng bằng lái", value: "licenseCategoryIds" }, // Lọc theo hạng bằng (Filter by license)
  { label: "Chương bằng lái", value: "chapterIds" }, // Lọc theo hạng bằng (Filter by license)
  { label: "Độ khó", value: "difficultyLevel" }, // Lọc theo cấp độ (Filter by difficulty)
];

/**
 * DIFFICULTY_OPTIONS: Cấu hình hiển thị độ khó
 * (Difficulty level display configuration)
 */
export const DIFFICULTY_MAP: Record<string, { label: string; color: string }> =
  {
    EASY: { label: "Dễ", color: "bg-emerald-100 text-emerald-700" },
    MEDIUM: { label: "Trung bình", color: "bg-amber-100 text-amber-700" },
    HARD: { label: "Khó", color: "bg-rose-100 text-rose-700" },
  };

export const DIFFICULTY_OPTIONS = [
  { value: "1", label: "Dễ" },
  { value: "2", label: "Trung bình" },
  { value: "3", label: "Khó" },
];
/**
 * CRITICAL_OPTIONS: Tùy chọn cho câu hỏi điểm liệt (Dùng cho Dropdown)
 * (Options for critical questions - Used for Dropdown)
 */
export const CRITICAL_OPTIONS = [
  { value: "true", label: "Câu điểm liệt (Critical)" },
  { value: "false", label: "Câu thường (Normal)" },
];
