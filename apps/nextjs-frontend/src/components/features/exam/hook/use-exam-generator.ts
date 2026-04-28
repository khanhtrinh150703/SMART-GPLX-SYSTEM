import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examGenService } from "../service/exam-generation.service";
import { IGenerateExamDTO } from "../types/exam-generation";
import { QueryParams } from "@/types/paginaton.type";

/**
 * Hook quản lý toàn bộ logic dữ liệu của Đề thi (Exam Management Hook).
 * (Hook to manage all data logic for Exams).
 */
export const useExamGenerator = (params?: QueryParams) => {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["exams-list"]; // Khóa truy vấn cho danh sách đề thi

  // 1. Truy vấn danh sách đề thi (Fetch Exam List)
  // Sử dụng getAll từ service để lấy dữ liệu phân trang và bộ lọc
  const examsQuery = useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => examGenService.getAll(params!),
    enabled: !!params, // Chỉ kích hoạt khi có tham số truyền vào
    placeholderData: (previousData) => previousData,
  });

  // 2. Mutation: Sinh đề thi tự động (Mutation: Generate Automatic Exam)
  const generateAutoMutation = useMutation({
    mutationFn: (data: IGenerateExamDTO) => examGenService.generateAuto(data),
    onSuccess: () => {
      // Làm mới danh sách đề thi sau khi sinh đề thành công
      // (Refresh the exam list after successful generation)
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    // Dữ liệu danh sách đề thi phẳng (Flat exam list data)
    exams: examsQuery.data?.data || [],
    pagination: examsQuery.data?.meta,
    
    // Trạng thái tải dữ liệu (Loading states)
    isLoading: examsQuery.isLoading,
    isGenerating: generateAutoMutation.isPending,
    isPlaceholderData: examsQuery.isPlaceholderData,

    // Các hành động (Actions)
    actions: {
      /**
       * Kích hoạt sinh đề tự động.
       * (Trigger automatic exam generation).
       */
      generateAuto: generateAutoMutation.mutateAsync,
    },
  };
};