// src/components/common/ManagementToolbar/ManagementToolbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Loader2, LucideIcon, X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import Button from "@/components/ui/Button/Button";

interface ManagementToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAddClick: () => void;
  addLabel: string;
  addIcon?: LucideIcon;
  isLoading?: boolean;
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
  className,
}: ManagementToolbarProps) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleInputChange = (val: string) => {
    setLocalSearch(val);
    onSearchChange?.(val);
  };

  return (
    <div className={cn("flex items-center gap-3 w-full", className)}>
      {/* SEARCH INPUT GROUP: Thiết kế tối giản, bo góc 2xl */}
      <div className="relative group flex-1">
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
            "w-full h-12 pl-11 pr-10 bg-slate-100/50 border-none outline-none",
            "rounded-2xl text-sm font-bold text-slate-700 transition-all",
            "focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:shadow-inner-sm",
            "placeholder:text-slate-400 placeholder:font-medium"
          )}
        />

        {localSearch && (
          <button
            type="button"
            onClick={() => handleInputChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* NÚT THÊM MỚI: Dùng chuẩn Button Atom */}
      <Button
        onClick={onAddClick}
        isLoading={isLoading}
        variant="primary"
        className="h-12 px-6 rounded-2xl flex items-center gap-2 shrink-0 font-bold text-[13px] uppercase tracking-wider shadow-lg shadow-emerald-500/20"
      >
        {!isLoading && <AddIcon size={18} />}
        <span className="hidden md:inline">{addLabel}</span>
      </Button>
    </div>
  );
};