// src/components/features/admin-users/components/UserPagination.tsx
import React from "react";
import { PaginationMeta } from "@/types/api.types";

interface UserPaginationProps {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

export const UserPagination = ({ meta, onPageChange }: UserPaginationProps) => {
  if (!meta) return null;

  return (
    <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
      <div>
        Hiển thị <span className="text-slate-900">{meta.limit}</span> trên tổng số <span className="text-slate-900">{meta.total}</span> kết quả
      </div>
      <div className="flex gap-2">
        <button
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(meta.page - 1)}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all"
        >
          Trước (Prev)
        </button>
        <button
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all"
        >
          Sau (Next)
        </button>
      </div>
    </div>
  );
};