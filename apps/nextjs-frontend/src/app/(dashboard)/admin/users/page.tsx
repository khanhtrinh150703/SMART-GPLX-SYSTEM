"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react"; // Import Icon cho Splash Screen
import EditUserModal from "@/components/features/admin-users/components/EditUserModal";
// IMPORT Component Tạo mới vừa làm
import { useUsers } from "@/components/features/admin-users/hooks/useUsers";
import { UserResponseDTO } from "@/types/user-respone";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { UserTable } from "@/components/features/admin-users/components/UserTable";
import { USER_STATUS_OPTIONS } from "@/components/features/admin-users/components/users-table.config";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";
import SplashScreen from "@/components/common/Loaders/SplashScreen"; // IMPORT Splash Screen
import { CreateUserPayload } from "@/components/features/admin-users/schema/user.schema";
import CreateUserModal from "@/components/features/admin-users/components/CreateUserModal";

/**
 * AdminUserManagementPage - Trang quản trị người dùng (Học viên)
 */
export default function AdminUserManagementPage() {
  // --- 1. HOOKS & SERVICES ---
  const {
    users,
    meta,
    isLoading,
    isDeleting,
    reload,
    handleDelete,
    handleUnlock,
    handleRestore,
    handleUpdate,
    status,
    changeStatus,
  } = useUsers();

  // --- 2. STATES (Trạng thái UI) ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);

  // Trạng thái đóng mở Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDelUserOpen, setDelUserOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Thêm state quản lý Create Modal
  
  // Trạng thái Loading khi gọi API
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // Thêm state loading khi Create

  // Hydration Fix & Mô phỏng load Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // --- 3. HANDLERS (Hàm xử lý hành động) ---
  const handleSearch = useCallback(
    (val: string) => {
      setSearchTerm(val);
      reload(1);
    },
    [reload],
  );

  /**
   * handleCreateUser - Hàm gọi API tạo mới người dùng
   */
  const handleCreateUser = async (data: CreateUserPayload) => {
    setIsCreating(true);
    try {
      console.log("Dữ liệu gửi lên API tạo User:", data);
      
      // TODO: Gắn hàm gọi API tạo mới vào đây
      // Ví dụ: await userService.create(data);
      // await reload(1); // Load lại danh sách trang 1 sau khi tạo
      
      // Giả lập API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsCreateModalOpen(false); // Đóng modal khi thành công
    } catch (error) {
      console.error("❌ Lỗi khi tạo người dùng:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUser) return;
    try {
      await handleDelete(selectedUser.id);
      setDelUserOpen(false);
    } catch (error) {
      console.error("❌ Xóa thất bại:", error);
    }
  };

  // --- MÀN HÌNH CHỜ (SPLASH SCREEN) ---
  if (!isMounted) {
    return <SplashScreen icon={Users} message="Đang tải danh sách người dùng..." />;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* HEADER SECTION */}
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">
        Quản lý người dùng<span className="text-emerald-500">.</span>
      </h1>

      {/* CONTROL SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-soft">
        <StatusTabs
          size="md"
          shape="rounded"
          options={USER_STATUS_OPTIONS}
          currentValue={status}
          onChange={(val) => {
            changeStatus(val);
            reload(1);
          }}
          className="bg-slate-100/50"
        />
        <ManagementToolbar
          searchPlaceholder="Tìm tên học viên..."
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          addLabel="Thêm học viên mới"
          // Kết nối nút Add với State mở Modal
          onAddClick={() => setIsCreateModalOpen(true)} 
          isLoading={isLoading}
        />
      </div>

      {/* DATA SECTION */}
      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/5 hover:shadow-emerald transition-all duration-500">
        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={(u) => {
            setSelectedUser(u);
            setIsEditModalOpen(true);
          }}
          onDelete={(u) => {
            setSelectedUser(u);
            setDelUserOpen(true);
          }}
          onUnlock={(u) => handleUnlock(u.id)}
          onRestore={(u) => handleRestore(u.id)}
        />
      </div>

      {/* PAGINATION SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 pb-10">
        <p className="text-sm text-slate-500 font-medium">
          Hiển thị <b className="text-slate-900">{users.length}</b>{" "}
          trên tổng số <b>{meta?.total || 0}</b> học viên.
        </p>
        <GenericPagination
          meta={meta}
          onPageChange={(p) => reload(p)}
        />
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 0. Modal Thêm mới User */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
        isLoading={isCreating}
      />

      {/* 1. Modal chỉnh sửa */}
      <EditUserModal
        isLoading={isUpdating}
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => setIsEditModalOpen(false)}
        onSave={async (data) => {
          if (!selectedUser) return;
          setIsUpdating(true);
          try {
            await handleUpdate(selectedUser.id, data, () =>
              setIsEditModalOpen(false),
            );
          } finally {
            setIsUpdating(false);
          }
        }}
      />

      {/* 2. Modal xác nhận xóa */}
      <BaseConfirmModal
        isOpen={isDelUserOpen}
        onClose={() => setDelUserOpen(false)}
        onConfirm={handleDeleteUserConfirm}
        isLoading={isDeleting}
        title="Xóa người dùng"
        variant="danger"
        message={
          <>
            Bạn có chắc chắn muốn xóa tài khoản{" "}
            <b className="text-slate-800">{selectedUser?.fullName}</b>? Hành
            động này sẽ xóa vĩnh viễn dữ liệu và không thể khôi phục.
          </>
        }
        confirmText="Đồng ý xóa"
      />
    </div>
  );
}