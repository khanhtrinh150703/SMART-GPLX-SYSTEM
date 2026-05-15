import { StandardResponse } from '@/types/common.type';
import { examMatrixApi } from '../api/exam-matrix.api';
import { IExamMatrixRequest, IExamMatrixResponse } from '../types/exam-management';
import { PaginatedResult, QueryParams } from '@/types/paginaton.type';
import { DeleteResponse } from '@/types/respone/delete.common';

/**
 * @description Service layer for Exam Matrix logic.
 * (Lớp dịch vụ cho các logic xử lý Ma trận đề thi.)
 */
export const examMatrixService = {
    /**
     * @description Create a new exam matrix.
     * (Tạo mới ma trận đề thi.)
     * @param data - The matrix request data. (Dữ liệu yêu cầu của ma trận.)
     * @returns Promise containing the new matrix ID. (Promise chứa ID của ma trận mới.)
     */
    createNewMatrix: async (
        data: IExamMatrixRequest
    ): Promise<StandardResponse<string>> => {
        /**
         * Execution Flow (Luồng xử lý):
         * Receive data -> Forward to API -> Return result to UI.
         * (Nhận dữ liệu -> Chuyển tiếp xuống API -> Trả kết quả về UI.)
         */
        const response = await examMatrixApi.create(data);
        return response;
    },

    /**
     * @description Get an exam matrix detail by ID.
     * (Lấy chi tiết ma trận đề thi theo ID.)
     * @param id - The unique ID of the matrix. (ID duy nhất của ma trận.)
     * @returns Promise containing the matrix response. (Promise chứa dữ liệu phản hồi của ma trận.)
     */
    getById: async (
        id: string
    ): Promise<StandardResponse<IExamMatrixResponse>> => {
        /**
         * Execution Flow (Luồng xử lý):
         * Receive ID -> Fetch from API -> Return data to UI.
         * (Nhận ID -> Lấy dữ liệu từ API -> Trả kết quả về UI.)
         */
        const response = await examMatrixApi.getById(id);
        return response;
    },

    /**
     * @description Get all exam matrices with pagination and filters.
     * (Lấy danh sách tất cả các ma trận đề thi với phân trang và bộ lọc.)
     * @param params - Pagination, search, and filter parameters. (Các tham số phân trang, tìm kiếm và bộ lọc.)
     * @returns Promise containing a list of matrices. (Promise chứa danh sách các ma trận.)
     */
    getAllMatrices: async (
        params: QueryParams
    ): Promise<StandardResponse<PaginatedResult<IExamMatrixResponse>>>=> {
        /**
         * Execution Flow (Luồng xử lý):
         * Receive parameters -> Query via API -> Return results to UI.
         * (Nhận tham số -> Truy vấn qua API -> Trả kết quả về UI.)
         */
        const response = await examMatrixApi.getAll(params);
        return response;
    },

    /**
     * @description Update an existing exam matrix.
     * (Cập nhật ma trận đề thi hiện có.)
     * @param id - The matrix ID to update. (ID ma trận cần cập nhật.)
     * @param data - Updated matrix data. (Dữ liệu ma trận đã cập nhật.)
     */
    updateMatrix: async (
        id: string,
        data: IExamMatrixRequest
    ): Promise<StandardResponse<void>> => {
        /**
         * Execution Flow (Luồng xử lý):
         * Receive ID & Data -> Forward to API -> Return result to UI.
         * (Nhận ID & Dữ liệu -> Chuyển tiếp xuống API -> Trả kết quả về UI.)
         */
        const response = await examMatrixApi.update(id, data);
        return response;
    },

    /**
     * @description Delete an exam matrix.
     * (Xóa một ma trận đề thi.)
     * @param id - The matrix ID to remove. (ID ma trận cần xóa.)
     */
    removeMatrix: async (
        id: string
    ): Promise<StandardResponse<DeleteResponse>> => {
        /**
         * Execution Flow (Luồng xử lý):
         * Receive ID -> Request API deletion -> Return result to UI.
         * (Nhận ID -> Yêu cầu API xóa -> Trả kết quả về UI.)
         */
        const response = await examMatrixApi.delete(id);
        return response;
    },

    /**
     * @description Restore a deleted exam matrix.
     * (Khôi phục ma trận đề thi đã xóa.)
     * @param id - The matrix ID to restore. (ID ma trận cần khôi phục.)
     */
    restoreMatrix: async (
        id: string
    ): Promise<StandardResponse<void>> => {
        /**
         * Execution Flow (Luồng xử lý):
         * Receive ID -> Request API restoration -> Return result to UI.
         * (Nhận ID -> Yêu cầu API khôi phục -> Trả kết quả về UI.)
         */
        const response = await examMatrixApi.restore(id);
        return response;
    },
};