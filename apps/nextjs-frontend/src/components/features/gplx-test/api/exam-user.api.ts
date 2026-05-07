import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import axiosClient from "@/services/axios-client";
import { PaginatedResult } from "@/types/api.types";
import { StandardResponse } from "@/types/common.type";
import { QueryParams } from "@/types/paginaton.type";
import { IExamItem } from "../types/exam-ui.types";
import { IExamFullContent } from "../types/exam-session.types";
import { ICompleteExamRequestDTO } from "../types/exam-complete.types";
import { IExamUserResultResponseDTO } from "../types/exam-result.types";


export const examUserApi = {
    /**
      * Get list of exams with pagination and filters for Infinite Scroll
      * (Lấy danh sách đề thi kèm phân trang và bộ lọc phục vụ cuộn vô hạn)
      */
    listVisual: async (params: QueryParams): Promise<StandardResponse<PaginatedResult<IExamItem>>> => {
        const response = await axiosClient.get<StandardResponse<PaginatedResult<IExamItem>>>(
            ENDPOINTS.EXAM.LIST,
            {
                params: params
            }
        );
        return response.data;
    },

    /**
     * Get full details of a specific exam
     * (Lấy thông tin chi tiết của một bộ đề thi)
     */
    details: async (id: string): Promise<StandardResponse<IExamFullContent>> => {
        const response = await axiosClient.get<StandardResponse<IExamFullContent>>(
            ENDPOINTS.EXAM.USER_DETAILS(id)
        );
        return response.data;
    },

    /**
     * @description Gửi payload nộp bài thi cuối cùng
     */
    submit: async (payload: ICompleteExamRequestDTO): Promise<StandardResponse<IExamUserResultResponseDTO>> => {
        const response = await axiosClient.post<StandardResponse<IExamUserResultResponseDTO>>(
            ENDPOINTS.EXAM.SUBMIT,
            payload
        );
        return response.data;
    },

    /**
     * @description Gửi dữ liệu nộp bài thi dành cho khách (Guest)
     * @param payload - Dữ liệu yêu cầu hoàn thành bài thi (Complete Exam Request DTO)
     * @returns Phản hồi tiêu chuẩn chứa kết quả thi (Standard Response with Exam Result)
     */
    submitAsGuest: async (
        payload: ICompleteExamRequestDTO
    ): Promise<StandardResponse<IExamUserResultResponseDTO>> => {
        // Sử dụng axiosClient đã cấu hình sẵn (không cần try/catch ở tầng này)
        const response = await axiosClient.post<StandardResponse<IExamUserResultResponseDTO>>(
            ENDPOINTS.EXAM.GUEST_SUBMIT, // Gọi đến endpoint dành riêng cho Guest
            payload
        );

        return response.data;
    },

}