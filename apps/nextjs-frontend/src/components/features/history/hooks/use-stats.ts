// src/features/stats/hooks/use-stats.ts

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { statsService } from "../services/stats.service";

/**
 * Hook quản lý logic dữ liệu thống kê Dashboard.
 * (Hook managing dashboard statistics data logic)
 */
export const useStats = () => {
  const queryClient = useQueryClient();

  // Truy vấn dữ liệu thống kê tổng quan (Fetch Summary Stats)
  const statsQuery = useQuery({
    queryKey: ["user-stats-summary"],
    queryFn: () => statsService.getMyStats(),
    
    // Giữ dữ liệu cũ trong 1 phút trước khi đánh dấu là lỗi thời (stale)
    staleTime: 60 * 1000, 
    
    // Tự động làm mới khi người dùng quay lại tab trình duyệt
    refetchOnWindowFocus: true,
  });

  /**
   * Hàm ép buộc làm mới dữ liệu thống kê (ví dụ: sau khi nộp bài thi).
   * (Function to force refresh statistics - e.g., after exam submission)
   */
  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: ["user-stats-summary"] });
  };

  return {
    // Trích xuất dữ liệu từ StandardResponse (Extract data from StandardResponse)
    stats: statsQuery.data?.data,
    
    // Trạng thái (States)
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    isFetching: statsQuery.isFetching,

    // Hành động (Actions)
    refreshStats,
  };
};