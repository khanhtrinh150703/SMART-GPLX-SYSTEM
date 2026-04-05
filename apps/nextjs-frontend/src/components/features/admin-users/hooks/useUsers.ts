import { useState, useEffect, useCallback, useRef } from "react";
import { userService } from "@/services/user/user.service";
import { UserResponseDTO } from "@/types/user-respone";
import { PaginationMeta } from "@/types/api.types";
import { UserQueryDTO } from "@/types/query-user";
import { AdminUpdateFormValues } from "@/lib/validations/user.schema";
import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * Hook quản lý nghiệp vụ người dùng
 * Đảm bảo dữ liệu không bị "rỗng" khi điều hướng back/forward
 */
export function useUsers() {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [status, setStatus] = useState<UserQueryDTO["status"]>("active");

  // State quản lý trạng thái tải (Loading States)
  const [isLoading, setIsLoading] = useState(true); // Để true để tránh hiện "No data" lúc vừa vào
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Ref để theo dõi lần đầu render (First Render Tracker)
  const isFirstRender = useRef(true);

  /**
   * Hàm tải dữ liệu chính (Core Fetch Function)
   */
  const loadUsers = useCallback(async (page: number = 1, currentStatus = status) => {
    setIsLoading(true);
    try {
      const response = await userService.getUsers({
        page,
        limit: 10,
        status: currentStatus === "all" ? "all" : currentStatus,
      });

      if (response.success && response.data) {
        setUsers(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error("API Error:", error);
      setUsers([]); // Clear data để tránh hiển thị sai lệch
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Không thể tải danh sách");
      }
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  /**
   * Hàm làm mới dữ liệu (Reload / Refresh)
   */
  const reload = useCallback(
    (page?: number) => {
      return loadUsers(page || meta?.page || 1, status);
    },
    [loadUsers, meta?.page, status]
  );

  /**
   * Hàm đổi tab trạng thái (Tab Changer)
   */
  const changeStatus = useCallback(
    (newStatus: UserQueryDTO["status"]) => {
      setStatus(newStatus);
      loadUsers(1, newStatus);
    },
    [loadUsers]
  );

  /**
   * Tự động gọi API khi Mount hoặc khi Back lại trang
   * Kỹ thuật này giúp giữ nguyên dữ liệu Form nếu điều hướng bằng router.back()
   */
  useEffect(() => {
    // Nếu danh sách trống hoặc là lần đầu truy cập -> Gọi API
    if (users.length === 0 || isFirstRender.current) {
      loadUsers(1, status);
      isFirstRender.current = false;
    }
  }, [loadUsers, status, users.length]);

  /**
   * Các hàm thao tác nghiệp vụ (Business Actions)
   */

  // 1. Khóa/Xóa người dùng (Delete/Lock)
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await userService.deleteUser(id);
      if (res.success) {
        toast.success("Thao tác thành công");
        await reload();
      }
    } catch (err) {
      toast.error("Xóa thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  // 2. Mở khóa (Unlock)
  const handleUnlock = async (id: string) => {
    setIsLoading(true);
    try {
      await userService.restoreUser(id); // Giả định API restore dùng chung cho unlock
      toast.success("Đã mở khóa tài khoản");
      await reload();
    } catch (err) {
      toast.error("Mở khóa thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Khôi phục từ thùng rác (Restore)
  const handleRestore = async (id: string) => {
    setIsLoading(true);
    try {
      await userService.restoreUser(id);
      toast.success("Khôi phục thành công");
      await reload();
    } catch (err) {
      toast.error("Khôi phục thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Cập nhật thông tin (Update)
  const handleUpdate = async (
    id: string,
    data: AdminUpdateFormValues,
    onSuccess?: () => void
  ) => {
    setIsUpdating(true);
    try {
      const res = await userService.updateProfileAdmin(id, data);
      if (res.success) {
        toast.success("Cập nhật thành công");
        await reload();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      let msg = "Có lỗi xảy ra";
      if (axios.isAxiosError(error)) msg = error.response?.data?.message || msg;
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

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
    handleUpdate,
  };
}