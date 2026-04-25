import { IExamAttemptPersistence } from '@/infrastructure/persistence/exam-session/exam-attempt.record';
import { Schema, model } from 'mongoose';

/**
 * @description Mongoose Schema cho ExamAttempt.
 * Sử dụng Generic IExamAttemptPersistence để ép kiểu chặt chẽ.
 */
const ExamAttemptSchema = new Schema<IExamAttemptPersistence>(
  {
    // Chúng ta thủ công định nghĩa _id là String để chứa UUID
    _id: { 
      type: String, 
      required: true 
    },
    userId: { 
      type: String, 
      required: true, 
      index: true // Đánh index để query lịch sử cực nhanh
    },
    examId: { 
      type: String, 
      required: true 
    },
    score: { 
      type: Number, 
      required: true 
    },
    correctCount: { 
      type: Number, 
      required: true 
    },
    isPassed: { 
      type: Boolean, 
      required: true 
    },
    durationSeconds: { 
      type: Number, 
      required: true 
    },
    submittedAt: { 
      type: Date, 
      required: true 
    },
    
    // Snapshot lưu dạng Mixed vì nó là Deep Object (nhiều cấp)
    snapshot: { 
      type: Schema.Types.Mixed, 
      required: true 
    },

    // Quản lý thủ công timestamps để khớp với Domain BaseEntity
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  { 
    // KHÔNG để _id: false ở đây vì đây là Document chính.
    timestamps: false, 
    versionKey: false,
    // Tự động chuyển _id thành id khi .toJSON() nếu ông muốn dùng ở Frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Tạo Index phức hợp nếu sau này ông muốn query theo User + Ngày tháng
ExamAttemptSchema.index({ userId: 1, submittedAt: -1 });

export const ExamAttemptModel = model<IExamAttemptPersistence>('ExamAttempt', ExamAttemptSchema);