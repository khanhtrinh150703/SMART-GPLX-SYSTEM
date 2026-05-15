import { z } from "zod";
import { ExamStatus } from "../types/enums";

export const manualExamSchema = z
  .object({
    name: z.string().min(1, "Tên đề thi không được để trống"),
    licenseCategoryId: z.string().min(1, "Vui lòng chọn hạng bằng lái"),
    examMatrixId: z.string().nullable().optional(),
    totalQuestions: z.number().min(1, "Tổng số câu phải lớn hơn 0"),
    passingScore: z.number().min(1, "Điểm đạt phải lớn hơn 0"),
    isEdited: z.boolean().optional(),
    isChapter: z.boolean().optional(),
    durationMinutes: z.number().min(5, "Thời gian tối thiểu là 5 phút"),
    minCriticalQuestions: z.number().min(0, "Số câu điểm liệt không được âm"),
    questionIds: z.array(z.string()),
    status: z.enum(ExamStatus, {}),
  })
  .superRefine((data, ctx) => {
    // 1. Case: Điểm đạt > Tổng số câu (Logic phi vật lý)
    if (data.passingScore > data.totalQuestions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Điểm đạt (${data.passingScore}) không thể lớn hơn tổng số câu (${data.totalQuestions})`,
        path: ["passingScore"], // Hiện lỗi đỏ ngay ô Điểm đạt
      });
    }

    // 2. Case: Số câu điểm liệt > Tổng số câu
    if (data.minCriticalQuestions > data.totalQuestions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Số câu điểm liệt không được vượt quá tổng số câu",
        path: ["minCriticalQuestions"],
      });
    }

    // 3. Case: Số lượng câu đã chọn lệch với cấu hình (Cái má đang làm)
    if (data.questionIds.length !== data.totalQuestions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Danh sách đã chọn (${data.questionIds.length}) chưa khớp với cấu hình (${data.totalQuestions} câu)`,
        path: ["questionIds"],
      });
    }
  });
