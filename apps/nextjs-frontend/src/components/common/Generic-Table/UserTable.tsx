// src/components/features/admin-users/components/UserTable.tsx
import React from "react";
import { UserResponseDTO } from "@/types/user-respone";
import { Loader2 } from "lucide-react";
import { UserTableRow } from "@/components/features/admin-users/components/UserTableRow";

interface UserTableProps {
  users: UserResponseDTO[];
  isLoading: boolean;
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
  onUnlock: (user: UserResponseDTO) => void;
  onRestore: (user: UserResponseDTO) => void;
}

export const UserTable = ({
  users,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
  onUnlock,
}: UserTableProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 relative overflow-hidden">
      {/* SECTION 1: LOADING OVERLAY (Lớp phủ khi đang tải) */}
      {/* Dịch: Hiển thị vòng xoay khi isLoading là true */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl">
          <Loader2 className="text-emerald-600 animate-spin" size={40} />
        </div>
      )}

      {/* SECTION 2: DATA TABLE (Bảng dữ liệu) */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500 text-sm">
            <th className="pb-4 font-medium pl-2 w-10">
              <input type="checkbox" className="rounded border-slate-300" />
            </th>
            <th className="pb-4 font-medium">Học viên (Student)</th>
            <th className="pb-4 font-medium text-center">Vai trò (Role)</th>
            <th className="pb-4 font-medium text-center">
              Trạng thái (Status)
            </th>
            <th className="pb-4 font-medium text-center">Thao tác (Action)</th>
          </tr>
        </thead>
        
        <tbody className="text-sm text-slate-700">
          {users.length > 0 ? (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                // Đồng bộ hóa tất cả các hàm callback
                // Dịch: Truyền hành động kèm theo object user tương ứng
                onEdit={() => onEdit(user)} 
                onDelete={() => onDelete(user)}
                onUnlock={() => onUnlock(user)}
                onRestore={() => onRestore(user)}
              />
            ))
          ) : (
            /* SECTION 3: EMPTY STATE (Trạng thái trống) */
            /* Dịch: Hiển thị thông báo khi không có dữ liệu và không trong quá trình tải */
            !isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="py-20 text-center text-slate-400 font-medium"
                >
                  Không tìm thấy dữ liệu người dùng (No users found).
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};