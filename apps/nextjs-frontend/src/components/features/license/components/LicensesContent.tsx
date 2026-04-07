"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

// Components
import { LicenseTable } from "@/components/features/license/components/LicenseTable";
import CreateLicenseModal from "@/components/features/license/components/CreateLicenseModal";
import EditLicenseModal from "@/components/features/license/components/EditLicenseModal";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";
import { Alert } from "@/components/ui/Alert";
import { FilterSelect } from "@/components/ui/Select/FilterSelect";

// Hooks & Types
import { LICENSE_STATUS_OPTIONS } from "@/components/features/license/components/license.config";
import { useLicenseCategories } from "@/components/features/license/hook/use-license-categories";
import { useLicenseUrlParams } from "@/components/features/license/hook/use-license-url-params";
import { LicenseCategory } from "@/types/license-category.types";
import {
  CreateLicensePayload,
  UpdateLicensePayload,
} from "@/components/features/license/schema/license.schema";

export function LicensesContent() {
  const {
    searchParams,
    activeField,
    activeValue,
    updateUrlParam,
    updateMultipleUrlParams,
    handleSearchByField,
    getApiParams,
    FILTER_FIELDS,
  } = useLicenseUrlParams();

  // --- 1. QUẢN LÝ STATE ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(activeValue);
  const [localActiveField, setLocalActiveField] = useState(activeField);

  // State ghi nhớ để đồng bộ (Fix Cascading Render cho Search/Filter)
  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);

  const [selectedLicense, setSelectedLicense] =
    useState<LicenseCategory | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- 2. ĐỒNG BỘ TRONG RENDER (FIX CASCADING RENDERS) ---
  if (activeValue !== prevActiveValue || activeField !== prevActiveField) {
    setPrevActiveValue(activeValue);
    setPrevActiveField(activeField);
    setSearchValue(activeValue);
    setLocalActiveField(activeField);
  }

  // --- 3. EFFECTS ---
  // Fix lỗi: "Calling setState synchronously within an effect"
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Xử lý Debounce cho ô tìm kiếm
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

  // --- 4. DATA FETCHING ---
  const {
    result,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
  } = useLicenseCategories(getApiParams());

  // --- 5. HANDLERS ---
  const handleCreate = async (payload: CreateLicensePayload) => {
    const res = await createCategory.mutateAsync(payload);
    setMessage({ type: "success", text: "Thêm mới thành công!" });
    toast.success("Khởi tạo thành công!");
    return res;
  };

  const handleUpdate = async (payload: UpdateLicensePayload) => {
    if (!selectedLicense) return;
    const res = await updateCategory.mutateAsync({
      id: selectedLicense.id,
      data: payload,
    });
    setIsEditModalOpen(false); // 1. Đóng Modal ngay lập tức
    setMessage({ type: "success", text: "Cập nhật thành công!" });
    toast.success("Cập nhật thành công!");
    return res;
  };

  const handleDelete = async () => {
    if (!selectedLicense) return;
    try {
      await deleteCategory.mutateAsync(selectedLicense.id);
      setMessage({ type: "success", text: "Đã xóa hạng bằng lái!" });
      toast.success("Xóa thành công!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      const text = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Lỗi khi xóa!";
      toast.error(text);
      setMessage({ type: "error", text });
    }
  };

  const handleRestore = useCallback(
    async (license: LicenseCategory) => {
      try {
        await restoreCategory.mutateAsync(license.id);
        setMessage({ type: "success", text: "Khôi phục thành công!" });
        toast.success("Đã khôi phục hạng bằng lái!");
      } catch (error) {
        const text = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Lỗi khôi phục!";
        toast.error(text);
      }
    },
    [restoreCategory],
  );

  // --- 6. RENDER GIAO DIỆN ---
  if (!isMounted || (isLoading && !result)) {
    return <SplashScreen icon={CreditCard} message="Đang tải dữ liệu..." />;
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-600">
          <CreditCard size={28} />
          <span className="font-black tracking-widest uppercase text-[10px]">
            Smart-GPLX System
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Quản lý Hạng bằng lái <span className="text-emerald-500">.</span>
        </h1>
      </div>

      {/* TOOLBAR SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-soft">
        <StatusTabs
          options={LICENSE_STATUS_OPTIONS}
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
            addLabel="Thêm hạng"
            searchPlaceholder={`Tìm theo ${FILTER_FIELDS.find((f) => f.value === localActiveField)?.label.toLowerCase()}...`}
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

      {/* TABLE SECTION */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/5">
        <LicenseTable
          licenses={result?.data || []}
          page={Number(searchParams.get("page")) || 1}
          limit={10}
          isLoading={isLoading || deleteCategory.isPending}
          onEdit={(license) => {
            setSelectedLicense(license);
            setIsEditModalOpen(true);
          }}
          onDelete={(license) => {
            setSelectedLicense(license);
            setIsDeleteModalOpen(true);
          }}
          onRestore={handleRestore}
          sortConfig={{
            key:
              (searchParams.get("sortBy") as keyof LicenseCategory) || "name",
            direction:
              (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
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
      <div className="flex flex-col md:flex-row justify-end items-center gap-4 px-6 pb-10">
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

      {/* MODALS */}
      <CreateLicenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        isLoading={createCategory.isPending}
      />

      <EditLicenseModal
        key={selectedLicense?.id || "edit-modal"}
        isOpen={isEditModalOpen}
        license={selectedLicense}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        isLoading={updateCategory.isPending}
      />

      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={deleteCategory.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        message={
          <>
            Bạn có chắc muốn xóa{" "}
            <b className="text-slate-900">{selectedLicense?.name}</b>?
          </>
        }
      />
    </div>
  );
}
