"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { paginationButtonVariants } from "./pagination.variants";

/**
 * Định nghĩa cấu trúc Meta từ API.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface GenericPaginationProps {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Thanh phân trang dùng chung - Phiên bản Ambient & Soft UI.
 */
export const GenericPagination = ({ 
  meta, 
  onPageChange, 
  className 
}: GenericPaginationProps) => {
  if (!meta || meta.totalPages <= 1) return null;

  // Tính toán số lượng bản ghi đang hiển thị (Logic: Showing X to Y of Z)
  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className={cn("flex justify-between items-center w-full px-2 py-4", className)}>
      
      {/* Thống kê (Dịch: Statistics) */}
      <div className="text-sm font-medium text-slate-400">
        Hiển thị <span className="text-slate-900 font-black">{from}-{to}</span> 
        {" "}trên <span className="text-slate-900 font-black">{meta.total}</span> kết quả
      </div>

      {/* Điều hướng (Dịch: Navigation) */}
      <div className="flex items-center gap-3">
        <button
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(meta.page - 1)}
          className={paginationButtonVariants({ intent: "secondary" })}
        >
          <ChevronLeft size={18} />
          Trước
        </button>

        <div className="flex items-center justify-center min-w-[3rem] text-sm font-black text-emerald-600 bg-emerald-50 h-10 px-4 rounded-2xl shadow-inner">
          {meta.page} / {meta.totalPages}
        </div>

        <button
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
          className={paginationButtonVariants({ intent: "secondary" })}
        >
          Sau
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};