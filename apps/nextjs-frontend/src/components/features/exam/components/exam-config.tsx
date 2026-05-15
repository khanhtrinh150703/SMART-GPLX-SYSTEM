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
    color: "bg-slate-500 shadow-lg shadow-slate-200/60",
  },
  {
    id: ExamStatus.ACTIVE,
    label: "Đang hoạt động",
    color: "bg-emerald-500 shadow-lg shadow-emerald-200/50",
  },
  {
    id: ExamStatus.DRAFT,
    label: "Bản nháp",
    // Hợp lý! Amber (Vàng hổ phách) cho thấy trạng thái đang soạn thảo, cần chú ý
    color: "bg-amber-500 shadow-lg shadow-amber-200/50",
  },
  {
    id: ExamStatus.DELETED,
    label: "Đã xóa",
    color: "bg-rose-500 shadow-lg shadow-rose-200/50",
  },
];
/**
 * 2. Cấu hình các trường lọc Đề thi (Exam Filter Fields Configuration)
 * Dịch: Các tiêu chí hỗ trợ tìm kiếm và truy vấn đề thi.
 */
export const EXAM_FILTER_FIELDS = [
  { label: "Tên đề thi", value: "name" },
  { label: "Hạng GPLX", value: "licenseCategoryName" },
  { label: "Tổng số câu", value: "totalQuestions" },
  { label: "Điểm đạt", value: "passingScore" },
  { label: "Thời gian", value: "durationMinutes" },
  { label: "Câu điểm liệt", value: "minCriticalQuestions" },
  { label: "Người Tạo", value: "fullName" },
  // { label: "Ngày tạo", value: "startedAt" },
  // { label: "Trạng thái", value: "status" },
];

/**
 * 3. Cấu hình thời gian mặc định (Default Configuration)
 * Dịch: Các hằng số mặc định cho việc khởi tạo đề thi.
 */
export const EXAM_GEN_DEFAULTS = {
  MIN_NAME_LENGTH: 5,
  DEFAULT_PAGE_SIZE: 10,
};
