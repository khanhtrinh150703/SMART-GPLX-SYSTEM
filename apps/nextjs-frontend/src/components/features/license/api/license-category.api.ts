import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import axiosClient from "@/services/axios-client";
import { StandardResponse } from "@/types/common.type";
import {
    LicenseCategory,
    CreateLicenseCategoryRequest,
    UpdateLicenseCategoryRequest
} from "@/components/features/license/types/license-category.types";
import { PaginatedResult, QueryParams } from "@/types/paginaton.type";
import { DeleteResponse } from "@/types/respone/delete.common";

/**
 * License Category API: Quản lý các hạng bằng lái.
 * (License Category API: Manage driving license categories)
 */
export const licenseCategoryApi = {
    /**
     * Lấy danh sách tất cả hạng bằng lái.
     * (Fetch all license categories list)
     */
    getAll: async (params: QueryParams): Promise<StandardResponse<PaginatedResult<LicenseCategory>>> => {
        const response = await axiosClient.get<StandardResponse<PaginatedResult<LicenseCategory>>>(
            ENDPOINTS.LICENSE.BASE,
            { params } // Tự động serialize: ?page=1&limit=10...
        );
        return response.data;
    },

    /**
     * Tạo mới một hạng bằng lái.
     * (Create a new license category)
     */
    create: async (
        data: CreateLicenseCategoryRequest
    ): Promise<StandardResponse<LicenseCategory>> => {
        const response = await axiosClient.post<StandardResponse<LicenseCategory>>(
            ENDPOINTS.LICENSE.BASE,
            data
        );
        return response.data;
    },

    /**
     * Cập nhật thông tin hạng bằng lái theo ID.
     * (Update license category information by ID)
     */
    update: async (
        id: string,
        data: UpdateLicenseCategoryRequest
    ): Promise<StandardResponse<LicenseCategory>> => {
        const response = await axiosClient.patch<StandardResponse<LicenseCategory>>(
            ENDPOINTS.LICENSE.DETAIL(id),
            data
        );
        return response.data;
    },

    /**
     * Xóa một hạng bằng lái (Soft delete).
     * (Delete a license category - Soft delete)
     */
    delete: async (id: string): Promise<StandardResponse<DeleteResponse>> => {
        const response = await axiosClient.delete<StandardResponse<DeleteResponse>>(
            ENDPOINTS.LICENSE.DETAIL(id)
        );
        return response.data;
    },

    /**
     * Khôi phục hạng bằng lái đã bị xóa.
     * (Restore a deleted license category)
     */
    restore: async (id: string): Promise<StandardResponse<LicenseCategory>> => {
        const response = await axiosClient.patch<StandardResponse<LicenseCategory>>(
            ENDPOINTS.LICENSE.RESTORE(id)
        );
        return response.data;
    },
};