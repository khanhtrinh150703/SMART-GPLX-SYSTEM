// Giả định bạn đã có enum QuestionStatus trong types
// import { QuestionStatus } from "../../types/enums";

export const QUESTION_STATUS_OPTIONS = [
  {
    value: "DRAFT", // Hoặc QuestionStatus.DRAFT
    label: "Bản nháp",
    icon: "📝",
    color: "text-slate-500",
  },
  {
    value: "ACTIVE", // Hoặc QuestionStatus.ACTIVE
    label: "Kích hoạt",
    icon: "🚀",
    color: "text-emerald-600",
  },
];