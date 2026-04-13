import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const answerSchema = z.object({
  content: z.string().min(1, "Nội dung đáp án là bắt buộc (Answer content is required)"),
  isCorrect: z.boolean(),
  imageFile: z.instanceof(File).optional().nullable(),
});

export const questionFormSchema = z.object({
  content: z.string().min(10, "Nội dung câu hỏi phải từ 10 ký tự (Min 10 chars)"),
  chapterId: z.string().uuid("Vui lòng chọn chủ đề (Please select a chapter)"),
  licenseCategoryIds: z.array(z.string()).min(1, "Chọn ít nhất 1 hạng bằng"),

  // XÓA .default() Ở ĐÂY. Ép kiểu chuẩn là number và boolean
  difficultyLevel: z.number(),
  isCritical: z.boolean(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  
  imageFile: z
    .instanceof(File, { message: "Vui lòng chọn một file hợp lệ" })
    .optional()
    .nullable()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Kích thước ảnh tối đa 5MB")
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Chỉ chấp nhận định dạng .jpg, .jpeg, .png"
    ),

  answers: z.array(answerSchema)
    .min(2, "Phải có ít nhất 2 đáp án")
    .max(6, "Tối đa 6 đáp án")
    .refine((ans) => ans.filter(a => a.isCorrect).length === 1, {
      message: "Phải chọn duy nhất 1 đáp án đúng",
    }),
});

// 1. Mở rộng Answer Schema cho Edit
// (Extend Answer Schema for Edit)
const editAnswerSchema = answerSchema.extend({
  id: z.string().optional(), // ID của đáp án cũ (nếu có)
  existingImageUrl: z.string().optional().nullable(), // URL ảnh đang có trên server
});

// 2. Mở rộng Question Schema cho Edit
// (Extend Question Schema for Edit)
export const editQuestionFormSchema = questionFormSchema.extend({
  id: z.string(), // ID câu hỏi bắt buộc khi edit
  existingImageUrl: z.string().optional().nullable(),
  answers: z.array(editAnswerSchema)
    .min(2, "Phải có ít nhất 2 đáp án")
    .max(6, "Tối đa 6 đáp án")
    .refine((ans) => ans.filter(a => a.isCorrect).length === 1, {
      message: "Phải chọn duy nhất 1 đáp án đúng",
    }),
});

// Kiểu dữ liệu giờ đây đã sạch bong, không còn độ trễ giữa Input/Output
export type QuestionFormValues = z.infer<typeof questionFormSchema>;
export type EditQuestionFormValues = z.infer<typeof editQuestionFormSchema>;
