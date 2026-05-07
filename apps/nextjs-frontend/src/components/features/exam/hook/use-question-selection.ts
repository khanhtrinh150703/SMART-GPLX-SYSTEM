// src/features/exam-mgmt/hooks/use-selection-pool.ts
import { useQuery } from "@tanstack/react-query";
import { questionService } from "../../question/services/question.service";
import { ISelectionPoolParams } from "@/types/paginaton.type";

export const useSelectionPool = (params: ISelectionPoolParams) => {
  return useQuery({
    queryKey: ["questions", "selection-pool", params],
    queryFn: () => questionService.selectionPool(params),
    
    // 1. Chỉ gọi khi có licenseCategoryId (Tránh gọi rỗng khi chưa chọn hạng bằng)
    // enabled: !!params.licenseCategoryId, 

    // 2. staleTime: 5 phút. Trong 5 phút này, nếu params không đổi, 
    // nó sẽ LUÔN lấy từ cache, cực kỳ tiết kiệm API.
    staleTime: 5 * 60 * 1000,

    // 3. gcTime (CacheTime cũ): Thời gian dữ liệu tồn tại trong bộ nhớ sau khi component unmount
    gcTime: 10 * 60 * 1000, 

    select: (response) => response.data || [], 
    placeholderData: (previousData) => previousData,
  });
};