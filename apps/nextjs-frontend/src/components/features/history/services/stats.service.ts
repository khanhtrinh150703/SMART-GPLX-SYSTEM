// src/features/stats/services/stats.service.ts

import { statsApi } from "../api/stats.api";
import { StandardResponse } from "@/types/common.type";
import { IUserStatistics } from "../types/stats.types";

/**
 * Lớp Xử lý Nghiệp vụ cho module Thống kê.
 * (Business Logic Layer for Statistics module)
 */
export const statsService = {
  /**
   * Lấy dữ liệu tổng quan thống kê của người dùng hiện tại.
   * (Get summary statistics for the current user)
   *
   * @returns Promise chứa thông tin thống kê (số bài thi, tỷ lệ đỗ, tiến độ).
   */
  getMyStats: async (): Promise<StandardResponse<IUserStatistics>> => {
    /**
     * Không sử dụng try/catch ở đây để lớp UI có thể bắt lỗi
     * và hiển thị thông báo phù hợp qua Toast/Alert.
     */
    const response = await statsApi.getMySummary();

    return response;
  },
};
