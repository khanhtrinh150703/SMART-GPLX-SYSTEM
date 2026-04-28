"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Layers, RotateCcw } from "lucide-react";
import axios from "axios";

// Components UI & Common
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { Alert } from "@/components/ui/Alert";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import { Sheet } from "@/components/ui/Sheet/sheet";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { FilterSelect } from "@/components/ui/Select/FilterSelect";

// Feature Components
import { ExamMatrixForm } from "./exam-matrix-form";
import { ExamMatrixTable } from "./ExamMatrixTable";

// Hooks, Types & Config
import { useExamManagementUrlParams } from "../hooks/use-exam-management-url-params";
import {
  IExamMatrixRequest,
  IExamMatrixResponse,
} from "../types/exam-management";
import { useExamMatrices } from "../hooks/use-exam-matrix";
import { examMatrixToolbarVariants as variants } from "./exam-matrix-toolbar.variants";
import {
  EXAM_MATRIX_STATUS_OPTIONS,
  FILTER_FIELDS,
} from "./exam-matrix.config";

/**
 * @description Quản lý Ma trận đề thi (Exam Matrix Management)
 * Tuân thủ hệ thống thiết kế Emerald & Bộ khung giao diện chuẩn.
 */
export function ExamMatrixContent() {
  const {
    searchParams,
    activeValue,
    activeField,
    updateUrlParam,
    updateMultipleUrlParams,
    clearFilters,
    handleSearchByField,
    getApiParams,
  } = useExamManagementUrlParams();

  // --- 1. TRẠNG THÁI (STATE MANAGEMENT) ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(activeValue);
  const [localActiveField, setLocalActiveField] = useState(
    activeField || "name",
  );

  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [selectedMatrix, setSelectedMatrix] =
    useState<IExamMatrixRequest | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  // --- 2. TRUY VẤN DỮ LIỆU (DATA FETCHING) ---
  const {
    matrices,
    pagination,
    actions,
    isLoading,
    isMutating,
    chapterOptions = [],
    licenseOptions = [],
  } = useExamMatrices(getApiParams());

  // --- 3. HIỆU ỨNG (EFFECTS) ---
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // 1. Thêm state để theo dõi giá trị cũ (Previous state)
  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);

  // 2. Logic đồng bộ ngay trong Render Phase (Không dùng useEffect)
  // Cách này giúp React re-render ngay lập tức mà không cần commit ra DOM lần 1,
  // tránh được lỗi "cascading renders".
  if (activeValue !== prevActiveValue || activeField !== prevActiveField) {
    setSearchValue(activeValue);
    setLocalActiveField(activeField || "name");
    setPrevActiveValue(activeValue);
    setPrevActiveField(activeField);
  }

  // Debounce Search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== activeValue) {
        startTransition(() => {
          handleSearchByField(localActiveField, searchValue);
        });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue, activeValue, localActiveField, handleSearchByField]);

  // --- 4. XỬ LÝ HÀNH ĐỘNG (ACTION HANDLERS) ---
  const getApiError = (error: unknown) => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi máy chủ (Server Error)"
      : "Lỗi không xác định (Unknown Error).";
  };

  const handleOpenCreate = () => {
    setSelectedMatrix(null);
    setSelectedId(null);
    setSheetOpen(true);
  };

  const handleCreateExamMatrix = async (data: IExamMatrixRequest) => {
    try {
      setMessage(null);
      if (selectedId) {
        await actions.update({ id: selectedId, data });
        setMessage({ intent: "success", text: "Cập nhật ma trận thành công!" });
      } else {
        await actions.create(data);
        setMessage({ intent: "success", text: "Tạo ma trận mới thành công!" });
      }
      setSheetOpen(false);
    } catch (error) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await actions.delete(selectedId);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
      setMessage({ intent: "success", text: "Đã xóa ma trận thành công!" });
    } catch (error) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  // --- 5. GIAO DIỆN (RENDER LOGIC) ---
  if (!isMounted || (isLoading && !matrices)) {
    return <SplashScreen variant="question" />;
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-600">
          <Layers size={28} />
          <span className="font-black tracking-widest uppercase text-[10px]">
            Smart-GPLX System
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Ma trận Đề thi <span className="text-emerald-500">.</span>
        </h1>
      </div>

      {/* CONTROLS TOOLBAR (CHUẨN) */}
      <div className={variants.root()}>
        {/* Tab trạng thái */}
        <div className={variants.tabsContainer()}>
          <StatusTabs
            options={EXAM_MATRIX_STATUS_OPTIONS}
            currentValue={searchParams.get("status") || "all"}
            onChange={(val) => updateUrlParam("status", val)}
          />
        </div>

        <div className={variants.mainToolbar()}>
          <div className="flex flex-1 items-center gap-2 w-full">
            {/* Nút Reset */}
            <button
              onClick={() => {
                setSearchValue("");
                clearFilters();
              }}
              className={variants.resetButton()}
              title="Đặt lại bộ lọc"
            >
              <RotateCcw
                size={18}
                className="group-hover:-rotate-180 transition-transform duration-500"
              />
            </button>

            {/* Bộ lọc trường dữ liệu */}
            <FilterSelect
              options={FILTER_FIELDS}
              value={localActiveField}
              onChange={setLocalActiveField}
              variant="solid"
              className={variants.filterSelect()}
            />

            {/* Thanh tìm kiếm và nút Thêm mới */}
            <div className="flex-[2]">
              <ManagementToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onAddClick={handleOpenCreate}
                addLabel="Tạo ma trận mới"
                searchPlaceholder={`Tìm kiếm theo ${FILTER_FIELDS.find((f) => f.value === localActiveField)?.label.toLowerCase()}...`}
              />
            </div>
          </div>
        </div>

        {/* Thống kê số lượng */}
        <div className={variants.statsContainer()}>
          <span className={variants.statsText()}>
            Tổng cộng: {pagination?.total || 0} ma trận đề thi
          </span>
        </div>
      </div>

      {/* Alert Thông báo */}
      {message && (
        <Alert
          intent={message.intent}
          message={message.text}
          onClose={() => setMessage(null)}
          duration={5000}
        />
      )}

      {/* Data Table Section */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/[0.03] animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <ExamMatrixTable
          matrices={matrices}
          isLoading={isLoading || isPending}
          page={Number(searchParams.get("page")) || 1}
          limit={10}
          onEdit={(matrix) => {
            setSelectedMatrix(matrix as unknown as IExamMatrixRequest);
            setSelectedId(matrix.id);
            setSheetOpen(true);
          }}
          onDelete={(matrix) => {
            setSelectedId(matrix.id);
            setIsDeleteModalOpen(true);
          }}
          onRestore={async (matrix) => {
            try {
              await actions.restore(matrix.id);
              setMessage({ intent: "success", text: "Khôi phục thành công!" });
            } catch (error) {
              setMessage({ intent: "error", text: getApiError(error) });
            }
          }}
          sortConfig={{
            key:
              (searchParams.get("sortBy") as keyof IExamMatrixResponse) ||
              "createdAt",
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

      {/* Pagination */}
      <div className="flex justify-end px-8 pb-10">
        <GenericPagination
          meta={{
            page: Number(searchParams.get("page")) || 1,
            limit: 10,
            total: pagination?.total ?? 0,
            totalPages: pagination?.totalPages ?? 0,
            hasNextPage: pagination?.hasNextPage ?? false,
            hasPreviousPage: pagination?.hasPreviousPage ?? false,
          }}
          onPageChange={(page) => updateUrlParam("page", page)}
        />
      </div>

      {/* Side-over Sheet */}
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        title={selectedId ? "Cập nhật Ma trận" : "Thiết lập Ma trận mới"}
      >
        <ExamMatrixForm
          initialData={selectedMatrix || undefined}
          onSubmit={handleCreateExamMatrix}
          isLoading={isMutating}
          chapters={chapterOptions}
          licenses={licenseOptions}
        />
      </Sheet>

      {/* Confirm Modal */}
      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận gỡ bỏ ma trận"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isMutating}
        onClose={() => setIsDeleteModalOpen(false)}
        message="Bạn có chắc chắn muốn xóa cấu hình ma trận này? Thao tác này sẽ làm thay đổi cấu trúc sinh đề thi hiện tại."
      />
    </div>
  );
}
