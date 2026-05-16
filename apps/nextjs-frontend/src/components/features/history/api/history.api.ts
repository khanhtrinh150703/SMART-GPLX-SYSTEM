import axiosClient from "@/services/axios-client";
import { StandardResponse } from "@/types/common.type";
import { PaginatedResult } from "@/types/paginaton.type";
import {
  IExamHistorySummary,
  HistoryQueryParams,
} from "../types/history.types";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import { IExamUserResultResponseDTO } from "../../gplx-test/types/exam-result.types";

/**
 * Các phương thức gọi API liên quan đến Lịch sử thi.
 * (API methods related to Exam History)
 */
export const historyApi = {
  /**
   * Lấy danh sách lịch sử thi có phân trang và bộ lọc.
   * (Fetch exam history list with pagination and filters)
   */
  getAll: async (
    params: HistoryQueryParams,
  ): Promise<StandardResponse<PaginatedResult<IExamHistorySummary>>> => {
    const response = await axiosClient.get<
      StandardResponse<PaginatedResult<IExamHistorySummary>>
    >(ENDPOINTS.HISTORY.SUMMARY, { params });
    return response.data;
  },

  /**
   * @param id - Mã định danh của bản ghi lịch sử (The unique ID of the history record)
   * @returns {Promise<StandardResponse<IExamUserResultResponseDTO>>} - Phản hồi tiêu chuẩn chứa chi tiết lịch sử bài thi
   */
  getById: async (
    id: string,
  ): Promise<StandardResponse<IExamUserResultResponseDTO>> => {
    // Sử dụng Template Literals (Cú pháp nối chuỗi bằng dấu backtick) để truyền ID vào URL
    const response = await axiosClient.get<
      StandardResponse<IExamUserResultResponseDTO>
    >(`${ENDPOINTS.HISTORY.BASE}/${id}`);

    // Trả về dữ liệu phản hồi (Return response data)
    return response.data;
  },
};
