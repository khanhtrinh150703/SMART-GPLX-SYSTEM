import { useInfiniteQuery } from "@tanstack/react-query";
import { historyService } from "../services/history.service";
import { HistoryQueryParams, IExamHistorySummary } from "../types/history.types";
import { PaginatedResult } from "@/types/paginaton.type";
import { StandardResponse } from "@/types/common.type";

/**
 * Hook quản lý danh sách lịch sử thi với cơ chế Cuộn vô hạn (Infinite Scroll).
 * (Hook managing exam history list with Infinite Scroll mechanism)
 * 
 * @param filters - Các bộ lọc tìm kiếm (loại bỏ page và limit để hook tự quản lý).
 */
export const useHistoryInfinite = (
  filters: Omit<HistoryQueryParams, "page" | "limit">,
) => {
  return useInfiniteQuery<
    StandardResponse<PaginatedResult<IExamHistorySummary>>, 
    Error, 
    { pages: IExamHistorySummary[]; pageParams: number[] }
  >({
    // QueryKey bao gồm filters để tự động reset khi filter thay đổi
    queryKey: ["history-list-infinite", filters],
    
    queryFn: ({ pageParam = 1 }) =>
      historyService.getAllHistories({
        ...filters,
        page: pageParam as number,
        limit: 10,
      }),

    initialPageParam: 1,

    /**
     * Xác định trang tiếp theo dựa trên dữ liệu Meta từ Backend.
     */
    getNextPageParam: (lastPage) => {
      // Truy cập vào meta thông qua StandardResponse.data
      const meta = lastPage?.data?.meta;

      // Nếu không có trang tiếp theo hoặc không có meta, dừng lại
      if (!meta || !meta.hasNextPage) return undefined;

      return meta.page + 1;
    },

    /**
     * Làm phẳng dữ liệu từ các trang (Pages) thành một mảng duy nhất để UI dễ render.
     */
    select: (data) => ({
      // page.data là PaginatedResult, page.data.data là mảng IExamHistorySummary[]
      pages: data.pages.flatMap((page) => page?.data?.data ?? []),
      pageParams: data.pageParams as number[],
    }),
    
    // Tối ưu hiệu năng: Dữ liệu lịch sử không cần re-fetch liên tục
    staleTime: 1000 * 60 * 5, 
  });
};