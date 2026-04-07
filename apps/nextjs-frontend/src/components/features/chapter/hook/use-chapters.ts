import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateChapterRequest,
  UpdateChapterRequest
} from "@/types/chapter.types";
import { QueryParams } from "@/types/paginaton.type";
import { chapterService } from "@/services/chapter/chapter.service";

/**
 * Hook quản lý toàn bộ logic dữ liệu của Chương (Chapter).
 * (Hook managing all data logic for Chapters)
 * @param params - Các tham số phân trang, tìm kiếm, lọc.
 */
export const useChapters = (params: QueryParams) => {
  const queryClient = useQueryClient();

  // 1. Truy vấn danh sách (Fetch List)
  const chaptersQuery = useQuery({
    // QueryKey chứa params để tự động tải lại khi params thay đổi.
    // (QueryKey includes params to auto-refetch when params change)
    queryKey: ["chapters", params],
    queryFn: () => chapterService.getAllChapters(params),
    placeholderData: (previousData) => previousData, // Giữ giao diện không bị nháy khi sang trang.
  });

  // 2. Mutation: Tạo mới (Create)
  const createMutation = useMutation({
    mutationFn: (data: CreateChapterRequest) =>
      chapterService.createChapter(data),
    onSuccess: () => {
      // Làm mới cache để cập nhật danh sách ngay lập tức.
      // (Invalidate cache to update list immediately)
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });

  // 3. Mutation: Cập nhật (Update)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChapterRequest }) =>
      chapterService.updateChapter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });

  // 4. Mutation: Xóa (Delete)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => chapterService.deleteChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });

  // 5. Mutation: Khôi phục (Restore) - Dùng cho Soft Delete
  const restoreMutation = useMutation({
    mutationFn: (id: string) => chapterService.restoreChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
  });

  // Trả về một đối tượng duy nhất chứa tất cả trạng thái và hàm xử lý.
  // (Return a single object containing all states and handlers)
  return {
    // Trả về data đúng cấu trúc PaginatedResult 
    result: chaptersQuery.data?.data,
    isLoading: chaptersQuery.isLoading,
    isPlaceholderData: chaptersQuery.isPlaceholderData,
    createChapter: createMutation,
    updateChapter: updateMutation,
    deleteChapter: deleteMutation,
    restoreChapter: restoreMutation,
  };
};