import { Schema, model } from "mongoose";
import { IExamAttemptPersistence } from "@/infrastructure/persistence/exam-session/exam-attempt.record";

/**
 * @description Mongoose Schema (Cấu trúc dữ liệu) cho ExamAttempt.
 * Sử dụng Generic IExamAttemptPersistence để ép kiểu chặt chẽ (Zero-Any).
 */
const ExamAttemptSchema = new Schema<IExamAttemptPersistence>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    examId: { type: String, required: true },
    licenseCategoryId: { type: String, required: true, index: true },
    licenseCategoryName: { type: String, required: true },

    // Kết quả chi tiết
    score: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    wrongCount: { type: Number, required: true, default: 0 },
    skippedCount: { type: Number, required: true, default: 0 },
    totalQuestions: { type: Number, required: true },

    passingScore: { type: Number, required: true, default: 0 },
    isPassed: { type: Boolean, required: true },
    hasFailedCritical: { type: Boolean, required: true, default: false },

    durationSeconds: { type: Number, required: true },
    isAutoSubmit: { type: Boolean, required: true },
    submittedAt: { type: Date, required: true },

    // Snapshot (Chứa nội dung câu hỏi + đáp án + explanation)
    snapshot: {
      type: Schema.Types.Mixed,
      required: true,
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// 1. Index lịch sử cá nhân (Xem lại bài đã thi)
ExamAttemptSchema.index({ userId: 1, submittedAt: -1 });

// 2. Index Bảng xếp hạng (Leaderboard) - Tối ưu cho Query Service
// Lọc theo Hạng bằng -> Điểm cao nhất -> Thời gian ngắn nhất
ExamAttemptSchema.index({
  licenseCategoryId: 1,
  score: -1,
  durationSeconds: 1,
});

export const ExamAttemptModel = model<IExamAttemptPersistence>(
  "ExamAttempt",
  ExamAttemptSchema,
);
