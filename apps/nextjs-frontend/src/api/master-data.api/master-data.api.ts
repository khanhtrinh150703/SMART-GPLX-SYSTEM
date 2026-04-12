import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import axiosClient from "@/services/axios-client";
import { SelectionData, StandardResponse } from "@/types/common.type";

/**
 * Master API - Quản lý các dữ liệu danh mục (Selection Data)
 */
export const masterApi = {
  /**
   * Lấy danh sách chương học rút gọn để đổ vào Dropdown.
   * (Fetch chapter selection list for dropdowns)
   */
  getChapterSelection: async (): Promise<StandardResponse<SelectionData[]>> => {
    const response = await axiosClient.get<StandardResponse<SelectionData[]>>(
      ENDPOINTS.CHAPTER.SELECTION
    );
    return response.data;
  },

  /**
   * Lấy danh sách hạng bằng lái rút gọn để đổ vào Dropdown.
   * (Fetch license category selection list for dropdowns)
   */
  getLicenseCategorySelection: async (): Promise<StandardResponse<SelectionData[]>> => {
    const response = await axiosClient.get<StandardResponse<SelectionData[]>>(
      ENDPOINTS.LICENSE.SELECTION
    );
    return response.data;
  },
};