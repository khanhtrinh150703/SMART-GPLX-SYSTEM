"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPopoverProps {
  label: string;
  filterKey: string; // Tên Key sẽ hiện trên URL (ví dụ: 'minAge', 'name')
  options: FilterOption[];
  selectedValue: string;
  onSelect: (key: string, value: string) => void;
  onReset: (key: string) => void;
}

export const FilterPopover = ({ label, filterKey, options, selectedValue, onSelect, onReset }: FilterPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài (Close on click outside)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Nút bấm (Trigger) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 h-11 rounded-2xl border transition-all text-sm font-bold",
          selectedValue !== "all" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm" 
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
        )}
      >
        <Filter size={14} className={selectedValue !== "all" ? "text-emerald-500" : "text-slate-400"} />
        <span className="max-w-[100px] truncate">{label}: {options.find(o => o.value === selectedValue)?.label || "Tất cả"}</span>
        <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 p-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="py-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
            Lọc theo {label}
          </div>
          
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSelect(filterKey, opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all mb-1",
                  selectedValue === opt.value 
                    ? "bg-emerald-50 text-emerald-600 font-bold" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {opt.label}
                {selectedValue === opt.value && <Check size={14} />}
              </button>
            ))}
          </div>

          {selectedValue !== "all" && (
            <button 
              onClick={() => {
                onReset(filterKey);
                setIsOpen(false);
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all border-t border-slate-50 pt-3"
            >
              <RotateCcw size={12} /> Đặt lại bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
};