// src/components/features/admin-users/components/UserTableRow.tsx
"use client";

import React from "react";
import { UserResponseDTO } from "@/types/user-respone";
import { Edit3, RotateCcw, Trash2, Unlock, Lock } from "lucide-react";
import Image from "next/image";
/**
 * Mục đích (Purpose): Component hiển thị một hàng thông tin người dùng.
 * Các hàm callback được thiết kế để nhận vào 'id' kiểu string đúng theo hook useUsers.
 */
interface UserTableRowProps {
  user: UserResponseDTO;
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (id: string) => void;
  onUnlock: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete?: (id: string) => void; // Thêm action xóa vĩnh viễn nếu cần
}

export const UserTableRow = ({
  user,
  onEdit,
  onDelete,
  onUnlock,
  onRestore,
  onPermanentDelete,
}: UserTableRowProps) => {
  return (
    <tr className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
      {/* 1. Cột Checkbox */}
      <td className="py-4 pl-2">
        <input
          type="checkbox"
          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
      </td>

      {/* 2. Cột Thông tin (Avatar + Name) */}
      <td className="py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm">
            <Image
              src={
                user.urlPicture ||
                `https://ui-avatars.com/api/?name=${user.fullName}`
              }
              alt={user.fullName}
              fill
              unoptimized // Giữ lại để tránh lỗi config domain
              className="object-cover" // Giúp ảnh không bị méo khi đưa vào hình tròn
            />
          </div>
        </div>
        <div className="truncate">
          <div className="font-semibold text-slate-900 truncate max-w-[150px]">
            {user.fullName}
          </div>
          <div className="text-slate-500 text-xs truncate max-w-[150px]">
            {user.email}
          </div>
        </div>
      </td>

      {/* 3. Cột Vai trò */}
      <td className="py-4 text-center">
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold text-[10px] uppercase">
          {user.roles[0]?.name || "N/A"}
        </span>
      </td>

      {/* 4. Cột Trạng thái */}
      <td className="py-4 text-center">
        <span
          className={`px-3 py-1 rounded-full font-medium text-xs border ${
            user.status === "active"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : user.status === "locked"
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-rose-50 text-rose-600 border-rose-200"
          }`}
        >
          {user.status === "active"
            ? "Hoạt động"
            : user.status === "locked"
              ? "Bị khóa"
              : "Đã xóa"}
        </span>
      </td>

      {/* 5. Cột Thao tác - Đã chỉnh sửa logic gọi hàm */}
      <td className="py-4 text-center">
        <div className="flex items-center justify-center gap-1">
          {/* Nút Sửa: Truyền object user */}
          {user.status !== "deleted" && (
            <button
              onClick={() => onEdit(user)}
              className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all active:scale-90"
              title="Chỉnh sửa (Edit)"
            >
              <Edit3 size={18} />
            </button>
          )}

          {/* Nút Khóa (Delete): Gọi onDelete(user.id) */}
          {user.status === "active" && (
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all active:scale-90"
              title="Khóa tài khoản (Lock)"
            >
              <Lock size={18} />
            </button>
          )}

          {/* Nút Mở khóa: FIX GỌI ĐÚNG onUnlock(user.id) */}
          {user.status === "locked" && (
            <button
              onClick={() => onRestore(user.id)}
              className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all active:scale-90"
              title="Mở khóa tài khoản (Unlock)"
            >
              <Unlock size={18} />
            </button>
          )}

          {/* Nút Khôi phục: Gọi onRestore(user.id) */}
          {user.status === "deleted" && (
            <>
              <button
                onClick={() => onUnlock(user.id)}
                className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all active:scale-90"
                title="Khôi phục (Restore)"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => onPermanentDelete?.(user.id)}
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-90"
                title="Xóa vĩnh viễn (Permanent Delete)"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
