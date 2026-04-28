import { IActiveSessionPersistence } from '@/infrastructure/persistence/exam-session/active-session.record';
import { Schema, model } from 'mongoose';

/**
 * @description Định nghĩa lược đồ cho từng câu trả lời trong phiên nháp.
 */
const ActiveSessionAnswerSchema = new Schema({
  questionId: { type: String, required: true },
  selectedAnswerId: { type: String, default: null },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false }); // Không cần sinh _id riêng cho từng item trong mảng

/**
 * @description Lược đồ chính cho Phiên làm bài (ActiveSession).
 * Gắn chặt với Interface Persistence để đảm bảo 'Zero Any'.
 */
const ActiveSessionSchema = new Schema<IActiveSessionPersistence>({
  _id: { type: String, required: true }, // Sử dụng UUID từ Entity làm _id
  userId: { type: String, required: true, index: true }, // Đánh index để query theo User cực nhanh
  examId: { type: String, required: true },
  currentAnswers: { type: [ActiveSessionAnswerSchema], default: [] },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
}, {
  versionKey: false, // Loại bỏ trường __v của Mongoose
  timestamps: false  // Chúng ta tự quản lý createdAt/updatedAt từ Entity
});

/**
 * @description Tạo Model từ Schema. 
 * Đây chính là đối tượng mà Repository sẽ gọi để tương tác với DB.
 */
export const ActiveSessionModel = model<IActiveSessionPersistence>('ActiveSession', ActiveSessionSchema);