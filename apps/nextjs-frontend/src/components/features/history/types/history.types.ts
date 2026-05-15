/**
 * Định nghĩa các kiểu dữ liệu cho tính năng Lịch sử & Thống kê.
 * (Type definitions for History & Statistics features)
 */

import { QueryParams } from "@/types/paginaton.type";

export interface IExamHistorySummary {
  examName: string; // Tên đề thi (ví dụ: "Đề thi hạng A1")
  score: number; // Điểm số đạt được
  totalQuestions: number; // Tổng số câu hỏi trong đề
  licenseCategoryName: string;
  isPassed: boolean; // Kết quả: Đạt hay Trượt
  snapshotId: string; // ID để truy xuất chi tiết bài thi
  createdAt: Date | string; // Thời gian làm bài
  durationSeconds: number; // Thời gian hoàn thành (giây)
}

/**
 * Tham số truy vấn đã cập nhật bộ lọc thời gian tùy chỉnh.
 */
export interface HistoryQueryParams extends QueryParams {
  // Bộ lọc tìm kiếm & Trạng thái (Search & Status Filters)
  search?: string;

  // Lọc theo thời gian (Date Range Filters)
  startDate?: string;
  endDate?: string;

  // --- CÁC TRƯỜNG BỔ SUNG MỚI (NEWLY ADDED FIELDS) ---

  /** Tên hạng bằng lái (ví dụ: A1, B2, C) */
  licenseCategoryName?: string;

  /** Điểm số bài thi */
  score?: number;

  /** Tiêu đề/Tên bài thi */
  title?: string;

  /** Thời gian làm bài (đơn vị: Giây) */
  durationTime?: number;
}
