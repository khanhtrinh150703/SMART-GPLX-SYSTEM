// src/components/features/admin-users/components/UserTable.tsx
import React from "react";
import { UserResponseDTO } from "@/types/user-respone";
import { UserTableRow } from "./UserTableRow";
import { Loader2 } from "lucide-react";

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
  onUnlock
}: UserTableProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 relative overflow-hidden">
      {/* Loading Overlay (Lớp phủ khi đang tải) */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl">
          <Loader2 className="text-emerald-600 animate-spin" size={40} />
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500 text-sm">
            <th className="pb-4 font-medium pl-2 w-10">
              <input type="checkbox" className="rounded" />
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
          {users.length > 0
            ? users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={() => onDelete(user)}
                  onUnlock={() => onUnlock(user)} 
                  onRestore={() => onRestore(user)}
                />
              ))
            : !isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-slate-400 font-medium"
                  >
                    Không tìm thấy dữ liệu người dùng (No users found).
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
};
