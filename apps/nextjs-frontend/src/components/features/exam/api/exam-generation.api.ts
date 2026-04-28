import { StandardResponse } from "@/types/common.type";
import { IGenerateExamDTO, IExamResponse } from "../types/exam-generation";
import axiosClient from "@/services/axios-client";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import { PaginatedResult, QueryParams } from "@/types/paginaton.type";

export const examGenerationApi = {
  // Hàm gọi API sinh đề tự động (API call to generate automatic exam)
  generateAuto: async (dto: IGenerateExamDTO): Promise<StandardResponse<IExamResponse>> => {
    const response = await axiosClient.post<StandardResponse<IExamResponse>>(
      ENDPOINTS.EXAM.GENERATION,
      dto
    );
    return response.data;
  },

  /** * @description Get the list of all exam matrices.
   * (Lấy danh sách tất cả các ma trận đề thi.)
   * @param params - Pagination, search, and filter parameters.
   * (Các tham số phân trang, tìm kiếm và bộ lọc.)
   */
  getAll: async (params: QueryParams): Promise<StandardResponse<PaginatedResult<IExamResponse>>> => {
    const response = await axiosClient.get(ENDPOINTS.EXAM.BASE, { params });
    return response.data;
  },

};