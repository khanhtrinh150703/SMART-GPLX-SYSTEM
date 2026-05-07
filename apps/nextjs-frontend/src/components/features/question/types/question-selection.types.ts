/**
 * @description Interface dành riêng cho việc hiển thị và chọn câu hỏi trong Form Đề thi
 * (Domain-Specific Interface for Question Selection)
 */
export interface IQuestionForSelection {
  id: string;
  content: string;
  chapterName: string;
  isCritical: boolean;
  licenseCategoryNames: string[];
  
  // Bạn có thể thêm trường này để xử lý UI dễ hơn (Optional UI State)
  isSelected?: boolean; 
  
  // Thông tin độ khó để lọc nhanh (Metadata for quick filtering)
  difficultyLabel: string; 
}