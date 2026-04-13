/**
 * Question: Interface phản hồi từ API (Dựa trên JSON thực tế)
 * (Question: API Response interface based on actual JSON)
 */
/**
 * Question: Interface phản hồi từ API sau khi đã đồng bộ hóa dữ liệu mới
 * (Question: Synchronized API Response interface)
 */
export interface Question {
  id: string;
  chapterId: string;
  
  // Tên chương học được trả về kèm theo để hiển thị nhanh
  // (Chapter name returned for direct display)
  chapterName: string; 

  content: string;
  imageUrl: string | null;
  isCritical: boolean;

  // difficulty: Cấu trúc độ khó dạng Object (Difficulty object structure)
  difficulty: {
    level: number;
    label: string;
  };

  answers: {
    id: string;
    content: string;
    isCorrect: boolean;
    imageUrl: string | null;
  }[];

  licenseCategoryIds: string[];
  
  // Danh sách tên hạng bằng (ví dụ: ["A1", "B2"]) để hiển thị Badge
  // (List of license names for Badge display)
  licenseCategoryNames: string[]; 

  /** * status: Trạng thái vòng đời của nội dung (Content lifecycle status)
   */
  status: 'active' | 'draft' | 'deleted'; 

  // Mốc thời gian xóa mềm (Soft delete timestamp)
  deletedAt: string | Date | null; 
  
  // Mốc thời gian tạo (Creation timestamp)
  createdAt: string | Date;
}

/**
 * IAnswerPayload: Cấu trúc đáp án gửi trong chuỗi JSON
 * (Structure of an answer option within the JSON string)
 */
export interface IAnswerPayload {
  content: string;
  isCorrect: boolean;
  imageIndex?: number; // Chỉ số để ánh xạ tới file trong mảng answerImages
}

// Payload mở rộng dành riêng cho việc cập nhật đáp án 
// (Extended payload specifically for updating answers)
export interface IEditAnswerPayload extends IAnswerPayload {
  id?: string; // ID của đáp án (nếu là đáp án cũ cần cập nhật)
  isImageDeleted?: boolean; // Cờ báo hiệu Backend cần xóa ảnh cũ (Flag to notify Backend to delete old image)
}