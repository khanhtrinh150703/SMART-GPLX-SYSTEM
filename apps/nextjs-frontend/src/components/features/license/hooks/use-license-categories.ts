import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { licenseCategoryService } from "@/components/features/license/service/license-category.service";
import {
  CreateLicenseCategoryRequest,
  UpdateLicenseCategoryRequest
} from "@/components/features/license/types/license-category.types";
import { QueryParams } from "@/types/paginaton.type";

/**
 * Hook quản lý toàn bộ logic dữ liệu của Hạng bằng lái.
 * (Hook managing all data logic for License Categories)
 * @param params - Các tham số phân trang, tìm kiếm, lọc.
 */
export const useLicenseCategories = (params: QueryParams) => {
  const queryClient = useQueryClient();

  // 1. Truy vấn danh sách (Fetch List)
  const categoriesQuery = useQuery({
    // QueryKey chứa params để tự động tải lại khi params thay đổi.
    // (QueryKey includes params to auto-refetch when params change)
    queryKey: ["license-categories", params],
    queryFn: () => licenseCategoryService.getAllCategories(params),
    placeholderData: (previousData) => previousData, // Giữ giao diện không bị nháy khi sang trang.
  });

  // 2. Mutation: Tạo mới (Create)
  const createMutation = useMutation({
    mutationFn: (data: CreateLicenseCategoryRequest) =>
      licenseCategoryService.createCategory(data),
    onSuccess: () => {
      // Làm mới cache để cập nhật danh sách ngay lập tức.
      // (Invalidate cache to update list immediately)
      queryClient.invalidateQueries({ queryKey: ["license-categories"] });
    },
  });

  // 3. Mutation: Cập nhật (Update)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLicenseCategoryRequest }) =>
      licenseCategoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["license-categories"] });
    },
  });

  // 4. Mutation: Xóa (Delete)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => licenseCategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["license-categories"] });
    },
  });

  // 5. Mutation: Khôi phục (Restore) - Dùng cho Soft Delete
  const restoreMutation = useMutation({
    mutationFn: (id: string) => licenseCategoryService.restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["license-categories"] });
    },
  });

  // Trả về một đối tượng duy nhất chứa tất cả trạng thái và hàm xử lý.
  // (Return a single object containing all states and handlers)
  return {
    // Trả về data đúng cấu trúc PaginatedResult (Return data with PaginatedResult structure)
    result: categoriesQuery.data?.data,
    isLoading: categoriesQuery.isLoading,
    isPlaceholderData: categoriesQuery.isPlaceholderData,
    createCategory: createMutation,
    updateCategory: updateMutation,
    deleteCategory: deleteMutation,
    restoreCategory: restoreMutation,
  };
};