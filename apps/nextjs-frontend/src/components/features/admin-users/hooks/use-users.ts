import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserQueryDTO } from "@/types/query-user";
import { AdminUpdatePayload } from "../schema/user.schema";
import { userAdminService } from "../services/user-admin.service";
import { masterService } from "@/services/master-data/master-data.service";

/**
 * Hook quản lý toàn bộ logic dữ liệu của Người dùng (User).
 * (Hook managing all data logic for Users using TanStack Query)
 * @param params - Các tham số phân trang, tìm kiếm, lọc.
 */
export const useUsers = (params: UserQueryDTO) => {
  const queryClient = useQueryClient();

  // 1. Truy vấn danh sách (Fetch List)
  // Tự động refetch khi params (page, limit, status, search...) thay đổi
  const usersQuery = useQuery({
    queryKey: ["users", params],
    queryFn: () => userAdminService.getUsers(params),
    placeholderData: (previousData) => previousData, // Giữ dữ liệu cũ khi đang load trang mới (tránh nháy UI)
  });

  // 2. Mutation: Xóa hoặc Khóa người dùng (Delete/Lock)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => userAdminService.deleteUser(id),
    onSuccess: () => {
      // Làm mới cache danh sách users ngay lập tức
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // 3. Mutation: Khôi phục hoặc Mở khóa (Restore/Unlock)
  const restoreMutation = useMutation({
    mutationFn: (id: string) => userAdminService.restoreUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // 4. Mutation: Cập nhật thông tin (Update)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdatePayload }) =>
      userAdminService.updateProfileAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });


  const rolesQuery = useQuery({
    queryKey: ["roles-selection"],
    queryFn: () => masterService.getRoleSelection(),
    staleTime: 5 * 60 * 1000, // Cache 5 phút vì dữ liệu ít thay đổi
  });


  // Trả về một đối tượng duy nhất chứa tất cả trạng thái và hàm xử lý.
  return {
    // Trả về data đúng cấu trúc (data.data chứa list, data.meta chứa phân trang)
    result: usersQuery.data?.data,
    isLoading: usersQuery.isLoading,
    isPlaceholderData: usersQuery.isPlaceholderData,

    roleOptions: rolesQuery.data || [],
    // Các trạng thái mutation để hiển thị loading trên nút bấm
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRestoring: restoreMutation.isPending,

    // Các hàm thực thi
    handleDelete: deleteMutation,
    handleRestore: restoreMutation,
    handleUnlock: restoreMutation, // Dùng chung logic restore nếu API giống nhau
    handleUpdate: updateMutation,
  };
};