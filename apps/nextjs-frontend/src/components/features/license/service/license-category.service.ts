import { licenseCategoryApi } from "@/components/features/license/api/license-category.api";
import { StandardResponse } from "@/types/common.type";
import {
    LicenseCategory,
    CreateLicenseCategoryRequest,
    UpdateLicenseCategoryRequest
} from "@/types/license-category.types";
import { QueryParams } from "@/types/paginaton.type";

/**
 * Lớp Xử lý Nghiệp vụ (Business Logic Layer) cho module Hạng bằng lái.
 * (Business Logic Layer for License Category module)
 */
export const licenseCategoryService = {
    /**
     * Lấy danh sách tất cả hạng bằng lái.
     * (Get all license categories)
     * @returns Promise chứa danh sách hạng bằng lái trong gói StandardResponse.
     */
    getAllCategories: async (params: QueryParams) => {
        return await licenseCategoryApi.getAll(params);
    },
    /**
     * Tạo mới một hạng bằng lái.
     * (Create a new license category)
     * @param data - Dữ liệu từ Form (Plain Object).
     * @returns Promise chứa thông tin hạng bằng vừa tạo.
     */
    createCategory: async (
        data: CreateLicenseCategoryRequest
    ): Promise<StandardResponse<LicenseCategory>> => {
        /**
         * Luồng xử lý (Execution Flow):
         * Nhận dữ liệu -> Chuyển tiếp xuống API -> Trả kết quả về UI.
         * (Receive data -> Forward to API -> Return result to UI)
         */
        const response = await licenseCategoryApi.create(data);

        return response;
    },

    /**
     * Cập nhật thông tin hạng bằng lái.
     * (Update license category information)
     * @param id - ID định danh của hạng bằng.
     * @param data - Dữ liệu cần cập nhật (Partial).
     */
    updateCategory: async (
        id: string,
        data: UpdateLicenseCategoryRequest
    ): Promise<StandardResponse<LicenseCategory>> => {
        // Thực hiện gọi API cập nhật dữ liệu.
        // (Execute API call to update data)
        const response = await licenseCategoryApi.update(id, data);

        return response;
    },

    /**
     * Xóa hạng bằng lái (Soft delete).
     * (Delete license category - Soft delete)
     * @param id - ID định danh của hạng bằng.
     */
    deleteCategory: async (id: string): Promise<StandardResponse<void>> => {
        /**
         * Chuyển tiếp yêu cầu xóa xuống API Layer.
         * Lưu ý: Không dùng try/catch tại đây theo kiến trúc đã định.
         * (Forward delete request to API Layer. Note: No try/catch here per architecture)
         */
        return await licenseCategoryApi.delete(id);
    },

    /**
     * Khôi phục hạng bằng lái đã bị xóa.
     * (Restore a deleted license category)
     * @param id - ID định danh của hạng bằng.
     */
    restoreCategory: async (id: string): Promise<StandardResponse<LicenseCategory>> => {
        // Thực hiện yêu cầu PATCH để khôi phục dữ liệu.
        // (Execute PATCH request to restore data)
        const response = await licenseCategoryApi.restore(id);

        return response;
    },
};