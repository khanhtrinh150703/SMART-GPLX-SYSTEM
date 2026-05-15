// src/features/exam-management/schema/exam-matrix.schema.ts
import { z } from "zod";

export const examMatrixDetailSchema = z.object({
  chapterId: z.string().min(1, "Vui lòng chọn chương"),
  percentage: z
    .number()
    .min(1, "Tỉ trọng phải lớn hơn 0%")
    .max(100, "Tỉ trọng tối đa 100%"),
});

export const examMatrixSchema = z
  .object({
    licenseCategoryId: z.string().min(1, "Vui lòng chọn hạng bằng"),
    name: z.string().min(5, "Tên ma trận tối thiểu 5 ký tự"),
    totalQuestions: z.number().min(1, "Tổng số câu phải lớn hơn 0"),
    passingScore: z.number().min(1, "Điểm đạt phải lớn hơn 0"),
    durationMinutes: z.number().min(1, "Thời gian làm bài không được để trống"),
    minCriticalQuestions: z.number().min(0, "Số câu điểm liệt không được âm"),
    isDefault: z.boolean(),
    isChapter: z.boolean(),
    details: z
      .array(examMatrixDetailSchema)
      .min(1, "Cần ít nhất một chương")
      .refine(
        (items) => {
          const ids = items.map((i) => i.chapterId).filter(Boolean);
          return new Set(ids).size === ids.length;
        },
        { message: "Không được chọn trùng chương học", path: ["root"] },
      ),
  })
  .refine((data) => data.passingScore <= data.totalQuestions, {
    message: "Điểm đạt không được lớn hơn tổng số câu hỏi",
    path: ["passingScore"],
  })
  .refine((data) => data.minCriticalQuestions <= data.totalQuestions, {
    message: "Số câu điểm liệt không được vượt quá tổng số câu",
    path: ["minCriticalQuestions"],
  })
  .refine(
    (data) => {
      const total = data.details.reduce(
        (sum, item) => sum + item.percentage,
        0,
      );
      return total === 100;
    },
    {
      message: "Tổng tỉ trọng các chương phải bằng chính xác 100%",
      path: ["details"],
    },
  );

export type ExamMatrixFormValues = z.input<typeof examMatrixSchema>;
