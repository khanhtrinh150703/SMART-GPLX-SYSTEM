import { StandardResponse } from "@/types/common.type";
import axiosClient from "@/services/axios-client";
import {
  IExamMatrixRequest,
  IExamMatrixResponse,
} from "../types/exam-management";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import { PaginatedResult, QueryParams } from "@/types/paginaton.type";
import { DeleteResponse } from "@/types/respone/delete.common";

/**
 * @description API class for Exam Matrix operations.
 * (Lớp API cho các hoạt động của Ma trận đề thi.)
 */
export const examMatrixApi = {
  /** * @description Get the list of all exam matrices.
   * (Lấy danh sách tất cả các ma trận đề thi.)
   * @param params - Pagination, search, and filter parameters.
   * (Các tham số phân trang, tìm kiếm và bộ lọc.)
   */
  getAll: async (
    params: QueryParams,
  ): Promise<StandardResponse<PaginatedResult<IExamMatrixResponse>>> => {
    const response = await axiosClient.get(ENDPOINTS.EXAM_MATRICES.BASE, {
      params,
    });
    return response.data;
  },

  /**
   * @description Create a new exam matrix.
   * (Tạo một ma trận đề thi mới.)
   */
  create: async (
    data: IExamMatrixRequest,
  ): Promise<StandardResponse<string>> => {
    const response = await axiosClient.post(ENDPOINTS.EXAM_MATRICES.BASE, data);
    return response.data;
  },

  /**
   * @description Get an exam matrix by its ID.
   * (Lấy thông tin ma trận đề thi theo ID.)
   */
  getById: async (
    id: string,
  ): Promise<StandardResponse<IExamMatrixResponse>> => {
    const response = await axiosClient.get(ENDPOINTS.EXAM_MATRICES.DETAILS(id));
    return response.data;
  },

  /**
   * @description Update an existing exam matrix.
   * (Cập nhật một ma trận đề thi hiện có.)
   */
  update: async (
    id: string,
    data: IExamMatrixRequest,
  ): Promise<StandardResponse<void>> => {
    const response = await axiosClient.put(
      ENDPOINTS.EXAM_MATRICES.DETAILS(id),
      data,
    );
    return response.data;
  },

  /**
   * @description Delete an exam matrix (Hard or Soft delete).
   * (Xóa một ma trận đề thi - Xóa cứng hoặc xóa mềm.)
   */
  delete: async (id: string): Promise<StandardResponse<DeleteResponse>> => {
    const response = await axiosClient.delete<StandardResponse<DeleteResponse>>(
      ENDPOINTS.EXAM_MATRICES.DETAILS(id),
    );
    return response.data;
  },
  /**
   * @description Restore a previously deleted exam matrix.
   * (Khôi phục một ma trận đề thi đã bị xóa trước đó.)
   */
  restore: async (id: string): Promise<StandardResponse<void>> => {
    const response = await axiosClient.patch(
      ENDPOINTS.EXAM_MATRICES.RESTORE(id),
    );
    return response.data;
  },
};
