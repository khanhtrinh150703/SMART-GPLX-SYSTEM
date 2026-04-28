// src/features/exam-management/hooks/use-exam-matrices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/types/paginaton.type";
import { examMatrixService } from "../service/exam-matrix.service";
import { IExamMatrixRequest} from "../types/exam-management";
import { masterService } from "@/services/master-data/master-data.service";

/**
 * Hook quản lý toàn bộ logic dữ liệu của Ma trận đề thi (Exam Matrix).
 */
export const useExamMatrices = (params: QueryParams) => {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["exam-matrices"];

  // 1. Truy vấn danh sách (Fetch List)
  const matricesQuery = useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => examMatrixService.getAllMatrices(params),
    placeholderData: (previousData) => previousData,
  });

  // Lấy danh sách Chương rút gọn
  const chaptersQuery = useQuery({
    queryKey: ["chapters-selection"],
    queryFn: () => masterService.getChapterSelection(),
    staleTime: 5 * 60 * 1000,
  });

  // Lấy danh sách Hạng bằng rút gọn
  const licensesQuery = useQuery({
    queryKey: ["license-categories-selection"],
    queryFn: () => masterService.getLicenseCategorySelection(),
    staleTime: 5 * 60 * 1000,
  });

  // 2. Mutation logic (giữ nguyên các hàm create, update, delete, restore)
  const createMutation = useMutation({
    mutationFn: (data: IExamMatrixRequest) => examMatrixService.createNewMatrix(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IExamMatrixRequest }) =>
      examMatrixService.updateMatrix(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => examMatrixService.removeMatrix(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => examMatrixService.restoreMatrix(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    // Dữ liệu bây giờ đã phẳng và dễ đọc hơn nhiều
    matrices: matricesQuery.data?.data?.data || [],
    pagination: matricesQuery.data?.data?.meta,
    
    isLoading: matricesQuery.isLoading,
    isPlaceholderData: matricesQuery.isPlaceholderData,
    chapterOptions: chaptersQuery.data || [],
    licenseOptions: licensesQuery.data || [],
    actions: {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      delete: deleteMutation.mutateAsync,
      restore: restoreMutation.mutateAsync,
    },
    isMutating: createMutation.isPending || updateMutation.isPending,
  };
};