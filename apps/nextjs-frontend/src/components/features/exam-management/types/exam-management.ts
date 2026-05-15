/**
 * @description Interface representing the request details for each chapter in the exam matrix.
 * (Giao diện đại diện cho các chi tiết yêu cầu đối với từng chương trong ma trận đề thi.)
 */
export interface IExamMatrixDetailRequest {
  chapterId: string;
  percentage: number;
}

/**
 * @description Interface representing the response details for each chapter in the exam matrix.
 * (Giao diện đại diện cho các chi tiết phản hồi đối với từng chương trong ma trận đề thi.)
 */
export interface IExamMatrixDetailResponse {
  chapterId: string;
  percentage: number;
}

/**
 * @description Interface for creating or updating an exam matrix.
 * (Giao diện để tạo hoặc cập nhật một ma trận đề thi.)
 */
export interface IExamMatrixRequest {
  licenseCategoryId: string;
  totalQuestions: number;
  passingScore: number;
  name: string;
  durationMinutes: number;
  minCriticalQuestions: number;
  isDefault: boolean;
  isChapter: boolean;
  details: IExamMatrixDetailRequest[];
}
/**
 * @description Interface đại diện cho chi tiết phản hồi đối với từng chương.
 */
export interface IExamMatrixDetailResponse {
  chapterId: string;
  percentage: number;
  chapterName?: string;
}

/**
 * @description Interface cho dữ liệu ma trận đề thi từ Database/Service.
 * Đã bổ sung 'status' và 'deletedAt' để thỏa mãn TableColumnFactory.
 */
export interface IExamMatrixResponse {
  id: string;
  licenseCategoryId: string;
  licenseCategoryName?: string; 
  totalQuestions: number;
  passingScore: number;
  name: string;
  isChapter: boolean;
  durationMinutes: number;
  minCriticalQuestions: number;
  isDefault: boolean;
  details: IExamMatrixDetailResponse[];

  /** * @description Trạng thái hoạt động - BẮT BUỘC để TableColumnFactory hoạt động.
   */
  status: "active" | "inactive" | "draft" | string;

  /**
   * @description Ngày xóa - Dùng để xác định hiển thị nút 'Xóa' hay 'Khôi phục'.
   */
  deletedAt?: string | Date | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

