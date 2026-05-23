import { StandardResponse } from "@/types/common.type";
import { examApi } from "../api/exam.api";
import { IExamResponse, ICreateManualExamDTO } from "../types/exam.types";
import { PaginatedResult, QueryParams } from "@/types/paginaton.type";

/**
 * Exam Service Layer (Fixed Typing)
 * (Lớp dịch vụ Đề thi - Đã sửa lỗi kiểu dữ liệu)
 */
export const examService = {
  /**
   * (Lấy danh sách tất cả các đề thi)
   */
  getAll: async (
    params: QueryParams,
  ): Promise<StandardResponse<PaginatedResult<IExamResponse>>> => {
    const response = await examApi.list(params);
    // Early Return nếu không có dữ liệu (Data Safety)
    if (!response.data) {
      throw new Error("Không thể tải danh sách đề thi (Cannot load exam list)");
    }
    return response;
  },

  /**
   * (Khởi tạo thủ công với an toàn kiểu dữ liệu)
   */
  createManual: async (dto: ICreateManualExamDTO): Promise<IExamResponse> => {
    const response = await examApi.createManual(dto);

    // Kiểm tra tính tồn tại của data để thỏa mãn kiểu trả về IExamResponse
    if (!response.data) {
      throw new Error("Khởi tạo đề thi thất bại ");
    }

    return response.data;
  },

  /**
   * (Cập nhật với an toàn kiểu dữ liệu)
   */
  update: async (
    id: string,
    data: Partial<ICreateManualExamDTO>,
  ): Promise<IExamResponse> => {
    const response = await examApi.edit(id, data);
    if (!response.data) {
      throw new Error("Cập nhật đề thi thất bại ");
    }

    return response.data;
  },

  /**
   * (Khôi phục với an toàn kiểu dữ liệu)
   */
  restore: async (id: string): Promise<IExamResponse> => {
    const response = await examApi.restore(id);

    if (!response.data) {
      throw new Error("Khôi phục đề thi thất bại ");
    }

    return response.data;
  },

  /**
   * (Xóa mềm một đề thi với an toàn kiểu dữ liệu)
   * @param id - Exam ID to delete (ID đề thi cần xóa)
   */
  delete: async (id: string): Promise<void> => {
    const response = await examApi.delete(id);

    /**
     * Đối với tác vụ xóa (void), ta kiểm tra tính thành công qua flag 'success'.
     */
    if (!response.success) {
      throw new Error("Xóa đề thi thất bại ");
    }
  },

  /**
   * Parallel utility fixed
   */
  getExamWithMetadata: async (id: string) => {
    const [examDetails, otherStats] = await Promise.all([
      examApi.list({ id }),
      examApi.list({ status: "published" }),
    ]);

    // Bảo vệ dữ liệu trước khi truy cập thuộc tính (Data Guarding)
    if (!examDetails.data || !otherStats.data) {
      throw new Error("Dữ liệu phản hồi không đầy đủ");
    }

    return {
      details: examDetails.data,
      stats: otherStats.data,
    };
  },
};
