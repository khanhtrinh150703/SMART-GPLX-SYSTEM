// src/features/history/services/history.service.ts

import { historyApi } from "../api/history.api";
import { StandardResponse } from "@/types/common.type";
import { PaginatedResult } from "@/types/paginaton.type";
import {
  IExamHistorySummary,
  HistoryQueryParams,
} from "../types/history.types";
import { IExamUserResultResponseDTO } from "../../gplx-test/types/exam-result.types";

/**
 * Lớp Xử lý Nghiệp vụ (Business Logic Layer) cho module Lịch sử thi.
 * (Business Logic Layer for Exam History module)
 */
export const historyService = {
  /**
   * Lấy danh sách lịch sử thi có phân trang và bộ lọc.
   * (Get paginated exam history list with filters)
   * 
   * @param params - Tham số truy vấn bao gồm trang, số lượng và bộ lọc.
   * @returns Promise chứa danh sách tóm tắt lịch sử thi.
   */
  getAllHistories: async (
    params: HistoryQueryParams
  ): Promise<StandardResponse<PaginatedResult<IExamHistorySummary>>> => {
    /**
     * Luồng thực thi: Gọi trực tiếp API và trả về dữ liệu cho UI xử lý.
     * (Execution flow: Call API directly and return data for UI handling)
     */
    const response = await historyApi.getAll(params);
    
    return response;
  },

  /**
   * Lấy chi tiết nội dung một bài thi đã thực hiện trong quá khứ.
   * (Get full content of a previously taken exam)
   * 
   * @param id - Mã định danh của bản ghi lịch sử.
   * @returns Promise chứa toàn bộ nội dung bài thi (Câu hỏi, câu trả lời, kết quả).
   */
  getHistoryDetail: async (
    id: string
  ): Promise<StandardResponse<IExamUserResultResponseDTO>> => {
    /**
     * Lưu ý: UI sẽ chịu trách nhiệm bắt lỗi (try/catch) để hiển thị thông báo.
     * (Note: UI will be responsible for error handling to display notifications)
     */
    const response = await historyApi.getById(id);

    return response;
  },
};