// src/features/stats/hooks/use-user-stats.ts

import { useQuery } from "@tanstack/react-query";
import { statsService } from "../services/stats.service";

/**
 * Hook truy vấn thông tin thống kê người dùng.
 * (Hook to query user statistics)
 */
export const useUserStats = () => {
  /**
   * Tận dụng cơ chế Type Inference (Suy luận kiểu) của TanStack Query v5.
   * Không khai báo Generics thủ công để tránh lỗi lệch kiểu (Type Mismatch).
   */
  return useQuery({
    // Query Key (Khóa truy vấn)
    queryKey: ["user-stats"],

    // Query Function (Hàm thực thi truy vấn)
    // Tự động hiểu trả về Promise<StandardResponse<IUserStatistics>>
    queryFn: () => statsService.getMyStats(),

    // Thời gian dữ liệu được coi là mới (Stale time)
    staleTime: 1000 * 60 * 5, // 5 phút (Five minutes)

    /**
     * Data Transformation (Biến đổi dữ liệu):
     * TypeScript sẽ tự hiểu 'response' là StandardResponse<IUserStatistics>
     * và kiểu dữ liệu cuối cùng của Hook là IUserStatistics.
     */
    select: (response) => response.data,

    // Tắt tự động tải lại khi chuyển tab (Disable refetch on focus)
    refetchOnWindowFocus: false,
  });
};