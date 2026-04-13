"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, RotateCcw } from "lucide-react";
import axios from "axios";

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
import { Chapter } from "@/types/chapter.types";
import {
  CreateChapterPayload,
  UpdateChapterPayload,
} from "@/components/features/chapter/schema/chapter.schema";
import { chapterToolbarVariants as variants } from "./chapter-toolbar.variants";

export function ChapterContent() {
  const {
    searchParams,
    activeField,
    activeValue,
    updateUrlParam,
    updateMultipleUrlParams,
    handleSearchByField,
    getApiParams,
    FILTER_FIELDS,
  } = useChapterUrlParams();

  // --- 1. QUẢN LÝ STATE ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(activeValue);
  const [localActiveField, setLocalActiveField] = useState(activeField);

  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // CHỈ DÙNG 1 BIẾN MESSAGE DUY NHẤT (Only one message state)
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
    createChapter,
    updateChapter,
    deleteChapter,
    restoreChapter,
  } = useChapters(getApiParams());

  // --- 5. HANDLERS ---

  // Hàm trích xuất lỗi API chuẩn xác
  const getApiError = (error: unknown) => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi kết nối đến máy chủ"
      : "Đã xảy ra lỗi không xác định.";
  };

  const handleCreate = async (payload: CreateChapterPayload) => {
    try {
      setMessage(null);
      const res = await createChapter.mutateAsync(payload);
      setIsCreateModalOpen(false);
      setMessage({
        intent: "success",
        text: "Thêm mới chương bài học thành công!",
      });
      return res;
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
      throw error; // Bắn lỗi ra để form bên trong biết mà ngừng loading (nếu cần)
    }
  };

  const handleUpdate = async (payload: UpdateChapterPayload) => {
    if (!selectedChapter) return;
    try {
      setMessage(null);
      const res = await updateChapter.mutateAsync({
        id: selectedChapter.id,
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
    if (!selectedChapter) return;
    try {
      setMessage(null);
      await deleteChapter.mutateAsync(selectedChapter.id);
      setIsDeleteModalOpen(false);
      setMessage({ intent: "success", text: "Đã xóa chương bài học!" });
    } catch (error: unknown) {
      setMessage({ intent: "error", text: getApiError(error) });
    }
  };

  const handleRestore = useCallback(
    async (chapter: Chapter) => {
      try {
        setMessage(null);
        await restoreChapter.mutateAsync(chapter.id);
        setMessage({ intent: "success", text: "Khôi phục chương thành công!" });
      } catch (error: unknown) {
        setMessage({ intent: "error", text: getApiError(error) });
      }
    },
    [restoreChapter],
  );

  // --- 6. RENDER PHASE ---
  if (!isMounted || (isLoading && !result)) {
    return <SplashScreen variant="chapter"/>;
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
                updateMultipleUrlParams({ q: "", status: "all", page: "1" });
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
          isLoading={isLoading || deleteChapter.isPending}
          onEdit={(chapter) => {
            setSelectedChapter(chapter);
            setIsEditModalOpen(true);
          }}
          onDelete={(chapter) => {
            setSelectedChapter(chapter);
            setIsDeleteModalOpen(true);
          }}
          onRestore={handleRestore}
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
        onSave={handleCreate}
        isLoading={createChapter.isPending}
        // Truyền apiMessage vào đây nếu CreateChapterModal dùng BaseModal ở trong
        // apiMessage={message}
        // onApiMessageClose={() => setMessage(null)}
      />

      <EditChapterModal
        key={selectedChapter?.id || "edit-modal"}
        isOpen={isEditModalOpen}
        chapter={selectedChapter}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        isLoading={updateChapter.isPending}
      />

      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={deleteChapter.isPending}
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
