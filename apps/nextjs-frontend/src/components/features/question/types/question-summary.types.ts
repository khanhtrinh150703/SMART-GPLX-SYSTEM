/**
 * @description Cấu trúc rút gọn của câu hỏi dùng cho việc lập đề thi (Summary for Exam Selection)
 */
export interface IExamQuestionSummary {
  /** @property ID duy nhất của câu hỏi */
  id: string;

  /** @property Nội dung câu hỏi (chỉ lấy text) */
  content: string;

  /** @property Tên chương học để hiển thị Header/Group */
  chapterName: string;

  /** @property Đánh dấu câu điểm liệt để kiểm tra quy tắc Snapshot */
  isCritical: boolean;

  /** @property Danh sách tên hạng bằng (ví dụ: ["A1", "B2"]) để hiển thị Badge */
  licenseCategoryNames: string[];

  /** @property Số thứ tự câu hỏi trong hệ thống */
  indexNumber: number;

  /** @property Nhãn độ khó hiển thị nhanh (ví dụ: "Trung bình") */
  difficultyLabel: string;
}