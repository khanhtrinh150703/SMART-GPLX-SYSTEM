"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { StatusTabs } from "@/components/ui/StatusTabs/StatusTabs";
import { ManagementToolbar } from "@/components/common/ManagementToolbar/ManagementToolbar";
import { GenericPagination } from "@/components/common/Pagination/GenericPagination";
import SplashScreen from "@/components/common/Loaders/SplashScreen"; // Thêm Splash Screen

import {
  Chapter,
  CHAPTER_STATUS_OPTIONS,
  MOCK_CHAPTERS,
} from "@/components/features/chapter/components/chapter.config";
import { ChapterTable } from "@/components/features/chapter/components/ChapterTable";

// IMPORT: Các thành phần Modals
import EditChapterModal from "@/components/features/chapter/components/EditChapterModal";
import BaseConfirmModal from "@/components/common/Modals/BaseConfirmModal";
import CreateChapterModal from "@/components/features/chapter/components/CreateChapterModal";
import { ChapterFormEditValues, CreateChapterPayload } from "@/components/features/chapter/schema/chapter.schema";

/**
 * ChaptersPage - Trang quản lý danh sách chương học
 */
export default function ChaptersPage() {
  // --- 1. STATES (Trạng thái) ---
  const [isMounted, setIsMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Trạng thái Loading
  const [isLoading, setIsLoading] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isCreating, setIsCreating] = useState(false); // Trạng thái riêng cho tạo mới

  // Phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Quản lý Modals & Thực thể được chọn
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State mở form tạo mới

  // Tránh lỗi Hydration & Mô phỏng load
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 400); 
    return () => clearTimeout(timer);
  }, []);

  // --- 2. LOGIC LỌC DỮ LIỆU ---
  const allFilteredResults = useMemo(() => {
    return MOCK_CHAPTERS.filter((chapter) => {
      const matchesTab = currentTab === "all" || chapter.status === currentTab;
      const matchesSearch = chapter.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [currentTab, searchTerm]);

  // --- 3. TÍNH TOÁN PHÂN TRANG ---
  const total = allFilteredResults.length;
  const totalPages = Math.ceil(total / pagination.limit);

  const paginatedChapters = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    return allFilteredResults.slice(startIndex, startIndex + pagination.limit);
  }, [allFilteredResults, pagination.page, pagination.limit]);

  // --- 4. HANDLERS (Hàm xử lý) ---
  
  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsDeleteModalOpen(true);
  };

  // Hàm xử lý TẠO MỚI chương học
  const handleCreateChapter = async (data: CreateChapterPayload) => {
    setIsCreating(true);
    try {
      // Gọi API thực tế ở đây: await axios.post('/api/chapters', data)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("✅ Đã tạo chương mới:", data);
      setIsCreateModalOpen(false); // Đóng modal khi thành công
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateChapter = async (data: ChapterFormEditValues) => {
    if (!selectedChapter) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("✅ Cập nhật thành công Chapter ID:", selectedChapter.id);
      setIsEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChapterConfirm = async () => {
    if (!selectedChapter) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("🗑️ Đã xóa chương học:", selectedChapter.title);
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
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

  // MÀN HÌNH CHỜ (SPLASH SCREEN)
  if (!isMounted) {
    return <SplashScreen icon={BookOpen} message="Đang tải dữ liệu chương học..." />;
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in zoom-in-95 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-emerald-600">
          <BookOpen size={28} />
          <span className="font-black tracking-widest uppercase text-[10px]">
            Hệ thống quản lý Smart-GPLX
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Quản lý Chương học <span className="text-emerald-500">.</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          Thiết lập cấu trúc các chương mục đào tạo cho bộ đề ôn tập lý thuyết.
        </p>
      </div>

      {/* CONTROL SECTION (Tabs & Toolbar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-soft">
        <StatusTabs
          size="md"
          shape="rounded"
          options={CHAPTER_STATUS_OPTIONS}
          currentValue={currentTab}
          onChange={(val) => {
            setCurrentTab(val);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className="bg-slate-100/50"
        />

        <ManagementToolbar
          searchPlaceholder="Tìm tên chương..."
          searchValue={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          addLabel="Thêm chương mới"
          onAddClick={() => setIsCreateModalOpen(true)} // Gọi State mở Modal Thêm mới
          isLoading={isLoading}
        />
      </div>

      {/* DATA SECTION: Bảng dữ liệu chính */}
      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden ring-1 ring-black/5 transition-all duration-500 hover:shadow-emerald">
        <ChapterTable
          chapters={paginatedChapters}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onRestore={() => {}}
        />
      </div>

      {/* FOOTER SECTION: Phân trang */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 pb-10">
        <p className="text-sm text-slate-500 font-medium">
          Hiển thị <b className="text-slate-900">{paginatedChapters.length}</b> trên tổng số <b>{total}</b> kết quả.
        </p>
        <GenericPagination
          meta={metaForPagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 1. Modal Thêm mới Chapter */}
      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateChapter}
        isLoading={isCreating}
      />

      {/* 2. Modal Chỉnh sửa Chapter */}
      <EditChapterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        chapter={selectedChapter}
        onSave={handleUpdateChapter}
        isLoading={isSubmitting}
      />

      {/* 3. Modal Xác nhận Xóa Chapter */}
      <BaseConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteChapterConfirm}
        isLoading={isSubmitting}
        title="Xác nhận xóa chương"
        variant="danger"
        icon={Trash2}
        message={
          <>
            Bạn có chắc chắn muốn xóa chương:{" "}
            <b className="text-slate-900">{selectedChapter?.title}</b>? 
            Hành động này sẽ ảnh hưởng đến các câu hỏi thuộc chương này.
          </>
        }
        confirmText="Xóa vĩnh viễn"
      />
    </div>
  );
}