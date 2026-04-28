"use client";

import React from "react";
import { Loader2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  TableVariant,
  TableSize,
  TABLE_SIZES,
  TABLE_VARIANTS,
} from "./generic-table.variants";

/**
 * TableColumn Interface - Định nghĩa cấu trúc cột
 * accessor hỗ trợ cả chuỗi (key) và hàm (với index để làm STT)
 */
export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T, index: number) => React.ReactNode);
  className?: string;
  sortable?: boolean;
  sortKey?: keyof T;
}

interface GenericTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  className?: string;
  variant?: TableVariant;
  size?: TableSize;
  sortConfig?: { key: keyof T; direction: "asc" | "desc" | null };
  onRowClick?: (item: T) => void;
  onSort?: (key: keyof T) => void;
}

export function GenericTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  className,
  variant = "bordered",
  size = "sm",
  sortConfig,
  onRowClick,
  onSort,
}: GenericTableProps<T>) {
  const styles = TABLE_SIZES[size];

  // Hàm render Icon sắp xếp
  const renderSortIcon = (col: TableColumn<T>) => {
    if (!col.sortable || !onSort) return null;
    const key = col.sortKey || (typeof col.accessor === "string" ? col.accessor : null);
    if (!key) return null;

    if (sortConfig?.key !== key) {
      return (
        <ChevronsUpDown
          size={14}
          className="ml-2 opacity-20 group-hover:opacity-100 transition-opacity"
        />
      );
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} className="ml-2 text-emerald-500" />
    ) : (
      <ChevronDown size={14} className="ml-2 text-emerald-500" />
    );
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[2.5rem] border transition-all duration-500",
        TABLE_VARIANTS[variant],
        className
      )}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
          <Loader2 className="text-emerald-600 animate-spin" size={32} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0 table-auto">
          <thead>
            <tr className={cn("text-slate-400 uppercase tracking-[0.2em]", styles.text)}>
              {columns.map((col, index) => {
                const isSortable = col.sortable && onSort;
                const key = col.sortKey || (typeof col.accessor === "string" ? col.accessor : null);

                return (
                  <th
                    key={`head-${index}`}
                    className={cn(
                      "font-black transition-colors select-none align-middle border-b border-slate-100/50",
                      styles.th,
                      isSortable && "cursor-pointer hover:text-slate-900 group",
                      col.className
                    )}
                    onClick={() => isSortable && key && onSort(key as keyof T)}
                  >
                    <div className="flex items-center">
                      <span className="truncate">{col.header}</span>
                      {renderSortIcon(col)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className={cn("text-slate-600", styles.text)}>
            {data.length > 0 ? (
              // FIX: Nhận rowIndex ở đây để truyền xuống accessor
              data.map((item, rowIndex) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "hover:bg-black/[0.01] transition-all duration-300 group",
                    onRowClick && "cursor-pointer active:bg-slate-50"
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`cell-${item.id}-${colIndex}`}
                      className={cn(
                        "border-t border-slate-50 align-middle",
                        styles.td,
                        col.className
                      )}
                    >
                      <div className="flex items-center min-h-[24px]">
                        {typeof col.accessor === "function"
                          ? // TRUYỀN rowIndex vào đây để STT nhảy đúng 1, 2, 3...
                            col.accessor(item, rowIndex)
                          : (item[col.accessor as keyof T] as React.ReactNode)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              !isLoading && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-24 text-center text-slate-400 italic font-medium"
                  >
                    Chưa có dữ liệu hiển thị (No data available).
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}