"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Zap, RotateCcw } from "lucide-react";
import axios from "axios";

// Components UI & Common
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { Alert } from "@/components/ui/Alert";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { Sheet } from "@/components/ui/Sheet/sheet";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { FilterSelect } from "@/components/ui/Select/FilterSelect";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";

// Feature Components
import { AutomaticGeneratorForm } from "./automatic-generator-form";
import { ExamTable } from "./ExamTable";

// Hooks, Types & Config
import { examGenerationToolbarVariants as variants } from "./exam-generation-toolbar.variants";
import { EXAM_STATUS_OPTIONS, EXAM_FILTER_FIELDS } from "./exam-config";
import { useExamMatrices } from "../../exam-management/hooks/use-exam-matrix";
import { useExamManagementUrlParams } from "../../exam-management/hooks/use-exam-management-url-params";
import { useExamGenerator } from "../hook/use-exam-generator";
import { IExamResponse } from "../types/exam-generation";

/**
 * @description Quản lý Sinh đề thi và Danh sách đề thi (Exam & Generation Management)
 * Kết hợp luồng sinh đề tự động và bảng hiển thị kết quả.
 */
export function ExamContent() {
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
  const [isPending, startTransition] = useTransition();
  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);

  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  // --- 2. TRUY VẤN DỮ LIỆU (DATA FETCHING) ---
  // Lấy danh sách ma trận cho Form sinh đề (Fetch matrices for the generator form)
  const { matrices = [] } = useExamMatrices({ limit: 100, status: "active" });

  // Lấy danh sách đề thi dựa trên URL params (Fetch exams based on URL parameters)
  const { exams, pagination, isLoading, isGenerating } =
    useExamGenerator(getApiParams());

  // --- 3. TIỆN ÍCH XỬ LÝ LỖI (ERROR UTILS) ---
  const getApiError = (error: unknown): string => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi máy chủ (Server Error)"
      : "Lỗi không xác định (Unknown Error).";
  };

  // --- 4. HIỆU ỨNG (EFFECTS) ---
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Đồng bộ trạng thái trong render phase (Syncing state during render phase)
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

  // --- 5. XỬ LÝ HÀNH ĐỘNG (ACTION HANDLERS) ---
  const handleOpenGenerator = () => {
    setMessage(null);
    setSheetOpen(true);
  };

  const handleEdit = (exam: IExamResponse) => {
    setMessage({
      intent: "warning",
      text: `Tính năng Sửa đề thi "${exam.name}" đang được phát triển.`,
    });
  };

  const handleDelete = (exam: IExamResponse) => {
    setMessage({
      intent: "error",
      text: `Yêu cầu xóa đề thi "${exam.name}" đã được ghi nhận (Demo).`,
    });
  };

  // --- 6. GIAO DIỆN (RENDER LOGIC) ---
  if (!isMounted || (isLoading && !exams.length)) {
    return <SplashScreen variant="question" />;
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      {/* HEADER SECTION */}
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
          Hệ thống lưu trữ và quản lý toàn bộ các bộ đề thi sát hạch đã được
          khởi tạo.
        </p>
      </div>

      {/* CONTROLS TOOLBAR */}
      <div className={variants.root()}>
        <div className={variants.tabsContainer()}>
          <StatusTabs
            options={EXAM_STATUS_OPTIONS}
            currentValue={searchParams.get("status") || "all"}
            onChange={(val) => updateUrlParam("status", val)}
          />
        </div>

        <div className={variants.mainToolbar()}>
          <div className="flex flex-1 items-center gap-2 w-full">
            <button
              onClick={clearFilters}
              className={variants.resetButton()}
              title="Đặt lại bộ lọc"
            >
              <RotateCcw size={18} />
            </button>

            <FilterSelect
              options={EXAM_FILTER_FIELDS}
              value={localActiveField}
              onChange={setLocalActiveField}
              variant="solid"
              className={variants.filterSelect()}
            />

            <div className="flex-[2]">
              <ManagementToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onAddClick={handleOpenGenerator}
                addLabel="Sinh đề mới"
                searchPlaceholder="Tìm kiếm đề thi..."
              />
            </div>
          </div>
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

      {/* DATA TABLE SECTION */}
      <ExamTable
        exams={exams}
        isLoading={isLoading || isPending}
        page={Number(searchParams.get("page")) || 1}
        limit={10}
        onView={handleEdit} // Gán tạm vào Edit
        onDelete={handleDelete}
        onRestore={(exam) =>
          setMessage({ intent: "success", text: `Khôi phục ${exam.name}` })
        }
        sortConfig={{
          key:
            (searchParams.get("sortBy") as keyof IExamResponse) ||
            "createdAt",
          direction:
            (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
        }}
        onSort={(key) => {
          const nextOrder =
            searchParams.get("sortOrder") === "asc" ? "desc" : "asc";
          updateMultipleUrlParams({ sortBy: key, sortOrder: nextOrder });
        }}
      />

      {/* PAGINATION SECTION */}
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
        title="Cấu hình Sinh đề Tự động"
      >
        <AutomaticGeneratorForm
          matrices={matrices}
          onClose={() => setSheetOpen(false)}
        />
      </Sheet>
    </div>
  );
}
