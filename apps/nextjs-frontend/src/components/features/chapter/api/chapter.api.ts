import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import axiosClient from "@/services/axios-client";
import { StandardResponse } from "@/types/common.type";
import {
    Chapter,
    CreateChapterRequest,
    UpdateChapterRequest
} from "@/types/chapter.types"; // (Giả định bạn đã đổi tên file types)
import { PaginatedResult, QueryParams } from "@/types/paginaton.type";

/**
 * Chapter API: Quản lý các chương bài học (Lý thuyết GPLX).
 * (Chapter API: Manage learning chapters)
 */
export const chapterApi = {
    /**
     * Lấy danh sách tất cả các chương.
     * (Fetch all chapters list with pagination)
     */
    getAll: async (params: QueryParams): Promise<StandardResponse<PaginatedResult<Chapter>>> => {
        const response = await axiosClient.get<StandardResponse<PaginatedResult<Chapter>>>(
            ENDPOINTS.CHAPTER.BASE,
            { params }
        );
        return response.data;
    },


    /**
     * Tạo mới một chương bài học.
     * (Create a new chapter)
     */
    create: async (
        data: CreateChapterRequest
    ): Promise<StandardResponse<Chapter>> => {
        const response = await axiosClient.post<StandardResponse<Chapter>>(
            ENDPOINTS.CHAPTER.BASE,
            data
        );
        return response.data;
    },

    /**
     * Cập nhật thông tin chương theo ID.
     * (Update chapter information by ID)
     */
    update: async (
        id: string,
        data: UpdateChapterRequest
    ): Promise<StandardResponse<Chapter>> => {
        const response = await axiosClient.patch<StandardResponse<Chapter>>(
            ENDPOINTS.CHAPTER.DETAIL(id),
            data
        );
        return response.data;
    },

    /**
     * Xóa một chương (Soft delete).
     * (Delete a chapter - Soft delete)
     */
    delete: async (id: string): Promise<StandardResponse<void>> => {
        const response = await axiosClient.delete<StandardResponse<void>>(
            ENDPOINTS.CHAPTER.DETAIL(id)
        );
        return response.data;
    },

    /**
     * Khôi phục chương đã bị xóa.
     * (Restore a deleted chapter)
     */
    restore: async (id: string): Promise<StandardResponse<Chapter>> => {
        const response = await axiosClient.patch<StandardResponse<Chapter>>(
            ENDPOINTS.CHAPTER.RESTORE(id)
        );
        return response.data;
    },
};