import { IGenerateExamDTO } from "../types/exam-generation";
import { examApi } from "../api/exam.api";

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
    const response = await examApi.generateAuto(data);
    return response.data;
  },

};