import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/types/paginaton.type";
import { examService } from "../service/exam.service";


/**
 * @description Hook chuyên trách truy vấn dữ liệu Đề thi (Query-only hook)
 * @param params Tham số phân trang và bộ lọc (Pagination & Filter params)
 */
export const useExams = (params: QueryParams) => {
    const QUERY_KEY = ["exams"];

    // 1. Lấy danh sách đề thi (Fetch Exam List)
    const examsQuery = useQuery({
        queryKey: [...QUERY_KEY, params],
        queryFn: () => examService.getAll(params),
        placeholderData: (previousData) => previousData,
    });

    return {
        // Data flattening logic
        exams: examsQuery.data?.data?.data || [],
        pagination: examsQuery.data?.data?.meta,

        // Loading states
        isLoading: examsQuery.isLoading,
        isFetching: examsQuery.isFetching,
        isPlaceholderData: examsQuery.isPlaceholderData,
    };
};