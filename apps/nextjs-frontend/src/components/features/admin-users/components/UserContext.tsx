"use client";

import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

// Components
import { UserTable } from "@/components/features/admin-users/components/UserTable";
import CreateUserModal from "@/components/features/admin-users/components/CreateUserModal";
import EditUserModal from "@/components/features/admin-users/components/EditUserModal";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";
import { Alert } from "@/components/ui/Alert";
import { FilterSelect } from "@/components/ui/Select/FilterSelect";

// Hooks & Types
import { USER_STATUS_OPTIONS } from "@/components/features/admin-users/components/users.config";
import { useUsers } from "@/components/features/admin-users/hooks/use-users";
import { useUserUrlParams } from "@/components/features/admin-users/hooks/use-user-url-params";
import { UserResponseDTO } from "@/types/user-respone";
import {
  AdminUpdatePayload,
  CreateUserPayload,
} from "@/components/features/admin-users/schema/user.schema";
import { UserQueryDTO } from "@/types/query-user";

export default function AdminUserManagementPage() {
  // --- 1. QUẢN LÝ URL & PARAMS ---
  const {
    searchParams,
    activeField,
    activeValue,
    updateUrlParam,
    updateMultipleUrlParams,
    handleSearchByField,
    getApiParams,
    FILTER_FIELDS,
  } = useUserUrlParams();

  // --- 2. QUẢN LÝ STATE ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(activeValue);
  const [localActiveField, setLocalActiveField] = useState(activeField);

  // State đồng bộ URL (Fix Cascading Render)
  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);

  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- 3. LOGIC ĐỒNG BỘ TRONG RENDER ---
  if (activeValue !== prevActiveValue || activeField !== prevActiveField) {
    setPrevActiveValue(activeValue);
    setPrevActiveField(activeField);
    setSearchValue(activeValue);
    setLocalActiveField(activeField);
  }

  // --- 4. EFFECTS ---
  // Fix lỗi Hydration
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== activeValue || localActiveField !== activeField) {
        handleSearchByField(localActiveField, searchValue);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [
    searchValue,
    localActiveField,
    activeValue,
    activeField,
    handleSearchByField,
  ]);

  // --- 5. DATA FETCHING (Dùng TanStack Query) ---
  const {
    result,
    isLoading,
    isDeleting,
    isUpdating,
    handleDelete,
    handleUnlock,
    handleRestore,
    handleUpdate,
  } = useUsers(getApiParams() as UserQueryDTO); // Đã ép kiểu chuẩn

  // --- 6. HANDLERS ---
  const handleCreateUser = async (data: CreateUserPayload) => {
    try {
      // Giả lập API delay (Thay bằng mutation của bạn khi có)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsCreateModalOpen(false);
      setMessage({ type: "success", text: "Thêm mới học viên thành công!" });
      toast.success("Khởi tạo thành công!");
    } catch (error) {
      toast.error("Lỗi khi tạo người dùng!");
    }
  };

  const handleUpdateUser = async (data: AdminUpdatePayload) => {
    if (!selectedUser) return;
    try {
      await handleUpdate.mutateAsync({ id: selectedUser.id, data });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setMessage({ type: "success", text: "Cập nhật thành công!" });
      toast.success("Cập nhật thành công!");
    } catch (error) {
      const text = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Lỗi cập nhật!";
      toast.error(text);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUser) return;
    try {
      await handleDelete.mutateAsync(selectedUser.id);
      setIsDeleteModalOpen(false);
      setMessage({ type: "success", text: "Đã xóa người dùng!" });
      toast.success("Xóa thành công!");
    } catch (error) {
      const text = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Lỗi khi xóa!";
      toast.error(text);
      setMessage({ type: "error", text });
    }
  };

  const handleUnlockUser = async (user: UserResponseDTO) => {
    try {
      await handleUnlock.mutateAsync(user.id);

      // Ghi message cho đồng bộ với Alert
      setMessage({ type: "success", text: "Mở khóa tài khoản thành công!" });
      toast.success("Mở khóa thành công!");
    } catch (error) {
      const text = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Lỗi khi mở khóa!";
      toast.error(text);
      setMessage({ type: "error", text });
    }
  };

  const handleRestoreUser = async (user: UserResponseDTO) => {
    try {
      await handleRestore.mutateAsync(user.id);

      // Ghi message cho đồng bộ với Alert
      setMessage({ type: "success", text: "Khôi phục tài khoản thành công!" });
      toast.success("Khôi phục thành công!");
    } catch (error) {
      const text = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Lỗi khi khôi phục!";
      toast.error(text);
      setMessage({ type: "error", text });
    }
  };
  // --- MÀN HÌNH CHỜ ---
  if (!isMounted || (isLoading && !result)) {
    return (
      <SplashScreen icon={Users} message="Đang tải danh sách học viên..." />
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-600">
          <Users size={28} />
          <span className="font-black tracking-widest uppercase text-[10px]">
            Smart-GPLX System
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Quản lý người dùng <span className="text-emerald-500">.</span>
        </h1>
      </div>

      {/* TOOLBAR SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-soft">
        <StatusTabs
          options={USER_STATUS_OPTIONS}
          currentValue={searchParams.get("status") || "all"}
          onChange={(val) => updateUrlParam("status", val)}
        />

        <div className="flex flex-1 items-center justify-end gap-3 w-full">
          <FilterSelect
            options={FILTER_FIELDS}
            value={localActiveField}
            onChange={(newField) => {
              setLocalActiveField(newField);
              if (searchValue.trim() !== "") {
                handleSearchByField(newField, searchValue);
              }
            }}
            variant="solid"
            size="base"
            className="shrink-0 min-w-[130px]"
          />

          <ManagementToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onAddClick={() => setIsCreateModalOpen(true)}
            addLabel="Thêm học viên"
            searchPlaceholder={`Tìm theo ${FILTER_FIELDS.find((f) => f.value === localActiveField)?.label?.toLowerCase()}...`}
          />
        </div>
      </div>

      {message && (
        <Alert
          intent={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
          duration={5000}
        />
      )}

      {/* DATA SECTION */}
      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/5">
        <UserTable
          users={result?.data || []}
          page={Number(searchParams.get("page")) || 1}
          limit={10}
          isLoading={isLoading || isDeleting}
          onEdit={(u) => {
            setSelectedUser(u);
            setIsEditModalOpen(true);
          }}
          onDelete={(u) => {
            setSelectedUser(u);
            setIsDeleteModalOpen(true);
          }}
          onUnlock={handleUnlockUser}
          onRestore={handleRestoreUser}
          sortConfig={{
            key:
              (searchParams.get("sortBy") as keyof UserResponseDTO) ||
              "fullName",
            direction:
              (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
          }}
          onSort={(key) => {
            const currentOrder = searchParams.get("sortOrder");
            const nextOrder =
              searchParams.get("sortBy") === key && currentOrder === "asc"
                ? "desc"
                : "asc";
            updateMultipleUrlParams({ sortBy: key, sortOrder: nextOrder });
          }}
        />
      </div>

      {/* PAGINATION SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 pb-10">
        <p className="text-sm text-slate-500 font-medium">
          Hiển thị <b className="text-slate-900">{result?.data?.length || 0}</b>{" "}
          trên tổng số <b>{result?.meta?.total || 0}</b> học viên.
        </p>
        <GenericPagination
          meta={{
            page: Number(searchParams.get("page")) || 1,
            limit: 10,
            total: result?.meta?.total || 0,
            totalPages: result?.meta?.totalPages || 0,
            hasNextPage: result?.meta?.hasNextPage || false,
            hasPreviousPage: result?.meta?.hasPreviousPage || false,
          }}
          onPageChange={(page) => updateUrlParam("page", page)}
        />
      </div>

      {/* --- MODALS SECTION --- */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
        isLoading={false}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateUser}
        isLoading={isUpdating}
      />

      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận thao tác"
        variant="danger"
        onConfirm={handleDeleteUserConfirm}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        message={
          <>
            Bạn có chắc chắn muốn khóa/xóa tài khoản{" "}
            <b className="text-slate-800">{selectedUser?.fullName}</b>?
          </>
        }
        confirmText="Xác nhận"
      />
    </div>
  );
}
