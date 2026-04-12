// src/features/gplx-test/components/test-filter/index.tsx
"use client";

import React, { useState } from "react";
import { RotateCcw, Search, Plus } from "lucide-react";
import { filterVariants } from "./test-filter.variants";
import Button from "../ui/Button/Button";
import { cn } from "@/lib/utils/utils";

interface TestFilterProps {
  onCreate: () => void;
  onSearch: (value: string) => void;
}

const TestFilter: React.FC<TestFilterProps> = ({ onCreate, onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className={filterVariants.container()}>
      {/* NHÓM TRÁI: Tìm kiếm và Bộ lọc (Search & Filter Group) */}
      <div className={filterVariants.searchGroup()}>
        {/* Nút Reset (Reset Button) */}
        <button
          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
          title="Làm mới bộ lọc (Reset filters)"
        >
          <RotateCcw size={18} />
        </button>

        <div className={filterVariants.divider()} />

        {/* Ô nhập liệu (Search Input Field) */}
        <div className="flex items-center flex-1">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm chương bài học..."
            className={filterVariants.input()}
          />
        </div>
      </div>

      {/* NHÓM PHẢI: Hành động chính (Primary Action) */}
      <Button
        variant="primary"
        onClick={onCreate}
        className={cn(
          "h-12 px-6 rounded-[1.75rem]", // Bo góc đồng bộ với search bar (Inner Radius logic)
          "font-bold text-[13px] tracking-wide uppercase", // Giảm độ dày font để bớt "nặng"
          "shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 active:scale-95 transition-all"
        )}
      >
        <Plus size={18} className="mr-2" />
        Thêm chương
      </Button>
    </div>
  );
};

export default TestFilter;