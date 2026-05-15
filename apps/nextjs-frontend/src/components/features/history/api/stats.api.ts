import axiosClient from "@/services/axios-client";
import { StandardResponse } from "@/types/common.type";
import { IUserStatistics } from "../types/stats.types";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";

/**
 * Các phương thức gọi API liên quan đến Thống kê người dùng.
 * (API methods related to User Statistics)
 */
export const statsApi = {
  /**
   * Lấy tổng quan thống kê của cá nhân người dùng (Dashboard).
   * (Fetch personal user statistics summary)
   */
  getMySummary: async (): Promise<StandardResponse<IUserStatistics>> => {
    const response = await axiosClient.get<StandardResponse<IUserStatistics>>(
      ENDPOINTS.STATS.BASE,
    );
    return response.data;
  },
};
