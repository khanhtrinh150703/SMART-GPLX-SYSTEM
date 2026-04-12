"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, RotateCcw } from "lucide-react";
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
import { useLicenseCategories } from "@/components/features/license/hooks/use-license-categories";
import { useLicenseUrlParams } from "@/components/features/license/hooks/use-license-url-params";
import { LicenseCategory } from "@/types/license-category.types";
import {
  CreateLicensePayload,
  UpdateLicensePayload,
} from "@/components/features/license/schema/license.schema";
import { licenseToolbarVariants as variants } from "./license-toolbar.variants";

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

  const [selectedLicense, setSelectedLicense] = useState<LicenseCategory | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Chuẩn hóa type thành 'intent'
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  // --- 2. ĐỒNG BỘ TRONG RENDER ---
  if (activeValue !== prevActiveValue || activeField !== prevActiveField) {
    setPrevActiveValue(activeValue);
    setPrevActiveField(activeField);
    setSearchValue(activeValue);
    setLocalActiveField(activeField);
  }

  // --- 3. EFFECTS ---
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
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
  
  // Hàm trích xuất lỗi API
  const getApiError = (error: unknown) => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi kết nối đến máy chủ"
      : "Đã xảy ra lỗi không xác định.";
  };

  const handleCreate = async (payload: CreateLicensePayload) => {
    try {
      setMessage(null);
      const res = await createCategory.mutateAsync(payload);
      setIsCreateModalOpen(false);
      setMessage({ intent: "success", text: "Thêm mới hạng bằng lái thành công!" });
      return res;
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
      throw error;
    }
  };

  const handleUpdate = async (payload: UpdateLicensePayload) => {
    if (!selectedLicense) return;
    try {
      setMessage(null);
      const res = await updateCategory.mutateAsync({
        id: selectedLicense.id,
        data: payload,
      });
      setIsEditModalOpen(false);
      setMessage({ intent: "success", text: "Cập nhật thành công!" });
      return res;
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedLicense) return;
    try {
      setMessage(null);
      await deleteCategory.mutateAsync(selectedLicense.id);
      setIsDeleteModalOpen(false);
      setMessage({ intent: "success", text: "Đã xóa hạng bằng lái!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  const handleRestore = useCallback(
    async (license: LicenseCategory) => {
      try {
        setMessage(null);
        await restoreCategory.mutateAsync(license.id);
        setMessage({ intent: "success", text: "Khôi phục thành công!" });
      } catch (error: unknown) {
        setMessage({ intent: "error", text: getApiError(error) });
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
      <div className={variants.root()}>
        <div className={variants.tabsContainer()}>
          <StatusTabs
            options={LICENSE_STATUS_OPTIONS}
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
                addLabel="Thêm hạng"
                searchPlaceholder="Từ khóa ..."
              />
            </div>
          </div>
        </div>

        <div className="mt-2 px-6">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Tổng cộng: {result?.meta?.total || 0} Hạng bằng lái
          </span>
        </div>
      </div>

      {/* ALERT SECTION */}
      {message && (
        <Alert
          intent={message.intent} // Đã sửa lại từ type -> intent
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
        // Thêm phần này để đẩy lỗi vào Modal (Push error into modal)
        apiMessage={message}
        onApiMessageClose={() => setMessage(null)}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMessage(null); // Reset thông báo khi đóng
        }}
        message={
          <>
            Bạn có chắc muốn xóa hạng{" "}
            <b className="text-slate-900">{selectedLicense?.name}</b>?
          </>
        }
      />
    </div>
  );
}