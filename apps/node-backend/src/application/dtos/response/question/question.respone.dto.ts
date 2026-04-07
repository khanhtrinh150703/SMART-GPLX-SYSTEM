/**
 * @interface AnswerResponseDto
 * @description Dữ liệu chi tiết của một đáp án (lựa chọn) trả về cho Client.
 * (Detailed data of an answer option returned to the Client)
 */
export interface AnswerResponseDto {
  /** @property {string} id - Mã định danh duy nhất của đáp án (UUID). */
  id: string;

  /** @property {string} content - Nội dung văn bản của đáp án. */
  content: string;

  /** @property {boolean} isCorrect - Đánh dấu đây có phải là đáp án đúng hay không. */
  isCorrect: boolean;

  /** @property {string | null} imageUrl - Đường dẫn hình ảnh minh họa cho đáp án (nếu có). */
  imageUrl: string | null;
}

/**
 * @interface QuestionResponseDto
 * @description Dữ liệu câu hỏi đầy đủ trả về cho Client, đảm bảo sạch và an toàn.
 * (Full question data returned to the Client, ensuring clean and safe structure)
 */
export interface QuestionResponseDto {
  /** @property {string} id - Mã định danh duy nhất của câu hỏi (UUID). */
  id: string;

  /** @property {string} chapterId - ID của chương học chứa câu hỏi này. */
  chapterId: string;

  /** @property {string} content - Nội dung câu hỏi dùng để hiển thị. */
  content: string;

  /** @property {string | null} imageUrl - Đường dẫn hình ảnh minh họa tình huống giao thông (nếu có). */
  imageUrl: string | null;

  /** @property {boolean} isCritical - Đánh dấu đây có phải là "Câu điểm liệt" hay không. */
  isCritical: boolean;

  /** * @property {object} difficulty - Cấu trúc phân loại mức độ khó của câu hỏi.
   * @property {number} difficulty.level - Cấp độ số (VD: 1, 2, 3).
   * @property {string} difficulty.label - Nhãn hiển thị (VD: 'Dễ', 'Trung bình', 'Khó').
   */
  difficulty: {
    level: number; 
    label: string; 
  };

  /** @property {AnswerResponseDto[]} answers - Danh sách các lựa chọn đáp án đi kèm. */
  answers: AnswerResponseDto[];

  /** @property {string[]} licenseCategoryIds - Danh sách ID các hạng bằng lái áp dụng câu hỏi này (VD: B1, B2). */
  licenseCategoryIds: string[];
}