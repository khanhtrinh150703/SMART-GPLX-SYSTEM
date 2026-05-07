import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/types/paginaton.type";
import { examUserService } from "../service/exam-user.service";

/**
 * @description Hook chuyên trách hiển thị danh sách Đề thi cho người dùng (User-facing list hook)
 * @param params Tham số phân trang và bộ lọc (Pagination & Filter params)
 */
export const useExamsVisual = (params: QueryParams) => {
    const QUERY_KEY = ["exams", "visual"];

    // 1. Lấy danh sách đề thi giao diện (Fetch Visual Exam List)
    const query = useQuery({
        queryKey: [...QUERY_KEY, params],
        queryFn: () => examUserService.listVisual(params),
        placeholderData: (previousData) => previousData,
        staleTime: 2 * 60 * 1000, // Dữ liệu visual có thể cache lâu hơn một chút
    });

    return {
        // Data flattening logic
        exams: query.data?.data?.data || [], // Trinh lưu ý: Kiểm tra lại cấu trúc trả về là .data.items hay .data.data nhé
        pagination: query.data?.data?.meta,

        // Loading states
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
    };
};