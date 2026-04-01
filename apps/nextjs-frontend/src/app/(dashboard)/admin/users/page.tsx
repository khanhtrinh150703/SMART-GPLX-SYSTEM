// src/app/(dashboard)/admin/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { UserToolbar } from "@/components/features/admin-users/components/UserToolbar";
import { UserTable } from "@/components/features/admin-users/components/UserTable";
import { StatusTabs } from "@/components/features/admin-users/components/StatusTabs";
import { UserPagination } from "@/components/features/admin-users/components/UserPagination";
import EditUserModal from "@/components/features/admin-users/components/EditUserModal";
import DeleteConfirmModal from "@/components/features/admin-users/components/DeleteConfirmModal";
import { useUsers } from "@/components/features/admin-users/hooks/useUsers";
import { UserResponseDTO } from "@/types/user-respone";

export default function AdminUserManagementPage() {
  /**
   * 1. BỔ SUNG: Lấy thêm handleUnlock và handleRestore từ Hook.
   * Đây là các "vũ khí" để thực hiện hành động hoàn tác.
   */
  const {
    users,
    meta,
    isLoading,
    isDeleting,
    reload,
    handleDelete,
    handleUnlock, // Mới
    handleRestore, // Mới
    handleUpdate,
    status,
    changeStatus,
  } = useUsers();

  const [isMounted, setIsMounted] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex gap-6 max-w-7xl mx-auto min-h-[600px] animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Quản lý người dùng
          </h1>

          <div className="flex items-center justify-between">
            <StatusTabs currentStatus={status} onStatusChange={changeStatus} />
            <UserToolbar isLoading={isLoading} />
          </div>
        </div>

        {/* 2. BỔ SUNG: Truyền onUnlock và onRestore vào UserTable. 
          Nếu không truyền ở đây, UserTable sẽ báo lỗi "not a function".
        */}
        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={(u) => {
            setSelectedUser(u);
            setIsEditModalOpen(true);
          }}
          onDelete={(u) => {
            setSelectedUser(u);
            setIsDeleteModalOpen(true);
          }}
          onUnlock={(u) => handleUnlock(u.id)} // Mới: Thực hiện mở khóa
          onRestore={(u) => handleRestore(u.id)} // Mới: Thực hiện khôi phục
        />

        <UserPagination meta={meta} onPageChange={(p) => reload(p)} />
      </div>

      {/* MODAL CHỈNH SỬA */}
      <EditUserModal
        isLoading={isUpdating}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave ={async (data) => {
          if (selectedUser) {
            await handleUpdate(selectedUser.id, data, () => {
              setIsEditModalOpen(false);
            });
          }
        }}
      />

      {/* MODAL XÁC NHẬN XÓA */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (selectedUser) {
            await handleDelete(selectedUser.id);
            setIsDeleteModalOpen(false);
          }
        }}
        isLoading={isDeleting}
        userName={selectedUser?.fullName || ""}
      />
    </div>
  );
}
