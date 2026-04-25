import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/types/paginaton.type";
import { toast } from "react-hot-toast";
import { questionService } from "../services/question.service";
import { masterService } from "@/services/master-data/master-data.service";

/**
 * useQuestions: Hook quản lý toàn bộ logic dữ liệu cho tính năng Câu hỏi.
 * (Hook managing all data logic for the Question feature)
 */
export const useQuestions = (params?: QueryParams) => {
  const queryClient = useQueryClient();

  // --- 1. TRUY VẤN DANH SÁCH (FETCH LIST DATA) ---

  // Lấy danh sách câu hỏi phân trang (Fetch paginated questions)
  const questionsQuery = useQuery({
    queryKey: ["questions", params],
    queryFn: () => questionService.getAll(params!),
    enabled: !!params,
    placeholderData: (previousData) => previousData,
  });

  // --- 2. TRUY VẤN DỮ LIỆU DANH MỤC (FETCH MASTER DATA) ---

  // Lấy danh sách Chương rút gọn (Fetch chapter selection)
  const chaptersQuery = useQuery({
    queryKey: ["chapters-selection"],
    queryFn: () => masterService.getChapterSelection(),
    staleTime: 5 * 60 * 1000, // Cache 5 phút vì dữ liệu ít thay đổi
  });

  // Lấy danh sách Hạng bằng rút gọn (Fetch license category selection)
  const licensesQuery = useQuery({
    queryKey: ["license-categories-selection"],
    queryFn: () => masterService.getLicenseCategorySelection(),
    staleTime: 5 * 60 * 1000,
  });

  // --- 3. CÁC THAO TÁC BIẾN ĐỔI (MUTATIONS) ---

  // Thêm mới (Create)
  const createMutation = useMutation({
    mutationFn: (data: FormData) => questionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Thêm mới câu hỏi thành công!");
    },
    onError: () => toast.error("Không thể tạo câu hỏi mới."),
  });

  // Cập nhật (Update)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      questionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Cập nhật câu hỏi thành công!");
    },
    onError: () => toast.error("Cập nhật thất bại."),
  });

  // Xóa mềm (Delete)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Đã ẩn câu hỏi thành công.");
    },
    onError: () => toast.error("Xóa câu hỏi thất bại."),
  });

  // Khôi phục (Restore)
  const restoreMutation = useMutation({
    mutationFn: (id: string) => questionService.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Khôi phục câu hỏi thành công!");
    },
    onError: () => toast.error("Khôi phục thất bại."),
  });

  // --- 4. TRẢ VỀ KẾT QUẢ (RETURN) ---

  return {
    questions: questionsQuery.data?.data || [],
    pagination: questionsQuery.data?.meta,
    isFetching: questionsQuery.isFetching,
    chapterOptions: chaptersQuery.data || [],
    licenseOptions: licensesQuery.data || [],
    isLoadingOptions: chaptersQuery.isLoading || licensesQuery.isLoading,

    // ĐẢM BẢO CÓ ĐOẠN NÀY ĐỂ UI KHÔNG BỊ LỖI 'actions'
    actions: {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      delete: deleteMutation.mutateAsync,
      restore: restoreMutation.mutateAsync,
    },

    isMutating: createMutation.isPending || updateMutation.isPending,
  }
};