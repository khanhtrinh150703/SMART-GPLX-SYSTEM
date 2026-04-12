import axiosClient from "@/services/axios-client";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import { StandardResponse } from "@/types/common.type";
import { PaginatedResult, QueryParams } from "@/types/paginaton.type";
import { Question } from "../types/question.types";
import { da } from "zod/v4/locales";

/**
 * Question API: Quản lý nghiệp vụ câu hỏi (Lý thuyết GPLX).
 * (Question API: Manage question business logic)
 */
export const questionApi = {
  /**
   * Lấy danh sách câu hỏi có phân trang và bộ lọc.
   * (Fetch questions list with pagination and filters)
   */
  getAll: async (params: QueryParams): Promise<StandardResponse<PaginatedResult<Question>>> => {
    const response = await axiosClient.get<StandardResponse<PaginatedResult<Question>>>(
      ENDPOINTS.QUESTION.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết của một câu hỏi theo ID.
   * (Fetch detailed information of a question by ID)
   */
  getById: async (id: string): Promise<StandardResponse<Question>> => {
    const response = await axiosClient.get<StandardResponse<Question>>(
      `${ENDPOINTS.QUESTION.BASE}/${id}`
    );
    return response.data;
  },

  /**
   * Tạo mới câu hỏi (Hỗ trợ upload hình ảnh qua FormData).
   * (Create a new question - Supports image upload via FormData)
   */
  create: async (data: FormData): Promise<StandardResponse<Question>> => {
    const response = await axiosClient.post<StandardResponse<Question>>(
      ENDPOINTS.QUESTION.BASE,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * Cập nhật câu hỏi (Smart Update - Thay thế toàn bộ hoặc một phần).
   * (Update question - Smart Update)
   */
  update: async (id: string, data: FormData): Promise<StandardResponse<Question>> => {
    const response = await axiosClient.put<StandardResponse<Question>>(
      `${ENDPOINTS.QUESTION.BASE}/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * Xóa mềm câu hỏi (Chuyển trạng thái is_active = false).
   * (Soft delete question - Change status to inactive)
   */
  delete: async (id: string): Promise<StandardResponse<void>> => {
    const response = await axiosClient.delete<StandardResponse<void>>(
      `${ENDPOINTS.QUESTION.BASE}/${id}`
    );
    return response.data;
  },

  /**
   * Khôi phục câu hỏi đã bị xóa mềm.
   * (Restore a soft-deleted question)
   */
  restore: async (id: string): Promise<StandardResponse<Question>> => {
    const response = await axiosClient.patch<StandardResponse<Question>>(
      `${ENDPOINTS.QUESTION.BASE}/${id}/restore`
    );
    return response.data;
  },
};