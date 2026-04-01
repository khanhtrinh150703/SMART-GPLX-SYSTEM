// src/components/features/admin-users/components/StatusTabs.tsx
"use client";

import React from "react";
import { UserQueryDTO } from "@/types/query-user"; // Đảm bảo import đúng path

/**
 * Mục đích (Purpose): Định nghĩa các thuộc tính cho Component chuyển đổi trạng thái.
 * Đồng bộ hóa kiểu dữ liệu với UserQueryDTO để đảm bảo Type-Safety.
 */
interface StatusTabsProps {
  currentStatus: UserQueryDTO["status"]; // Sử dụng kiểu dữ liệu cụ thể thay vì string
  onStatusChange: (status: UserQueryDTO["status"]) => void; // Đồng bộ tham số hàm
}

export const StatusTabs = ({ currentStatus, onStatusChange }: StatusTabsProps) => {
  // Danh sách các Tab tương ứng với các giá trị hợp lệ trong DTO
  const tabs: { id: UserQueryDTO["status"]; label: string; color?: string }[] = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Hoạt động", color: "text-emerald-600" },
    { id: "locked", label: "Bị khóa", color: "text-amber-600" },
    { id: "deleted", label: "Thùng rác", color: "text-rose-600" },
  ];

  return (
    <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
      {tabs.map((tab) => {
        const isActive = currentStatus === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              isActive
                ? `bg-white ${tab.color || "text-emerald-600"} shadow-sm`
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};