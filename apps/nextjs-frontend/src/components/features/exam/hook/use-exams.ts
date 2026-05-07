import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/types/paginaton.type";
import { examService } from "../service/exam.service";
import { masterService } from "@/services/master-data/master-data.service";

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

    // 2. Lấy danh sách hạng bằng (Fetch License Categories)
    const licensesQuery = useQuery({
        queryKey: ["license-categories-selection"],
        queryFn: () => masterService.getLicenseCategorySelection(),
        staleTime: 5 * 60 * 1000,
    });

    // 3. Lấy danh sách ma trận đề (Fetch Exam Matrices)
    const matrixQuery = useQuery({
        queryKey: ["exam-matrix-selection"],
        queryFn: () => masterService.getExamMatrixSelection(),
        staleTime: 5 * 60 * 1000,
    });

    return {
        // Data flattening logic
        exams: examsQuery.data?.data?.data || [],
        pagination: examsQuery.data?.data?.meta,

        // Options for Selects
        licenseOptions: licensesQuery.data || [],
        examMatrixOptions: matrixQuery.data || [],

        // Loading states
        isLoading: examsQuery.isLoading,
        isFetching: examsQuery.isFetching,
        isPlaceholderData: examsQuery.isPlaceholderData,
    };
};