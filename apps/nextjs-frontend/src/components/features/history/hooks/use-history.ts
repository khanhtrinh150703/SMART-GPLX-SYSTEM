import { useQuery, useQueryClient } from "@tanstack/react-query";
import { historyService } from "../services/history.service";
import { HistoryQueryParams } from "../types/history.types";

/**
 * Hook quản lý logic dữ liệu cho Lịch sử thi.
 * (Hook managing data logic for Exam History)
 * 
 * @param params - Các tham số phân trang và bộ lọc cho danh sách.
 * @param detailId - ID của bản ghi lịch sử cần lấy chi tiết (tùy chọn).
 */
export const useHistory = (params: HistoryQueryParams, detailId?: string) => {
  const queryClient = useQueryClient();

  // 1. Truy vấn danh sách lịch sử (Fetch History Summary List)
  const summaryQuery = useQuery({
    // QueryKey chứa params để tự động re-fetch khi phân trang/lọc thay đổi.
    queryKey: ["exam-histories", params],
    queryFn: () => historyService.getAllHistories(params),
    placeholderData: (previousData) => previousData, // Giữ UI ổn định khi chuyển trang (Keep UI stable during pagination)
    staleTime: 5 * 60 * 1000, // Dữ liệu lịch sử ít thay đổi, có thể cache lâu hơn (History data is static, can cache longer)
  });

  // 2. Truy vấn chi tiết một bài thi (Fetch History Detail)
  const detailQuery = useQuery({
    queryKey: ["exam-history-detail", detailId],
    queryFn: () => (detailId ? historyService.getHistoryDetail(detailId) : null),
    // Chỉ chạy query này khi có detailId (Only run this query when detailId is provided)
    enabled: !!detailId, 
    retry: 1,
  });

  /**
   * Hàm làm mới dữ liệu thủ công.
   * (Manual data refresh function)
   */
  const refreshSummary = () => {
    queryClient.invalidateQueries({ queryKey: ["exam-histories"] });
  };

  // Trả về một đối tượng duy nhất chứa trạng thái và dữ liệu.
  return {
    // Dữ liệu danh sách (List Data)
    historyData: summaryQuery.data?.data,
    isHistoryLoading: summaryQuery.isLoading,
    isHistoryPlaceholder: summaryQuery.isPlaceholderData,
    
    // Dữ liệu chi tiết (Detail Data)
    detailData: detailQuery.data?.data,
    isDetailLoading: detailQuery.isLoading,
    isDetailError: detailQuery.isError,

    // Hành động (Actions)
    refreshSummary,
  };
};