// src/domain/entities/question/import-question.props.ts

import { IBaseProps } from "@/domain/seedwork/entity.base";

/**
 * @description Interface đại diện cho cấu trúc một đáp án trong quá trình Import.
 */
export interface IImportAnswer {
  /** Nội dung văn bản của đáp án */
  text: string;
  /** Đường dẫn vật lý đầy đủ đến ảnh của đáp án (nếu có) */
  image?: string;
  /** Đánh dấu đây có phải là đáp án đúng hay không */
  isCorrect: boolean;
}

/**
 * @description Props dành cho thực thể Question trong ngữ cảnh Import.
 * Đã được chuẩn hóa từ dữ liệu thô (Raw) của Excel.
 */
export interface IImportQuestionProps extends IBaseProps {
  /** Số thứ tự câu hỏi trong bộ đề (Dùng để đối soát lỗi) */
  indexNumber: number;
  /** Nội dung câu hỏi */
  content: string;
  /** ID của chương (Chapter) - Đã được resolve từ hệ thống */
  chapterId: string;
  /** Danh sách ID các hạng mục bằng lái (A1, A2, B1...) */
  licenseCategoryIds: string[];
  /** Mức độ khó (1: Cơ bản, 2: Nâng cao...) */
  difficultyLevel: number;
  /** Đánh dấu câu hỏi điểm liệt */
  isCritical: boolean;
  /** Đường dẫn vật lý đầy đủ đến ảnh minh họa của câu hỏi */
  questionImage?: string;
  /** Danh sách các đáp án đi kèm */
  answers: IImportAnswer[];
  /** Chỉ mục của đáp án đúng (Dùng để map logic hoặc re-check) */
  correctAnswerIndex: number;
  /** Nội dung giải thích hoặc mẹo ghi nhớ (Dạng nháp/thô) */
  aiExplainDraft?: string;
}

export type CreateImportQuestionProps = Omit<IImportQuestionProps, 
  | 'id' 
  | 'createdAt' 
  | 'updatedAt' 
  | 'deletedAt'
>;