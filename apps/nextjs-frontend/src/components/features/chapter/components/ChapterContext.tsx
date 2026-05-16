"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, RotateCcw } from "lucide-react";

// Components
import { ChapterTable } from "@/components/features/chapter/components/ChapterTable";
import CreateChapterModal from "@/components/features/chapter/components/CreateChapterModal";
import EditChapterModal from "@/components/features/chapter/components/EditChapterModal";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";
import { Alert } from "@/components/ui/Alert";
import { FilterSelect } from "@/components/ui/Select/FilterSelect";

// Hooks & Types
import { CHAPTER_STATUS_OPTIONS } from "@/components/features/chapter/components/chapter.config";
import { useChapters } from "@/components/features/chapter/hooks/use-chapters";
import { useChapterUrlParams } from "@/components/features/chapter/hooks/use-chapter-url-params";
import { Chapter } from "@/components/features/chapter/types/chapter.types";
import {
  CreateChapterPayload,
  UpdateChapterPayload,
} from "@/components/features/chapter/schema/chapter.schema";
import { chapterToolbarVariants as variants } from "./chapter-toolbar.variants";
import { useChapterActions } from "../hooks/use-chapter-actions";

export function ChapterContent() {
  // 1. Khởi tạo Hooks (Init Hooks)
  const {
    searchParams,
    activeField,
    activeValue,
    clearFilters,
    handleSearchByField,
    getApiParams,
    updateMultipleUrlParams,
    updateUrlParam,
    FILTER_FIELDS,
  } = useChapterUrlParams();

  // 2. Lớp dữ liệu (Data Layer - TanStack Query)
  const mutations = useChapters(getApiParams());
  const { result, isLoading } = mutations;

  // 3. Lớp hành động (Action Layer - Đã sửa theo mẫu chuẩn của ông)
  const {
    message,
    setMessage,
    onCreate,
    onUpdate,
    onDelete,
    onRestore,
    pendingStates,
  } = useChapterActions({
    create: mutations.createChapter,
    update: mutations.updateChapter,
    remove: mutations.deleteChapter,
    restore: mutations.restoreChapter,
  });

  // --- 1. QUẢN LÝ STATE GIAO DIỆN (UI State Management) ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(activeValue);
  const [localActiveField, setLocalActiveField] = useState(activeField);

  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- 2. ĐỒNG BỘ TRONG RENDER (Sync during render) ---
  if (activeValue !== prevActiveValue || activeField !== prevActiveField) {
    setPrevActiveValue(activeValue);
    setPrevActiveField(activeField);
    setSearchValue(activeValue);
    setLocalActiveField(activeField);
  }

  // --- 3. EFFECTS (Vòng đời & Debounce) ---
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== activeValue || localActiveField !== activeField) {
        handleSearchByField(localActiveField, searchValue);
      }
    }, 400); // Debounce (Trễ) 400ms để tối ưu API call
    return () => clearTimeout(handler);
  }, [
    searchValue,
    localActiveField,
    activeValue,
    activeField,
    handleSearchByField,
  ]);

  // --- 4. HANDLERS (Điều phối hành động) ---

  const handleCreateSubmit = async (payload: CreateChapterPayload) => {
    // Gọi onCreate từ Hook Action, Modal chỉ đóng khi thành công
    await onCreate(payload).then(() => setIsCreateModalOpen(false));
  };

  const handleUpdateSubmit = async (payload: UpdateChapterPayload) => {
    if (!selectedChapter) return;
    await onUpdate(selectedChapter.id, payload).then(() =>
      setIsEditModalOpen(false),
    );
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChapter) return;
    await onDelete(selectedChapter.id).then(() => setIsDeleteModalOpen(false));
  };

  const handleRestoreAction = useCallback(
    async (chapter: Chapter) => {
      await onRestore(chapter.id);
    },
    [onRestore],
  );

  // --- 6. RENDER PHASE ---
  if (!isMounted || (isLoading && !result)) {
    return <SplashScreen variant="chapter" />;
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-600">
          <BookOpen size={28} />
          <span className="font-black tracking-widest uppercase text-[10px]">
            Smart-GPLX System
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Quản lý Chương bài học <span className="text-emerald-500">.</span>
        </h1>
      </div>

      {/* CONTROLS TOOLBAR */}
      <div className={variants.root()}>
        <div className={variants.tabsContainer()}>
          <StatusTabs
            options={CHAPTER_STATUS_OPTIONS}
            currentValue={searchParams.get("status") || "all"}
            onChange={(val) => updateUrlParam("status", val)}
          />
        </div>

        <div className={variants.mainToolbar()}>
          <div className="flex flex-1 items-center gap-2 w-full">
            <button
              onClick={() => {
                setSearchValue("");
                clearFilters();
              }}
              className={variants.resetButton()}
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
                addLabel="Thêm chương mới"
                searchPlaceholder="Tìm kiếm nội dung..."
              />
            </div>
          </div>
        </div>

        <div className={variants.statsContainer()}>
          <span className={variants.statsText()}>
            Tổng cộng: {result?.meta?.total || 0} chương bài học
          </span>
        </div>
      </div>

      {/* ALERT SECTION CỦA TRANG */}
      {message && (
        <Alert
          intent={message.intent} // Đã sửa lại từ type -> intent cho đúng type
          message={message.text}
          onClose={() => setMessage(null)}
          duration={5000}
        />
      )}

      {/* TABLE SECTION */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/5">
        <ChapterTable
          chapters={result?.data || []}
          page={Number(searchParams.get("page")) || 1}
          limit={10}
          isLoading={isLoading || pendingStates.isDeleting}
          onEdit={(chapter) => {
            setSelectedChapter(chapter);
            setIsEditModalOpen(true);
          }}
          onDelete={(chapter) => {
            setSelectedChapter(chapter);
            setIsDeleteModalOpen(true);
          }}
          onRestore={handleRestoreAction}
          sortConfig={{
            key: (searchParams.get("sortBy") as keyof Chapter) || "name",
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

      {/* MODALS SECTION */}
      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSubmit}
        isLoading={pendingStates.isCreating}
        // Truyền apiMessage vào đây nếu CreateChapterModal dùng BaseModal ở trong
        // apiMessage={message}
        // onApiMessageClose={() => setMessage(null)}
      />

      <EditChapterModal
        key={selectedChapter?.id || "edit-modal"}
        isOpen={isEditModalOpen}
        chapter={selectedChapter}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateSubmit}
        isLoading={pendingStates.isUpdating}
      />

      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        isLoading={pendingStates.isDeleting}
        // BẮT BUỘC PHẢI THÊM 2 DÒNG NÀY ĐỂ TRUYỀN LỖI VÀO MODAL
        apiMessage={message}
        onApiMessageClose={() => setMessage(null)}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMessage(null); // Reset thông báo khi đóng
        }}
        message={
          <>
            Bạn có chắc muốn xóa chương{" "}
            <b className="text-slate-900">{selectedChapter?.name}</b>?
          </>
        }
      />
    </div>
  );
}
