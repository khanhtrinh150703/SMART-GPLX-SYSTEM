"use client";

import React, { useMemo } from "react";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { getLicenseColumns } from "@/components/features/license/components/license-columns";
import { LicenseCategory } from "@/components/features/license/types/license-category.types";

/**
 * LicenseTableProps - Thêm page và limit vào Interface
 */
interface LicenseTableProps {
  licenses: LicenseCategory[];
  isLoading: boolean;
  page: number;   // <-- 1. THÊM DÒNG NÀY
  limit: number;  // <-- 2. THÊM DÒNG NÀY
  onEdit: (license: LicenseCategory) => void;
  onDelete: (license: LicenseCategory) => void;
  onRestore: (license: LicenseCategory) => void;
  sortConfig?: { key: keyof LicenseCategory; direction: "asc" | "desc" | null };
  onSort?: (key: keyof LicenseCategory) => void;
}

export const LicenseTable = ({
  licenses,
  isLoading,
  page,    // <-- 3. NHẬN PAGE Ở ĐÂY
  limit,   // <-- 4. NHẬN LIMIT Ở ĐÂY
  onEdit,
  onDelete,
  onRestore,
  sortConfig,
  onSort
}: LicenseTableProps) => {

  const columns = useMemo(
    // 5. TRUYỀN page và limit vào hàm getLicenseColumns
    () => getLicenseColumns(onEdit, onDelete, onRestore, page, limit),
    // 6. ĐỪNG QUÊN thêm page và limit vào dependencies để STT cập nhật khi chuyển trang
    [onEdit, onDelete, onRestore, page, limit], 
  );

  return (
    <GenericTable<LicenseCategory>
      columns={columns}
      data={licenses}
      isLoading={isLoading}
      className="bg-transparent"
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onEdit}
    />
  );
};