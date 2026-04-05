"use client";

import React, { useMemo } from "react";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { License } from "@/components/features/license/components/license.config";
import { getLicenseColumns } from "@/components/features/license/components/license-columns";

/**
 * LicenseTableProps - Thuộc tính cho bảng quản lý hạng bằng lái
 * @param {License[]} licenses - Danh sách hạng bằng (A1, B2...)
 * @param {boolean} isLoading - Trạng thái đang tải dữ liệu
 */
interface LicenseTableProps {
  licenses: License[];
  isLoading: boolean;
  onEdit: (license: License) => void;
  onDelete: (license: License) => void;
  onRestore: (license: License) => void;
}

/**
 * LicenseTable - Linh kiện hiển thị bảng danh sách hạng bằng lái
 * Sử dụng GenericTable để đảm bảo tính nhất quán về giao diện Emerald.
 */
export const LicenseTable = ({ 
  licenses, 
  isLoading, 
  onEdit, 
  onDelete, 
  onRestore 
}: LicenseTableProps) => {
  
  /**
   * Memoize columns: Tránh việc tính toán lại cấu hình cột mỗi khi re-render
   * (English: Optimize performance by memoizing column definitions)
   */
  const columns = useMemo(
    () => getLicenseColumns(onEdit, onDelete, onRestore),
    [onEdit, onDelete, onRestore]
  );

  return (
    <GenericTable<License>
      columns={columns}
      data={licenses}
      isLoading={isLoading}
      // Giữ bg-transparent để hòa quyện với lớp Glassmorphism của container cha
      className="bg-transparent"
    />
  );
};