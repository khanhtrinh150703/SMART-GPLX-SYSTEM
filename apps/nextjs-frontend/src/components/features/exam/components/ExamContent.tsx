"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { Zap, RotateCcw, Plus, Sparkles } from "lucide-react";
import axios from "axios";

// UI Components
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { Alert } from "@/components/ui/Alert";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { Sheet } from "@/components/ui/Sheet/sheet";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { FilterSelect } from "@/components/ui/Select/FilterSelect";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";
import Button from "@/components/ui/Button/Button";

// Feature Components
import { AutomaticGeneratorForm } from "./automatic-generator-form";
import { ExamTable } from "./ExamTable";

// Hooks & Logic
import { EXAM_STATUS_OPTIONS, EXAM_FILTER_FIELDS } from "./exam-config";
import {
  containerVariants,
  toolbarVariants,
  actionButtonVariants,
} from "./exam-content.variants";

import { examGenerationToolbarVariants as variants } from "./exam-generation-toolbar.variants";

import { ICreateManualExamDTO, IExamResponse } from "../types/exam.types";
import { useExamUrlParams } from "../hook/use-exam-url-params";
import { useExams } from "../hook/use-exams";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import { useExamActions } from "../hook/use-action";
import { ManualExamForm } from "./manual-form/ManualExamForm";
import { useSelectionPool } from "../hook/use-question-selection";
import { ISelectionPoolParams } from "@/types/paginaton.type";
import { GenerateExamInput } from "./exam-generation.schema";

/**
 * @description Component quản lý nội dung đề thi (Exam Content Management)
 * Tích hợp tìm kiếm, lọc, và điều phối sinh đề tự động.
 */
export function ExamContent() {
  // --- 1. HOOKS & PARAMS ---
  const {
    searchParams,
    activeValue,
    activeField,
    updateUrlParam,
    updateMultipleUrlParams,
    clearFilters,
    handleSearchByField,
    getApiParams,
  } = useExamUrlParams();

  const [queryParams, setQueryParams] = useState<ISelectionPoolParams>({
    licenseCategoryId: "",
    search: "",
    chapterId: "",
  });

  // Hook sẽ tự động "nhạy cảm" với sự thay đổi của queryParams
  const { data: pool } = useSelectionPool(queryParams);

  // --- 2. LOCAL STATE (TRẠNG THÁI NỘI BỘ) ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(activeValue);
  const [localActiveField, setLocalActiveField] = useState(
    activeField || "name",
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isManualSheetOpen, setManualSheetOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<IExamResponse | null>(null);
  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  const {
    isGenerating,
    actions: { generateAuto },
  } = useExamActions();

  // --- 3. DATA FETCHING (TRUY VẤN DỮ LIỆU) ---
  const apiParams = useMemo(() => getApiParams(), [getApiParams]);
  const { exams, pagination, isLoading, examMatrixOptions, licenseOptions } =
    useExams(apiParams);
  const {
    isMutating,
    actions: { delete: deletExam, createManual, update },
  } = useExamActions();
  // --- 4. EFFECTS (HIỆU ỨNG) ---

  // Hydration Fix: Đảm bảo component chỉ render khi đã mount ở client
  if (activeValue !== prevActiveValue || activeField !== prevActiveField) {
    setSearchValue(activeValue);
    setLocalActiveField(activeField || "name");
    setPrevActiveValue(activeValue);
    setPrevActiveField(activeField);
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sync state từ URL khi người dùng nhấn Back/Forward (URL State Synchronization)
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

  // Debounce Search Logic: Giảm tần suất gọi API khi người dùng gõ phím
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

  // Hàm tiện ích nội bộ để bắt lỗi API nhanh gọn (Utility to extract API error)
  const getApiError = (error: unknown) => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi kết nối đến máy chủ"
      : "Đã xảy ra lỗi không xác định.";
  };

  // --- 5. ACTION HANDLERS (HÀM XỬ LÝ HÀNH ĐỘNG) ---
  const handleOpenGenerator = () => {
    setMessage(null);
    setSheetOpen(true);
  };

  const handleAutoSubmit = async (data: GenerateExamInput) => {
    try {
      setMessage(null);

      await generateAuto(data);

      setMessage({
        intent: "success",
        text: "Đã tạo đề thi thành công!",
      });
      setSheetOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage({
          intent: "error",
          text: error.response?.data?.message || "Lỗi máy chủ",
        });
      } else {
        setMessage({
          intent: "error",
          text: "Đã xảy ra lỗi không xác định.",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deletExam(selectedId);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
      setMessage({ intent: "success", text: "Đã xóa ma trận thành công!" });
    } catch (error) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  const handleManualSubmit = async (data: ICreateManualExamDTO) => {
    try {
      if (selectedExam?.id) {
        await update({ id: selectedExam.id, data });
      } else {
        await createManual(data);
      }
      setManualSheetOpen(false);
      setSelectedExam(null);
      setMessage({ intent: "success", text: "Lưu đề thi thành công!" });
    } catch (error) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  const handleEdit = (exam: IExamResponse) => {
    // 1. Lưu dữ liệu đề thi vào state để truyền vào prop initialData
    setSelectedExam(exam);
    // 2. Mở Sheet tương ứng
    setManualSheetOpen(true);
  };

  // --- 6. SUB-RENDER FUNCTIONS (HÀM RENDER PHỤ) ---

  const renderHeader = () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-emerald-600">
        <Zap size={28} fill="currentColor" />
        <span className="font-black tracking-widest uppercase text-[10px]">
          Smart-GPLX System
        </span>
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">
        Quản lý Đề thi <span className="text-emerald-500">.</span>
      </h1>
      <p className="text-slate-500 text-sm max-w-2xl">
        Hệ thống lưu trữ và quản lý toàn bộ các bộ đề thi sát hạch đã được khởi
        tạo.
      </p>
    </div>
  );

  /**
   * @description Render thanh công cụ và thông tin tổng số (Toolbar & Stats Summary)
   * Vị trí: Thông tin tổng số nằm bên trái dưới Toolbar.
   */
  const renderToolbar = () => (
    <div className="flex flex-col gap-3">
      {/* 1. MAIN TOOLBAR CONTAINER */}
      <div className={toolbarVariants()}>
        {/* Nhóm Reset & Field Select (Reset & Filter Group) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearFilters}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95"
            title="Đặt lại bộ lọc (Reset filters)"
          >
            <RotateCcw size={20} />
          </button>

          <FilterSelect
            options={EXAM_FILTER_FIELDS}
            value={localActiveField}
            onChange={setLocalActiveField}
            variant="solid"
            className="h-12 border-none bg-slate-50 rounded-2xl font-bold text-slate-600 px-4 min-w-[140px]"
          />
        </div>

        {/* Thanh tìm kiếm (Search Bar) */}
        <div className="flex-1 max-w-xl">
          <ManagementToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            showAddButton={false}
            searchPlaceholder="Tìm kiếm đề thi theo tên hoặc mã đề..."
            className="h-12"
          />
        </div>

        {/* Cụm nút hành động (Action Buttons) */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <Button
            variant="outline"
            onClick={() => setManualSheetOpen(true)}
            className={actionButtonVariants({ intent: "manual" })}
          >
            <Plus size={18} /> Thủ công
          </Button>

          <Button
            onClick={handleOpenGenerator}
            className={actionButtonVariants({ intent: "auto" })}
          >
            <Sparkles size={18} className="fill-emerald-200" />
            Sinh đề tự động
          </Button>
        </div>
      </div>

      {/* 2. STATS ROW: Căn trái (Left-aligned stats) */}
      <div className={variants.statsContainer()}>
        <span className={variants.statsText()}>
          Tổng cộng: {pagination?.total || 0} ma trận đề thi
        </span>
      </div>
    </div>
  );

  // --- 7. MAIN RENDER ---
  if (!isMounted || (isLoading && !exams)) {
    return <SplashScreen variant="question" />;
  }

  return (
    <div className={containerVariants()}>
      {renderHeader()}

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2">
        <StatusTabs
          options={EXAM_STATUS_OPTIONS}
          currentValue={searchParams.get("status") || "all"}
          onChange={(val) => updateUrlParam("status", val)}
        />
      </div>

      {renderToolbar()}

      {message && (
        <Alert
          intent={message.intent}
          message={message.text}
          onClose={() => setMessage(null)}
          duration={10000}
        />
      )}

      {/* Table Section */}
      <ExamTable
        exams={exams}
        isLoading={isLoading || isPending}
        page={apiParams.page}
        limit={apiParams.limit}
        onView={handleEdit}
        onDelete={(exam) => {
          setSelectedId(exam.id);
          setIsDeleteModalOpen(true);
        }}
        onRestore={(exam) =>
          setMessage({ intent: "success", text: `Khôi phục ${exam.name}` })
        }
        sortConfig={{
          key: apiParams.sortBy as keyof IExamResponse,
          direction: apiParams.sortOrder,
        }}
        onSort={(key) => {
          const nextOrder = apiParams.sortOrder === "asc" ? "desc" : "asc";
          updateMultipleUrlParams({ sortBy: key, sortOrder: nextOrder });
        }}
      />

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

      {/* Side Drawer */}
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setMessage(null); // Reset thông báo khi đóng (Reset message on close)
        }}
        title="Cấu hình Sinh đề Tự động"
      >
        <AutomaticGeneratorForm
          // 1. Dữ liệu lựa chọn (Selection data)
          matrices={examMatrixOptions}
          // 2. Logic xử lý (Action logic)
          onSubmit={handleAutoSubmit}
          isLoading={isGenerating}
          // 3. Thông báo hệ thống (System notifications)
          apiMessage={message}
          onClearMessage={() => setMessage(null)}
          // 4. Điều khiển hiển thị (Visibility control)
          onClose={() => setSheetOpen(false)}
        />
      </Sheet>
      {isManualSheetOpen && ( // Sử dụng biến đồng nhất ở đây
        <Sheet
          isOpen={isManualSheetOpen} // Prop điều khiển hiển thị (Internal visibility)
          onClose={() => {
            setManualSheetOpen(false);
            setSelectedExam(null);
          }}
          title={
            selectedExam
              ? `Chỉnh sửa: ${selectedExam.name}`
              : "Tạo đề thi thủ công"
          }
        >
          <ManualExamForm
            // Key giúp React destroy và recreate component khi đổi mode (Idempotency)
            key={selectedExam?.id || "create-manual"}
            initialData={selectedExam}
            pool={pool ?? []}
            licenses={licenseOptions || []}
            onSubmit={handleManualSubmit}
            isLoading={isMutating}
            onClose={() => setManualSheetOpen(false)}
          />
        </Sheet>
      )}

      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận gỡ bỏ ma trận"
        apiMessage={message}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isMutating}
        onClose={() => setIsDeleteModalOpen(false)}
        message="Bạn có chắc chắn muốn xóa đề thi này? Thao tác này sẽ ẩn hoặc xóa vĩnh viễn đề thi."
      />
    </div>
  );
}
