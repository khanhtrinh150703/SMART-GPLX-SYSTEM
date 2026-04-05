"use client";

import React from "react";
import { Search, Plus, Loader2, LucideIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { searchInputVariants, toolbarButtonVariants, type ToolbarButtonProps } from "./management-toolbar.variants";

/**
 * Interface định nghĩa các thuộc tính cho Toolbar dùng chung.
 */
interface ManagementToolbarProps {
  // Logic tìm kiếm (Search Logic)
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Nút thêm mới (Add Button)
  onAddClick: () => void;
  addLabel: string;
  addIcon?: LucideIcon;
  isLoading?: boolean;

  // Nút lọc (Filter Button - Optional)
  filterLabel?: string;
  onFilterClick?: () => void;
  
  className?: string;
}

/**
 * Thanh công cụ quản lý (Management Toolbar) - Phiên bản Ambient & Borderless.
 * @returns {JSX.Element} Component Toolbar.
 */
export const ManagementToolbar = ({
  searchValue,
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
  return (
    <div className={cn("flex items-center justify-between gap-4 w-full", className)}>
      <div className="flex items-center gap-3 flex-1">
        
        {/* Search Input Group (Khối nhập liệu tìm kiếm) */}
        <div className="relative group">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" 
            size={18} 
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className={searchInputVariants()}
          />
        </div>

        {/* Filter Button (Nút lọc - Hiện khung khi hover) */}
        {filterLabel && (
          <button 
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
        disabled={isLoading}
        onClick={onAddClick}
        className={toolbarButtonVariants({ intent: "primary" })}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <AddIcon size={18} />
        )}
        {addLabel}
      </button>
    </div>
  );
};