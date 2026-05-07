import * as z from "zod";

export const generateExamSchema = z.object({
  name: z.string().min(1, "Tên đề thi không được để trống").max(100),
  matrixId: z.string().min(1, "Vui lòng chọn ma trận đề thi"),
});

// Kiểu dữ liệu trích xuất từ schema (Type extracted from schema)
export type GenerateExamInput = z.infer<typeof generateExamSchema>;