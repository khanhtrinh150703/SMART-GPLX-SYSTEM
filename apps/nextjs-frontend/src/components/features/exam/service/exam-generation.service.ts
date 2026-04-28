import { QueryParams } from "@/types/paginaton.type";
import { examGenerationApi } from "../api/exam-generation.api";
import { IGenerateExamDTO } from "../types/exam-generation";

/**
 * Exam Generation Service: Xử lý logic nghiệp vụ cho việc sinh đề và quản lý danh sách đề thi.
 * (Exam Generation Service: Handle business logic for generating and managing exams)
 */
export const examGenService = {
  /**
   * Sinh đề thi tự động dựa trên ma trận đã chọn.
   * (Generate an automatic exam based on the selected matrix)
   * @param data - Dữ liệu đầu vào bao gồm matrixId và name (Input data including matrixId and name)
   * @returns Trả về phản hồi chứa thông tin đề thi vừa tạo (Returns response containing newly created exam)
   */
  async generateAuto(data: IGenerateExamDTO) {
    // UI gọi Service -> Service gọi API -> Trả về data (No try/catch here)
    const response = await examGenerationApi.generateAuto(data);
    return response.data;
  },

  /**
   * Lấy danh sách tất cả các đề thi có phân trang và bộ lọc.
   * (Get list of all exams with pagination and filters)
   * @param params - Các tham số phân trang, tìm kiếm và bộ lọc (Pagination, search, and filter parameters)
   * @returns Promise chứa dữ liệu danh sách đề thi (Promise containing exam list data)
   */
  async getAll(params: QueryParams) {
    /**
     * Luồng xử lý: Nhận tham số từ Hook -> Truy vấn API -> Trả dữ liệu phẳng về UI.
     * (Execution Flow: Receive params from Hook -> Query API -> Return flat data to UI.)
     */
    const response = await examGenerationApi.getAll(params);
    return response.data;
  },
};