"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, Filter, RotateCcw } from "lucide-react";
import axios from "axios";

// Components
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { QuestionFilter } from "@/components/ui/QuestionFilter/question.filter";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { Alert } from "@/components/ui/Alert";
import Button from "@/components/ui/Button/Button";
import { QuestionTable } from "./QuestionTable";

// Hooks & Config
import { useQuestions } from "../hooks/use-question";
import { useQuestionUrlParams } from "../hooks/use-question-url-params";
import { DIFFICULTY_OPTIONS, QUESTION_STATUS_OPTIONS } from "./question.config";
import { cn } from "@/lib/utils/utils";
import { QuestionFilterForm } from "@/components/ui/QuestionFilter/type";
import { Question } from "../types/question.types";
import { questionToolbarVariants as variants } from "./variants/question-toolbar.variants";
import { CreateQuestionModal } from "./CreateQuestionModal";
import { EditQuestionModal } from "./EditQuestionModal";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";

export function QuestionsContent() {
  const {
    searchParams,
    activeValue,
    activeField,
    updateMultipleUrlParams,
    handleSearchByField,
    clearFilters,
    getApiParams,
  } = useQuestionUrlParams();

  // --- 1. STATE MANAGEMENT ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(activeValue);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localActiveField, setLocalActiveField] = useState(activeField);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  // CHỈ DÙNG 1 BIẾN MESSAGE DUY NHẤT (Only one message state)
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  const [filterForm, setFilterForm] = useState<QuestionFilterForm>({
    chapterId: searchParams.get("chapterId") || "",
    licenseCategoryIds: searchParams.get("licenseCategoryIds") || "",
    difficultyLevel: searchParams.get("difficultyLevel") || "",
    isCritical: searchParams.get("isCritical") || "",
    indexNumber: searchParams.get("indexNumber") || "",
  });

  // --- 2. EFFECTS ---
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSearchValue(activeValue);
    setLocalActiveField(activeField);
    setFilterForm({
      chapterId: searchParams.get("chapterId") || "",
      licenseCategoryIds: searchParams.get("licenseCategoryIds") || "",
      difficultyLevel: searchParams.get("difficultyLevel") || "",
      isCritical: searchParams.get("isCritical") || "",
      indexNumber: searchParams.get("indexNumber") || "",
    });
  }, [searchParams, activeValue, activeField]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== activeValue) {
        handleSearchByField(localActiveField, searchValue);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue, localActiveField, activeValue, handleSearchByField]);

  // --- 3. DATA FETCHING ---
  const {
    questions = [],
    pagination,
    chapterOptions = [],
    licenseOptions = [],
    actions,
    isFetching,
  } = useQuestions(getApiParams());

  // --- 4. HANDLERS ---
  const handleApplyFilters = () => {
    updateMultipleUrlParams({
      ...filterForm,
      search: searchValue,
      field: localActiveField,
    });
    setIsFilterOpen(false);
  };

  const handleClearAll = () => {
    clearFilters();
    setSearchValue("");
    setFilterForm({
      chapterId: "",
      licenseCategoryIds: "",
      difficultyLevel: "",
      isCritical: "",
      indexNumber: "",
    });
  };

  const handleFilterChange = (updates: Partial<QuestionFilterForm>) => {
    setFilterForm((prev) => ({ ...prev, ...updates }));
  };

  // Hàm tiện ích nội bộ để bắt lỗi API nhanh gọn (Utility to extract API error)
  const getApiError = (error: unknown) => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi kết nối đến máy chủ"
      : "Đã xảy ra lỗi không xác định.";
  };

  const handleSaveQuestion = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      setMessage(null);

      await actions.create(formData);

      setIsCreateModalOpen(false);
      setMessage({
        intent: "success",
        text: "Hệ thống đã tạo câu hỏi mới thành công!",
      });
    } catch (error: unknown) {
      // Gọi hàm lấy đúng lỗi API (Get exact API error)
      setMessage({ intent: "error", text: getApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuestion = async (id: string, formData: FormData) => {
    try {
      setIsSubmitting(true);
      setMessage(null);

      await actions.update({ id, data: formData });

      // THÀNH CÔNG: Tắt Modal, xóa data tạm, và báo xanh ở Trang chủ
      setIsEditModalOpen(false);
      setSelectedQuestion(null);
      setMessage({
        intent: "success",
        text: "Cập nhật nội dung câu hỏi thành công!",
      });
    } catch (error: unknown) {
      // ❌ Không dùng setMessage ở đây nữa để tránh bị lỗi "Double Alert" (Thông báo kép)
      // setMessage({ intent: "error", text: getApiError(error) });

      // ✅ BẮT BUỘC PHẢI CÓ: Ném lỗi ngược lại cho EditQuestionModal bắt! (Throw error back to Modal)
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;

    try {
      setIsSubmitting(true);
      setMessage(null);

      await actions.delete(selectedQuestion.id);

      setIsDeleteModalOpen(false);
      setSelectedQuestion(null);
      setMessage({
        intent: "success",
        text: "Đã chuyển câu hỏi vào thùng rác thành công!",
      });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestore = async (question: Question) => {
    try {
      setIsSubmitting(true);
      setMessage(null);
      await actions.restore(question.id);

      setMessage({ intent: "success", text: "Khôi phục câu hỏi thành công!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 5. RENDER LOGIC
  // Sử dụng isFetching từ hook useQuestions và icon đã có sẵn
  if (!isMounted || (isFetching && questions.length === 0)) {
    return <SplashScreen variant="question" />;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
          <HelpCircle size={14} /> Smart-GPLX System
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Ngân hàng Câu hỏi <span className="text-emerald-500">.</span>
        </h1>
      </div>

      {/* Toolbar & Filter Section */}
      <div className={variants.root()}>
        <div className={variants.tabsContainer()}>
          <StatusTabs
            options={QUESTION_STATUS_OPTIONS}
            currentValue={searchParams.get("status") || "all"}
            onChange={(val) =>
              updateMultipleUrlParams({ status: val, page: 1 })
            }
          />
        </div>

        <div className={variants.mainToolbar()}>
          <div className="flex flex-1 items-center gap-3 w-full">
            <button
              onClick={() => {
                setSearchValue("");
                updateMultipleUrlParams({ search: "", status: "all", page: 1 });
                handleClearAll();
              }}
              className={variants.resetButton()}
              title="Đặt lại bộ lọc"
            >
              <RotateCcw
                size={18}
                className="group-hover:-rotate-180 transition-transform duration-500"
              />
            </button>

            <div className="flex-1">
              <ManagementToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onAddClick={() => setIsCreateModalOpen(true)}
                addLabel="Tạo câu hỏi"
                searchPlaceholder="Tìm kiếm câu hỏi..."
              />
            </div>

            <Button
              variant={isFilterOpen ? "primary" : "outline"}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                variants.filterButton(),
                isFilterOpen
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-200"
                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50",
              )}
            >
              <Filter
                size={18}
                className={cn(
                  "transition-transform",
                  isFilterOpen && "rotate-180",
                )}
              />
              <span>Bộ lọc nâng cao</span>
            </Button>
          </div>
        </div>

        {/* BỘ LỌC CHI TIẾT */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isFilterOpen ? "mt-4 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <QuestionFilter
            isOpen={isFilterOpen}
            chapterOptions={chapterOptions}
            licenseOptions={licenseOptions}
            difficultyOptions={DIFFICULTY_OPTIONS}
            filterForm={filterForm}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            onClear={handleClearAll}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>

        <div className="mt-4 px-6 flex justify-between items-center">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Tổng cộng: {pagination?.total || 0} câu hỏi hệ thống
          </span>
        </div>
      </div>

      {/* Alert Notification (Thông báo chung ngoài màn hình) */}
      {message && (
        <Alert
          intent={message.intent}
          message={message.text}
          onClose={() => setMessage(null)}
          duration={10000}
        />
      )}

      {/* Data Table Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/5">
        <QuestionTable
          questions={questions}
          page={Number(searchParams.get("page")) || 1}
          limit={10}
          isLoading={isFetching}
          onEdit={(question) => {
            setSelectedQuestion(question);
            setIsEditModalOpen(true);
          }}
          onDelete={(question) => {
            setSelectedQuestion(question);
            setIsDeleteModalOpen(true);
          }}
          onRestore={handleRestore}
          sortConfig={{
            key: (searchParams.get("sortBy") as keyof Question) || "createdAt",
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

      {/* SECTION: PAGINATION (Phân đoạn: Phân trang)  */}

      <div className="flex flex-col md:flex-row justify-end items-center gap-4 px-6 pb-10">
        <GenericPagination
          meta={{
            // 1. Lấy trang hiện tại từ URL (Current Page)
            page: Number(searchParams.get("page")) || 1,
            limit: 10,
            // 2. SỬ DỤNG ĐÚNG BIẾN 'pagination' (Correct Variable Reference)
            // Sử dụng Nullish Coalescing (??) để tránh lỗi khi data chưa về
            total: pagination?.total ?? 0,
            totalPages: pagination?.totalPages ?? 0,
            hasNextPage: pagination?.hasNextPage ?? false,
            hasPreviousPage: pagination?.hasPreviousPage ?? false,
          }}
          // 3. SỬ DỤNG ĐÚNG HÀM ĐIỀU HƯỚNG (Correct Navigation Function)
          onPageChange={(page) => updateMultipleUrlParams({ page })}
        />
      </div>

      {/* Modals */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveQuestion}
        isLoading={isSubmitting}
        chapters={chapterOptions}
        licenses={licenseOptions}
      />

      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuestion(null);
        }}
        initialData={selectedQuestion}
        onSave={handleUpdateQuestion}
        isLoading={isSubmitting}
        chapters={chapterOptions}
        licenses={licenseOptions}
      />

      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa câu hỏi"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        apiMessage={message}
        onApiMessageClose={() => setMessage(null)}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedQuestion(null);
          setMessage(null);
        }}
        message={
          <div className="space-y-3">
            <p className="text-slate-600">
              Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này sẽ đưa
              câu hỏi vào <b>Thùng rác</b>.
            </p>
            {selectedQuestion && (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-xs font-black text-rose-600 uppercase mb-1">
                  Nội dung câu hỏi:
                </p>
                <p className="text-sm text-slate-700 font-medium italic line-clamp-3">
                  {selectedQuestion.content}
                </p>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
