// src/hook/use-infinite-exam-visual.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryParams, PaginatedResult } from "@/types/paginaton.type";
import { IExamItem } from "../types/exam-ui.types";
import { examUserService } from "../service/exam-user.service";

// src/hook/use-infinite-exam-visual.ts
export const useInfiniteExamsVisual = (params: QueryParams) => {
    return useInfiniteQuery({
        queryKey: ["exams", "visual", "infinite", params],
        queryFn: async ({ pageParam = 1 }): Promise<PaginatedResult<IExamItem>> => {
            const response = await examUserService.listVisual({ ...params, page: pageParam });

            if (!response.data) {
                throw new Error("Data is missing from response");
            }

            return response.data;
        },
        
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResult<IExamItem>) => {
            const { hasNextPage, page } = lastPage.meta;
            return hasNextPage ? page + 1 : undefined;
        },

        // ĐỂ REAL-TIME HOẠT ĐỘNG: staleTime phải thấp
        staleTime: 0,
        // Luôn fetch lại khi quay lại tab (Tùy chọn)
        refetchOnWindowFocus: true,
    });
};
