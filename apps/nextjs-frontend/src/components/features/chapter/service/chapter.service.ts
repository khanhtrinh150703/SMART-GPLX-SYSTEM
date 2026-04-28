import { chapterApi } from "@/components/features/chapter/api/chapter.api";
import { StandardResponse } from "@/types/common.type";
import {
    Chapter,
    CreateChapterRequest,
    UpdateChapterRequest
} from "@/components/features/chapter/types/chapter.types";
import { QueryParams } from "@/types/paginaton.type";

/**
 * Lớp Xử lý Nghiệp vụ (Business Logic Layer) cho module Chương bài học.
 * (Business Logic Layer for Chapter module)
 */
export const chapterService = {
    /**
     * Lấy danh sách tất cả các chương bài học.
     * (Get all chapters)
     * @param params - Các tham số phân trang, tìm kiếm, lọc.
     * @returns Promise chứa danh sách chương trong gói StandardResponse.
     */
    getAllChapters: async (params: QueryParams) => {
        return await chapterApi.getAll(params);
    },

    /**
     * Tạo mới một chương bài học.
     * (Create a new chapter)
     * @param data - Dữ liệu từ Form (Plain Object).
     * @returns Promise chứa thông tin chương vừa tạo.
     */
    createChapter: async (
        data: CreateChapterRequest
    ): Promise<StandardResponse<Chapter>> => {
        /**
         * Luồng xử lý (Execution Flow):
         * Nhận dữ liệu -> Chuyển tiếp xuống API -> Trả kết quả về UI.
         */
        const response = await chapterApi.create(data);

        return response;
    },

    /**
     * Cập nhật thông tin chương bài học.
     * (Update chapter information)
     * @param id - ID định danh của chương.
     * @param data - Dữ liệu cần cập nhật (Partial).
     */
    updateChapter: async (
        id: string,
        data: UpdateChapterRequest
    ): Promise<StandardResponse<Chapter>> => {
        // Thực hiện gọi API cập nhật dữ liệu.
        const response = await chapterApi.update(id, data);

        return response;
    },

    /**
     * Xóa chương bài học (Soft delete).
     * (Delete chapter - Soft delete)
     * @param id - ID định danh của chương.
     */
    deleteChapter: async (id: string): Promise<StandardResponse<void>> => {
        /**
         * Chuyển tiếp yêu cầu xóa xuống API Layer.
         * Lưu ý: Không dùng try/catch tại đây theo kiến trúc đã định.
         */
        return await chapterApi.delete(id);
    },

    /**
     * Khôi phục chương bài học đã bị xóa.
     * (Restore a deleted chapter)
     * @param id - ID định danh của chương.
     */
    restoreChapter: async (id: string): Promise<StandardResponse<Chapter>> => {
        // Thực hiện yêu cầu PATCH để khôi phục dữ liệu chương.
        const response = await chapterApi.restore(id);

        return response;
    },
};