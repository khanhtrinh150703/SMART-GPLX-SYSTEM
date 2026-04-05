"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";

/**
 * TableColumn: Định nghĩa cấu trúc cột
 * Dịch: Cấu hình cho từng cột của bảng
 */
export interface TableColumn<T> {
  header: string;
  // Accessor: có thể là tên thuộc tính (key) hoặc một hàm trả về giao diện (ReactNode)
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface GenericTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  className?: string;
}

/**
 * GenericTable: Bảng tổng quát
 * Ràng buộc: Dữ liệu truyền vào (T) BẮT BUỘC phải có thuộc tính 'id'
 */
export function GenericTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  className,
}: GenericTableProps<T>) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-white/50 backdrop-blur-md rounded-[2rem] shadow-soft border border-white/60",
        className
      )}
    >
      {/* Loading Overlay (Lớp phủ khi đang tải) */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <Loader2 className="text-emerald-600 animate-spin" size={32} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
              {columns.map((col, index) => (
                <th
                  key={`head-${index}`}
                  className={cn("px-6 py-5 font-black", col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/80 transition-all duration-300 group"
                >
                  {columns.map((col, index) => (
                    <td
                      key={`cell-${item.id}-${index}`}
                      className={cn("px-6 py-4 border-t border-slate-50/50", col.className)}
                    >
                      {/* FIX LỖI: Kiểm tra accessor là hàm hay là key */}
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor as keyof T] as React.ReactNode)}
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