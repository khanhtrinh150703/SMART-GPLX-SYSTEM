"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";
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
import { useChapters } from "@/components/features/chapter/hook/use-chapters";
import { useChapterUrlParams } from "@/components/features/chapter/hook/use-chapter-url-params";
import { Chapter } from "@/types/chapter.types";
import {
  CreateChapterPayload,
  UpdateChapterPayload,
} from "@/components/features/chapter/schema/chapter.schema";

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

  // State "trí nhớ" để đồng bộ (Fix lỗi Cascading Renders)
  const [prevActiveValue, setPrevActiveValue] = useState(activeValue);
  const [prevActiveField, setPrevActiveField] = useState(activeField);

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- 2. ĐỒNG BỘ TRONG RENDER (DỌN SẠCH CON RỒNG ĐỎ) ---
  if (activeValue !== prevActiveValue || activeField !== prevActiveField) {
    setPrevActiveValue(activeValue);
    setPrevActiveField(activeField);
    setSearchValue(activeValue);
    setLocalActiveField(activeField);
  }

  // --- 3. EFFECTS ---
  // Fix lỗi đồng bộ state trong Effect
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Debounce search: Theo dõi cả Chữ gõ và Trường chọn
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
  const handleCreate = async (payload: CreateChapterPayload) => {
    const res = await createChapter.mutateAsync(payload);
    setMessage({
      type: "success",
      text: "Thêm mới chương bài học thành công!",
    });
    toast.success("Khởi tạo thành công!");
    return res;
  };

  const handleUpdate = async (payload: UpdateChapterPayload) => {
    if (!selectedChapter) return;
    const res = await updateChapter.mutateAsync({
      id: selectedChapter.id,
      data: payload,
    });
    setIsEditModalOpen(false);
    setMessage({ type: "success", text: "Cập nhật thành công!" });
    toast.success("Cập nhật thành công!");
    return res;
  };

  const handleDelete = async () => {
    if (!selectedChapter) return;
    try {
      await deleteChapter.mutateAsync(selectedChapter.id);
      setMessage({ type: "success", text: "Đã xóa chương bài học!" });
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
    async (chapter: Chapter) => {
      try {
        await restoreChapter.mutateAsync(chapter.id);
        setMessage({ type: "success", text: "Khôi phục chương thành công!" });
        toast.success("Đã khôi phục chương bài học!");
      } catch (error) {
        const text = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Lỗi khôi phục!";
        toast.error(text);
      }
    },
    [restoreChapter],
  );

  // --- 6. RENDER PHASE ---
  if (!isMounted || (isLoading && !result)) {
    return (
      <SplashScreen icon={BookOpen} message="Đang tải dữ liệu chương..." />
    );
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-soft">
        <StatusTabs
          options={CHAPTER_STATUS_OPTIONS}
          currentValue={searchParams.get("status") || "all"}
          onChange={(val) => updateUrlParam("status", val)}
        />

        <div className="flex flex-1 items-center justify-end gap-3 w-full">
          <FilterSelect
            options={FILTER_FIELDS}
            value={localActiveField}
            onChange={(newField) => {
              setLocalActiveField(newField);
              // Nếu ô search có chữ, đổi trường phát là đẩy URL luôn
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
            addLabel="Thêm chương"
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
        onClose={() => setIsDeleteModalOpen(false)}
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
