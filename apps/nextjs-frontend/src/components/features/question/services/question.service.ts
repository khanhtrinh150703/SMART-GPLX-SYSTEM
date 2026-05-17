import { ISelectionPoolParams, QueryParams } from "@/types/paginaton.type";
import { questionApi } from "../api/question.api"; // Điều chỉnh đường dẫn cho đúng dự án của bạn

/**
 * Question Service: Xử lý logic nghiệp vụ cho câu hỏi.
 * (Question Service: Handle business logic for questions)
 */
export const questionService = {
    /**
     * Lấy danh sách câu hỏi có phân trang và bộ lọc.
     * (Get list of questions with pagination and filters)
     */
    async getAll(params: QueryParams) {
        const response = await questionApi.getAll(params);
        return response.data;
    },

    /**
     * Lấy thông tin chi tiết một câu hỏi.
     * (Get detailed information of a single question)
     */
    async getById(id: string) {
        const response = await questionApi.getById(id);
        return response.data;
    },

    /**
     * Tạo mới câu hỏi.
     * (Create a new question)
     */
    async create(data: FormData) {
        const response = await questionApi.create(data);
        return response.data;
    },

    /**
     * Cập nhật thông tin câu hỏi.
     * (Update question information)
     */
    async update(id: string, data: FormData) {
        const response = await questionApi.update(id, data);
        return response.data;
    },

    /**
     * Xóa mềm câu hỏi.
     * (Soft delete a question)
     */
    async delete(id: string) {
        const response = await questionApi.delete(id);
        return response.data;
    },

    /**
     * Khôi phục câu hỏi đã xóa.
     * (Restore a deleted question)
     */
    async restore(id: string) {
        const response = await questionApi.restore(id);
        return response.data;
    },


    /**
     * Lấy kho câu hỏi rút gọn để phục vụ việc chọn câu hỏi cho đề thi.
     * (Fetch summary questions for exam selection pool)
     */
    async selectionPool(params: ISelectionPoolParams) {
        // Gọi xuống API service đã định nghĩa trước đó
        const response = await questionApi.selectionPool(params);

        // nên ở đây chỉ cần trả về kết quả cuối cùng là mảng hoặc object data.
        return response;
    },
};