import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

/**
 * Interface định nghĩa cột dữ liệu (Column Definition).
 */
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  isLoading?: boolean;
}

/**
 * Bảng dữ liệu dùng chung (Generic Data Table) cho Chapter/License.
 * @template T - Kiểu dữ liệu của bản ghi (Generic Type).
 */
export function GenericTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete,
  isLoading 
}: GenericTableProps<T>) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white/80 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 border-b border-slate-200/60">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={cn("p-6 text-slate-500 font-semibold uppercase text-xs tracking-wider", col.className)}>
                {col.header}
              </th>
            ))}
            <th className="p-6 text-right text-slate-500 font-semibold uppercase text-xs tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="p-10 text-center text-slate-400">Không có dữ liệu (No records).</td></tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="group hover:bg-emerald-50/30 transition-colors duration-200">
                {columns.map((col, idx) => (
                  <td key={idx} className={cn("p-6 text-slate-700", col.className)}>
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                <td className="p-6 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(item)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}