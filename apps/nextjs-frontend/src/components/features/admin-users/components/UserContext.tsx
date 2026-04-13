"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Users } from "lucide-react";
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
import { userToolbarVariants as variants } from "./user-toolbar.variants";

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

  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Chuẩn hóa Type message (intent thay vì type)
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
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
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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

  // --- 5. DATA FETCHING ---
  const {
    result,
    isLoading,
    isDeleting,
    isUpdating,
    handleDelete,
    handleUnlock,
    handleRestore,
    handleUpdate,
    roleOptions = []
  } = useUsers(getApiParams() as UserQueryDTO);

  // --- 6. HANDLERS ---
  
  // Hàm trích xuất lỗi API chuẩn
  const getApiError = (error: unknown) => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi kết nối đến máy chủ"
      : "Đã xảy ra lỗi không xác định.";
  };

  const handleCreateUser = async (data: CreateUserPayload) => {
    try {
      setMessage(null);
      // Giả lập API delay (Thay bằng mutation thực tế khi có)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsCreateModalOpen(false);
      setMessage({ intent: "success", text: "Thêm mới học viên thành công!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
      throw error;
    }
  };

  const handleUpdateUser = async (data: AdminUpdatePayload) => {
    if (!selectedUser) return;
    try {
      setMessage(null);
      await handleUpdate.mutateAsync({ id: selectedUser.id, data });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setMessage({ intent: "success", text: "Cập nhật thành công!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
      throw error;
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUser) return;
    try {
      setMessage(null);
      await handleDelete.mutateAsync(selectedUser.id);
      
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      setMessage({ intent: "success", text: "Đã khóa/xóa người dùng thành công!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  const handleUnlockUser = async (user: UserResponseDTO) => {
    try {
      setMessage(null);
      await handleUnlock.mutateAsync(user.id);
      setMessage({ intent: "success", text: "Mở khóa tài khoản thành công!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  const handleRestoreUser = async (user: UserResponseDTO) => {
    try {
      setMessage(null);
      await handleRestore.mutateAsync(user.id);
      setMessage({ intent: "success", text: "Khôi phục tài khoản thành công!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  // --- 7. RENDER ---
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
      <div className={variants.root()}>
        <div className={variants.tabsContainer()}>
          <StatusTabs
            options={USER_STATUS_OPTIONS}
            currentValue={searchParams.get("status") || "all"}
            onChange={(val) => updateUrlParam("status", val)}
          />
        </div>

        <div className={variants.mainToolbar()}>
          <div className="flex flex-1 items-center gap-2 w-full">
            <button
              onClick={() => {
                setSearchValue("");
                setLocalActiveField("name");
                updateMultipleUrlParams({
                  search: "",
                  field: "name",
                  status: "all",
                  page: "1",
                });
              }}
              className={variants.resetButton()}
              title="Đặt lại bộ lọc"
            >
              <RotateCcw
                size={18}
                className="group-hover:-rotate-180 transition-transform duration-500"
              />
            </button>

            <FilterSelect
              options={FILTER_FIELDS}
              value={localActiveField}
              onChange={setLocalActiveField}
              variant="solid"
              className={variants.filterSelect()}
            />

            <div className="flex-[2]">
              <ManagementToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onAddClick={() => setIsCreateModalOpen(true)}
                addLabel="Thêm học viên"
                searchPlaceholder={`Tìm theo ${FILTER_FIELDS.find((f) => f.value === localActiveField)?.label?.toLowerCase()}...`}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 px-6">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Tổng cộng: {result?.meta?.total || 0} học viên
          </span>
        </div>
      </div>

      {/* ALERT TRANG (PAGE LEVEL) */}
      {message && (
        <Alert
          intent={message.intent} // Khớp type "intent"
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
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        } }
        onSave={handleUpdateUser}
        isLoading={isUpdating} 
        roleOptions={roleOptions}      
        />

      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận thao tác"
        variant="danger"
        onConfirm={handleDeleteUserConfirm}
        isLoading={isDeleting}
        // Truyền thông báo lỗi vào Modal
        apiMessage={message}
        onApiMessageClose={() => setMessage(null)}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
          setMessage(null); // Reset lỗi khi đóng Modal
        }}
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