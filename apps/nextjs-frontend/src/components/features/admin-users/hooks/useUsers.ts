// src/features/admin-users/hooks/useUsers.ts
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user/user.service";
import { UserResponseDTO } from "@/types/user-respone";
import { PaginationMeta } from "@/types/api.types";
import { UserQueryDTO } from "@/types/query-user";
import { AdminUserFormValues } from "@/lib/validations/auth.schema"; // Đảm bảo import đúng
import axios from "axios";
import { toast } from "react-hot-toast";
import { Form } from "lucide-react";
import { AdminUpdateFormValues} from "@/lib/validations/user.schema";

/**
 * Mục đích (Purpose): Quản lý tập trung toàn bộ logic nghiệp vụ (Business Logic) 
 * cho phân hệ Quản trị người dùng.
 */
export function useUsers() {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Đã bổ sung state này
  const [status, setStatus] = useState<UserQueryDTO["status"]>("active");

  /**
   * Hàm tải dữ liệu (Load Data function)
   */
  const loadUsers = useCallback(async (
    page: number = 1,
    statusFilter: UserQueryDTO["status"] = "active"
  ) => {
    setIsLoading(true);
    try {
      const response = await userService.getUsers({
        page,
        limit: 10,
        status: statusFilter === "all" ? "all" : statusFilter
      });

      if (response.success && response.data) {
        setUsers(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Hàm chuyển đổi trạng thái lọc (Change Status Handler)
   */
  const changeStatus = useCallback((newStatus: UserQueryDTO["status"]) => {
    setStatus(newStatus);
    loadUsers(1, newStatus);
  }, [loadUsers]);

  /**
   * Hàm xử lý xóa/khóa (Handle Delete)
   */
  const handleDelete = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await userService.deleteUser(id);
      if (response.success) {
        toast.success("Đã khóa người dùng thành công");
        await loadUsers(meta?.page || 1, status);
        return response;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Xóa thất bại");
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [loadUsers, meta?.page, status]);

  /**
   * Hàm mở khóa tài khoản (Handle Unlock)
   */
  const handleUnlock = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Logic: Cập nhật status về active
      // await userService.updateStatus(id, 'active');
      toast.success("Đã mở khóa tài khoản");
      await loadUsers(meta?.page || 1, status);
    } catch (error) {
      console.error("Unlock failed");
      toast.error("Mở khóa thất bại");
    } finally {
      setIsLoading(false);
    }
  }, [loadUsers, meta?.page, status]);

  /**
   * Hàm khôi phục từ thùng rác (Handle Restore)
   */
  const handleRestore = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await userService.restoreUser(id);
      toast.success("Khôi phục thành công");
      await loadUsers(meta?.page || 1, status);
    } catch (error) {
      console.error("Restore failed");
      toast.error("Khôi phục thất bại");
    } finally {
      setIsLoading(false);
    }
  }, [loadUsers, meta?.page, status]);

  /**
   * Hàm cập nhật thông tin (Handle Update)
   */
  const handleUpdate = useCallback(async (
    userId: string,
    data: AdminUpdateFormValues,
    onSuccess?: () => void
  ) => {
    setIsUpdating(true);
    try {
      // 1. Phải có 'const' và nếu gửi JSON thì không để kiểu là FormData
      const updateData: AdminUpdateFormValues = {
        fullName: data.fullName,
        email: data.email ?? "",
        // phoneNumber: data.phone,
        // licenseClass: data.licenseClass, // Nếu backend cần thì mở ra
      };

      // 2. Gọi hàm service dành riêng cho Admin (truyền cả ID)
      const response = await userService.updateProfileAdmin(userId, updateData);

      if (response.success) {
        toast.success("Cập nhật thông tin thành công!");
        // Load lại danh sách ở trang hiện tại để thấy data mới
        await loadUsers(meta?.page || 1, status);
        if (onSuccess) onSuccess();
      }
    } catch (error: unknown) {
      console.error("Update User Error:", error);

      // 3. Xử lý lỗi không dùng 'any'
      let msg = "Có lỗi xảy ra khi cập nhật";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      }
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  }, [loadUsers, meta?.page, status]);

  useEffect(() => {
    loadUsers(1, "active");
  }, [loadUsers]);

  // Định nghĩa reload
  const reload = (page?: number) => loadUsers(page || meta?.page || 1, status);

  // CHỈ CÓ DUY NHẤT 1 RETURN Ở CUỐI CÙNG
  return {
    users,
    meta,
    isLoading,
    isDeleting,
    isUpdating,
    status,
    changeStatus,
    reload,
    handleDelete,
    handleUnlock,
    handleRestore,
    handleUpdate
  };
}