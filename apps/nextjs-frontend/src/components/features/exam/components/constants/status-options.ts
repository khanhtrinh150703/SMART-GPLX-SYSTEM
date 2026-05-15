import { ExamStatus } from "../../types/enums";

export const EXAM_STATUS_OPTIONS = [
  {
    value: ExamStatus.DRAFT,
    label: "Bản nháp",
    icon: "📄",
    color: "text-slate-500",
  },
  {
    value: ExamStatus.ACTIVE,
    label: "Hoạt động",
    icon: "🟢",
    color: "text-emerald-600",
  },
  // {
  //   value: ExamStatus.ARCHIVED,
  //   label: "Lưu trữ",
  //   icon: "📁",
  //   color: "text-amber-600",
  // },
  // {
  //   value: ExamStatus.DELETED,
  //   label: "Đã xóa",
  //   icon: "🗑️",
  //   color: "text-rose-600",
  // },
];
