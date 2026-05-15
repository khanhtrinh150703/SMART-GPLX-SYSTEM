import { PaginatedResult } from "@/types/api.types";
import { StandardResponse } from "@/types/common.type";
import { QueryParams } from "@/types/paginaton.type";
import { examUserApi } from "../api/exam-user.api";
import { IExamItem } from "../types/exam-ui.types";
import { IExamFullContent } from "../types/exam-session.types";
import { ICompleteExamRequestDTO } from "../types/exam-complete.types";
import { IExamUserResultResponseDTO } from "../types/exam-result.types";

export const examUserService = {
    /**
     * Fetch exams for visual display in Infinite Scroll
     * (Tải danh sách đề thi phục vụ hiển thị cuộn vô hạn)
     * @param params - Query parameters (Tham số truy vấn)
     */
    listVisual: async (params: QueryParams): Promise<StandardResponse<PaginatedResult<IExamItem>>> => {
        const response = await examUserApi.listVisual(params);

        /**
         * Early Return logic for Data Safety.
         * (Logic trả về sớm để đảm bảo an toàn dữ liệu.)
         */
        if (!response || !response.data) {
            throw new Error("Không thể tải danh sách hiển thị đề thi (Failed to fetch visual exam list)");
        }

        return response;
    },

    /**
     * Retrieve comprehensive details for a specific exam
     * (Truy xuất thông tin chi tiết đầy đủ cho một đề thi cụ thể)
     * @param id - Exam ID (Mã định danh đề thi)
     */
    getDetails: async (id: string): Promise<StandardResponse<IExamFullContent>> => {
        const response = await examUserApi.details(id);

        /**
         * Ensure data existence before returning to the caller.
         * (Đảm bảo sự tồn tại của dữ liệu trước khi trả về nơi gọi.)
         */
        if (!response || !response.data) {
            throw new Error(`Thông tin đề thi không tồn tại (Exam details do not exist for ID: ${id})`);
        }

        return response;
    },

    /**
     * @description Xử lý nộp bài thi
     */
    submit: async (payload: ICompleteExamRequestDTO): Promise<StandardResponse<IExamUserResultResponseDTO>> => {
        // 1. Gọi API nộp bài
        const response = await examUserApi.submit(payload);

        // 2. Early Return: Kiểm tra nếu Backend không trả về kết quả chấm điểm
        if (!response.data) {
            throw new Error("Lỗi hệ thống khi chấm điểm bài thi (Grading system error)");
        }

        /**
         * 3. Logic bổ sung (Tùy chọn): 
         * Nếu nộp thành công, ông có thể thực hiện xóa cache local hoặc 
         * bắn một event để UI cập nhật trạng thái tại đây.
         */
        return response;
    },

    /**
     * @description Xử lý nộp bài thi cho khách và dọn dẹp bộ nhớ local.
     * @param payload - Dữ liệu nộp bài (Exam Submission Payload).
     * @returns Promise chứa kết quả chấm điểm (Grading Result).
     */
    submitAsGuest: async (
        payload: ICompleteExamRequestDTO
    ): Promise<StandardResponse<IExamUserResultResponseDTO>> => {
        // 1. Gọi API nộp bài (API Call)
        const response = await examUserApi.submitAsGuest(payload);

        // 2. Early Return: Kiểm tra dữ liệu trả về (Data Integrity Check)
        if (!response.data) {
            throw new Error("Lỗi hệ thống khi chấm điểm bài thi (Grading system error)");
        }


        return response;
    },
}