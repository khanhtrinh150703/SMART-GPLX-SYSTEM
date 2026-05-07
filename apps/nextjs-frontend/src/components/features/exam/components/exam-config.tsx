import { StatusOption } from "@/types/types";
import { ExamStatus } from "../types/enums";

/**
 * 1. Cấu hình Tab trạng thái Đề thi (Exam Status Tabs Configuration)
 * Dịch: Phân loại đề thi theo trạng thái thực hiện trong hệ thống.
 */
/**
 * @description Tùy chọn hiển thị trạng thái đề thi cho UI (Filter/Badges).
 * Tuân thủ Modern Professional Minimalist với màu Emerald-600 chủ đạo.
 */
export const EXAM_STATUS_OPTIONS: StatusOption<ExamStatus | "all">[] = [
  {
    id: "all",
    label: "Tất cả đề thi",
    color: "text-slate-500",
  },
  {
    id: ExamStatus.DRAFT,
    label: "Bản nháp",
    color: "text-slate-400", // Màu trung tính cho bản nháp
  },
  {
    id: ExamStatus.PUBLISHED,
    label: "Sẵn sàng thi",
    color: "text-emerald-600", // Emerald-600 cho trạng thái hoạt động chính
  },
  {
    id: ExamStatus.ARCHIVED,
    label: "Đã lưu trữ",
    color: "text-amber-500", // Màu vàng cảnh báo trạng thái lưu trữ
  },
];

/**
 * 2. Cấu hình các trường lọc Đề thi (Exam Filter Fields Configuration)
 * Dịch: Các tiêu chí hỗ trợ tìm kiếm và truy vấn đề thi.
 */
export const EXAM_FILTER_FIELDS = [
  { label: "Tên đề thi", value: "name" },
  { label: "Hạng GPLX", value: "licenseCategoryId" },
  { label: "Tổng số câu", value: "totalQuestions" },
  { label: "Ngày tạo", value: "startedAt" },
  { label: "Trạng thái", value: "status" },
];

/**
 * 3. Cấu hình thời gian mặc định (Default Configuration)
 * Dịch: Các hằng số mặc định cho việc khởi tạo đề thi.
 */
export const EXAM_GEN_DEFAULTS = {
  MIN_NAME_LENGTH: 5,
  DEFAULT_PAGE_SIZE: 10,
};
