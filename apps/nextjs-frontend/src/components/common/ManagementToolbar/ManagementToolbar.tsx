"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Loader2, LucideIcon, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { searchInputVariants, toolbarButtonVariants } from "./management-toolbar.variants";

/**
 * ManagementToolbarProps - Thuộc tính cho thanh công cụ quản lý.
 */
interface ManagementToolbarProps {
  // Logic tìm kiếm
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Nút thêm mới
  onAddClick: () => void;
  addLabel: string;
  addIcon?: LucideIcon;
  isLoading?: boolean;

  // Nút lọc (Tùy chọn)
  filterLabel?: string;
  onFilterClick?: () => void;
  
  className?: string;
}

export const ManagementToolbar = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  onAddClick,
  addLabel,
  addIcon: AddIcon = Plus,
  isLoading = false,
  filterLabel,
  onFilterClick,
  className
}: ManagementToolbarProps) => {
  
  // 1. Tạo State nội bộ để gõ chữ "mượt như lụa" (Local State for smooth typing)
  const [localSearch, setLocalSearch] = useState(searchValue);

  // 2. Đồng bộ localSearch khi searchValue từ bên ngoài thay đổi (ví dụ: Reset search)
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // 3. Hàm xử lý thay đổi văn bản
  const handleInputChange = (val: string) => {
    setLocalSearch(val);        // Cập nhật giao diện ngay lập tức (Instant UI Update)
    onSearchChange?.(val);      // Gửi lên trang cha để xử lý Debounce
  };

  // 4. Hàm xóa nhanh ô tìm kiếm
  const handleClear = () => {
    setLocalSearch("");
    onSearchChange?.("");
  };

  return (
    <div className={cn("flex items-center justify-between gap-4 w-full", className)}>
      <div className="flex items-center gap-3 flex-1">
        
        {/* Search Input Group */}
        <div className="relative group flex-1 max-w-md">
          <Search 
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
              localSearch ? "text-emerald-500" : "text-slate-400"
            )} 
            size={18} 
          />
          
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              searchInputVariants(),
              "pr-10" // Tạo khoảng trống bên phải cho nút X
            )}
          />

          {/* Nút Xóa nhanh (Clear Button) */}
          {localSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-lg transition-all active:scale-90"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {filterLabel && (
          <button 
            type="button"
            onClick={onFilterClick}
            className={toolbarButtonVariants({ intent: "secondary" })}
          >
            Bộ lọc: {filterLabel}
            <ChevronDown size={16} className="opacity-50" />
          </button>
        )}
      </div>

      {/* Main Action Button (Nút thêm mới) */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onAddClick}
        className={toolbarButtonVariants({ intent: "primary" })}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <AddIcon size={18} />
        )}
        <span className="hidden sm:inline">{addLabel}</span>
      </button>
    </div>
  );
};