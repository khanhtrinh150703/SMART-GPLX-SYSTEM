"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CreditCard, Trash2, ShieldCheck } from "lucide-react"; // Dùng CreditCard cho GPLX
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";

// IMPORT: Các thành phần của License (Cập nhật đường dẫn thực tế của cậu)
import {
  License,
  LICENSE_STATUS_OPTIONS,
  MOCK_LICENSES,
} from "@/components/features/license/components/license.config";
import EditLicenseModal from "@/components/features/license/components/EditLicenseModal";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import {
  LicenseFormEditValues,
  LicenseFormValues,
} from "@/components/features/license/schema/license.schema";
import { LicenseTable } from "@/components/common/Generic-Table/LicenseTable";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import CreateLicenseModal from "@/components/features/license/components/CreateLicenseModal";

/**
 * LicensesPage - Trang quản lý các hạng giấy phép lái xe (GPLX)
 */
export default function LicensesPage() {
  // --- 1. STATES (Trạng thái) ---
  const [isMounted, setIsMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Quản lý Modal & Thực thể được chọn (License)
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- 2. LOGIC LỌC DỮ LIỆU ---
  const allFilteredResults = useMemo(() => {
    return MOCK_LICENSES.filter((license) => {
      const matchesTab = currentTab === "all" || license.status === currentTab;
      // Lọc theo tên hạng bằng (Ví dụ: A1, B2...)
      const matchesSearch = license.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [currentTab, searchTerm]);

  // --- 3. TÍNH TOÁN PHÂN TRANG ---
  const total = allFilteredResults.length;
  const totalPages = Math.ceil(total / pagination.limit);

  const paginatedLicenses = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    return allFilteredResults.slice(startIndex, startIndex + pagination.limit);
  }, [allFilteredResults, pagination.page, pagination.limit]);

  // --- 4. HANDLERS (Hàm xử lý) ---

  const handleEdit = (license: License) => {
    setSelectedLicense(license);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (license: License) => {
    setSelectedLicense(license);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateLicense = async (data: LicenseFormEditValues) => {
    if (!selectedLicense) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("✅ Cập nhật thành công Hạng bằng ID:", selectedLicense.id);
      setIsEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLicenseConfirm = async () => {
    if (!selectedLicense) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("🗑️ Đã xóa hạng bằng:", selectedLicense.name);
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateLicense = async (data: LicenseFormValues) => {
    setIsCreating(true);
    try {
      console.log("Dữ liệu tạo mới:", data);
      // Gọi API thêm mới ở đây...
      // await api.licenses.create(data);

      setIsCreateModalOpen(false); // Đóng Modal khi thành công
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const metaForPagination = {
    ...pagination,
    total,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPreviousPage: pagination.page > 1,
  };

  if (!isMounted) {
    return (
      <SplashScreen icon={CreditCard} message="Đang tải cấu hình bằng lái..." />
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-600">
          <CreditCard size={28} />
          <span className="font-black tracking-widest uppercase text-[10px]">
            Hệ thống quản lý Smart-GPLX
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Quản lý Hạng bằng lái <span className="text-emerald-500">.</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          Cấu hình các loại giấy phép lái xe (A1, A2, B1, B2...) và quy định sát
          hạch đi kèm.
        </p>
      </div>

      {/* CONTROL SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-soft">
        <StatusTabs
          size="md"
          shape="rounded"
          options={LICENSE_STATUS_OPTIONS}
          currentValue={currentTab}
          onChange={(val) => {
            setCurrentTab(val);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className="bg-slate-100/50"
        />

        <ManagementToolbar
          searchPlaceholder="Tìm hạng bằng (A1, B2...)"
          searchValue={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          addLabel="Thêm hạng mới"
          onAddClick={() => setIsCreateModalOpen(true)}
          isLoading={isLoading}
        />
      </div>

      {/* DATA SECTION */}
      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/5 transition-all duration-500">
        <LicenseTable
          licenses={paginatedLicenses}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onRestore={() => {}}
        />
      </div>

      {/* FOOTER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 pb-10">
        <p className="text-sm text-slate-500 font-medium">
          Hiển thị <b className="text-slate-900">{paginatedLicenses.length}</b>{" "}
          hạng bằng.
        </p>
        <GenericPagination
          meta={metaForPagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 1. Modal Chỉnh sửa License */}
      <EditLicenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        license={selectedLicense}
        onSave={handleUpdateLicense}
        isLoading={isSubmitting}
      />

      {/* 2. Modal Xác nhận Xóa License */}
      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteLicenseConfirm}
        isLoading={isSubmitting}
        title="Xác nhận xóa hạng bằng"
        variant="danger"
        icon={Trash2}
        message={
          <>
            Bạn có chắc chắn muốn xóa hạng bằng:{" "}
            <b className="text-slate-900">{selectedLicense?.name}</b>? Hành động
            này sẽ ảnh hưởng đến việc phân loại bộ đề thi.
          </>
        }
        confirmText="Xác nhận xóa"
      />
      <CreateLicenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateLicense}
        isLoading={isCreating}
      />
    </div>
  );
}
