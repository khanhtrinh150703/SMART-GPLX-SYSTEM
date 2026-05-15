"use client";

import React, { useMemo } from "react";
import { UserResponseDTO } from "@/components/features/admin-users/types/user-respone";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { getUserColumns } from "./user-columns";

export interface UserTableProps {
  users: UserResponseDTO[];
  isLoading: boolean;
  page: number; // Thêm page
  limit: number; // Thêm limit
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
  onUnlock: (user: UserResponseDTO) => void;
  onRestore: (user: UserResponseDTO) => void;
  sortConfig?: { key: keyof UserResponseDTO; direction: "asc" | "desc" | null };
  onSort?: (key: keyof UserResponseDTO) => void;
}

export const UserTable = ({
  users,
  isLoading,
  page,
  limit,
  onEdit,
  onDelete,
  onUnlock,
  onRestore,
  sortConfig,
  onSort,
}: UserTableProps) => {
  // Memoize columns để tránh render lại vô ích
  // Cần thêm page và limit vào dependency array để STT cập nhật khi chuyển trang
  const columns = useMemo(
    () => getUserColumns(onEdit, onDelete, onUnlock, onRestore, page, limit),
    [onEdit, onDelete, onUnlock, onRestore, page, limit],
  );

  return (
    <GenericTable<UserResponseDTO>
      columns={columns}
      data={users}
      isLoading={isLoading}
      className="bg-transparent"
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onEdit}
    />
  );
};
