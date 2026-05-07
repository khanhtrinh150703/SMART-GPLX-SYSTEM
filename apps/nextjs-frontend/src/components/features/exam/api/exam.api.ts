import { StandardResponse } from "@/types/common.type";
import { PaginatedResult, QueryParams } from "@/types/paginaton.type";
import axiosClient from "@/services/axios-client";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import { IGenerateExamDTO } from "../types/exam-generation";
import { IExamResponse, ICreateManualExamDTO } from "../types/exam.types";


/**
 * Exam Management API Service
 * (Dịch vụ API quản lý Đề thi)
 */
export const examApi = {
  /**
   * Get list of exams with pagination and filters
   * (Lấy danh sách đề thi kèm phân trang và bộ lọc)
   */
  list: async (params: QueryParams): Promise<StandardResponse<PaginatedResult<IExamResponse>>> => {
    const response = await axiosClient.get<StandardResponse<PaginatedResult<IExamResponse>>>(
      ENDPOINTS.EXAM.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Generate exam automatically from matrix
   * (Khởi tạo bài thi tự động từ ma trận)
   */
  generateAuto: async (dto: IGenerateExamDTO): Promise<StandardResponse<IExamResponse>> => {
    const response = await axiosClient.post<StandardResponse<IExamResponse>>(
      `${ENDPOINTS.EXAM.AUTO}`,
      dto
    );
    return response.data;
  },

  /**
   * Create exam manually by specifying questions
   * (Khởi tạo bài thi thủ công bằng cách chỉ định câu hỏi)
   */
  createManual: async (dto: ICreateManualExamDTO): Promise<StandardResponse<IExamResponse>> => {
    const response = await axiosClient.post<StandardResponse<IExamResponse>>(
      `${ENDPOINTS.EXAM.MANUAL}`,
      dto
    );
    return response.data;
  },

  /**
   * Update exam information
   * (Cập nhật thông tin bài thi)
   */
  edit: async (id: string, data: Partial<ICreateManualExamDTO>): Promise<StandardResponse<IExamResponse>> => {
    const response = await axiosClient.patch<StandardResponse<IExamResponse>>(
      `${ENDPOINTS.EXAM.DETAILS(id)}`,
      data
    );
    return response.data;
  },

  /**
   * Soft delete an exam
   * (Xóa mềm một bài thi)
   */
  delete: async (id: string): Promise<StandardResponse<void>> => {
    const response = await axiosClient.delete<StandardResponse<void>>(
      `${ENDPOINTS.EXAM.DETAILS(id)}`,
    );
    return response.data;
  },

  /**
   * Restore a deleted exam
   * (Khôi phục bài thi đã xóa)
   */
  restore: async (id: string): Promise<StandardResponse<IExamResponse>> => {
    const response = await axiosClient.patch<StandardResponse<IExamResponse>>(
      `${ENDPOINTS.EXAM.RESTORE(id)}`,
    );
    return response.data;
  },
};