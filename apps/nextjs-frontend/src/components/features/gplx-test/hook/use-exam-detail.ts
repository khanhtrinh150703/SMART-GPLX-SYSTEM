import { useQuery } from "@tanstack/react-query";
import { examUserService } from "../service/exam-user.service";

/**
 * @description Hook truy vấn chi tiết một đề thi (Exam Detail query hook)
 * @param id Mã định danh đề thi (Exam ID)
 */
export const useExamDetail = (id: string | undefined) => {
    const QUERY_KEY = ["exam-detail", id];

    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => examUserService.getDetails(id!),
        enabled: !!id, // Chỉ chạy khi có ID (Only run when ID exists)
        staleTime: 10 * 60 * 1000, // Chi tiết đề thi ít thay đổi, có thể cache lâu
    });

    return {
        // Data flattening
        exam: query.data?.data,

        // Status states
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch
    };
};