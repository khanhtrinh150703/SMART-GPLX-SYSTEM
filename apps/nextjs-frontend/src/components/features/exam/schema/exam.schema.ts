import { z } from "zod";

export const manualExamSchema = z.object({
  name: z.string().min(5, "Tên đề thi phải có ít nhất 5 ký tự"),
  licenseCategoryId: z.string().min(1, "Vui lòng chọn hạng bằng lái"),
  examMatrixId: z.string().nullable().optional(),
  totalQuestions: z.number().min(1, "Tổng số câu hỏi không được trống"),
  passingScore: z.number().min(1, "Điểm đạt không được để trống"),
  durationMinutes: z.number().min(5, "Thời gian tối thiểu là 5 phút"),
  minCriticalQuestions: z.number().min(0),
  questionIds: z.array(z.string()),
}).refine((data) => data.questionIds.length === data.totalQuestions, {
  message: "Số lượng câu hỏi đã chọn phải bằng với tổng số câu cấu hình",
  path: ["questionIds"],
});