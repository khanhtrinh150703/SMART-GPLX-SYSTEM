import { masterApi } from "@/api/master-data.api/master-data.api";

/**
 * Master Service - Lớp xử lý logic cho các dữ liệu danh mục
 */
export const masterService = {
  /**
   * Lấy danh sách chương học rút gọn (Get chapter selection list)
   */
  async getChapterSelection() {
    const response = await masterApi.getChapterSelection();
    return response.data;
  },

  /**
   * Lấy danh sách hạng bằng lái rút gọn (Get license category selection list)
   */
  async getLicenseCategorySelection() {
    const response = await masterApi.getLicenseCategorySelection();
    return response.data;
  },
};