"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Ngôn ngữ Tiếng Việt (Vietnamese locale)
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverClose,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils/utils";

interface DateRangePickerProps {
  onChange: (range: { from?: Date; to?: Date }) => void;
}

/**
 * Bộ chọn khoảng thời gian dạng Nút Nhỏ (Compact Date Range Picker)
 * Tích hợp react-day-picker với Emerald Theme
 */
export const DateRangePicker = ({ onChange }: DateRangePickerProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  // Xử lý khi người dùng click chọn ngày trên lịch (Handle date selection)
  const handleSelect = (selected: DateRange | undefined) => {
    setDate(selected);
    onChange({ from: selected?.from, to: selected?.to });
  };

  // Xóa bộ lọc ngày (Clear date filter)
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn Popover mở/đóng liên tục
    setDate(undefined);
    onChange({ from: undefined, to: undefined });
  };

  const hasDateSelected = !!date?.from;
  const tooltipText = hasDateSelected
    ? `${format(date.from!, "dd/MM/yyyy")} ${
        date.to ? `- ${format(date.to, "dd/MM/yyyy")}` : ""
      }`
    : "Lọc theo ngày...";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative group">
        <PopoverTrigger asChild>
          <button
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all shadow-sm active:scale-[0.98] focus:outline-none",
              hasDateSelected
                ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                : "border-slate-200 text-slate-500 bg-white hover:text-emerald-600 hover:border-emerald-200"
            )}
            title={tooltipText}
          >
            <CalendarIcon size={18} />
            {hasDateSelected && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>
        </PopoverTrigger>

        {/* Nút X nhanh để xóa ngày mà không cần mở lịch (Quick clear button) */}
        {hasDateSelected && (
          <button
            onClick={handleClear}
            className="absolute -top-2 -right-2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-all z-10"
            title="Xóa khoảng thời gian"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <PopoverPortal>
        <PopoverContent
          className="w-auto p-4 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 bg-white z-[100] animate-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 duration-200 origin-top-right"
          align="end"
          sideOffset={8}
        >
          {/* 
            Cấu hình Giao diện Lịch (Calendar UI Configuration)
            Ghi đè class của react-day-picker bằng Tailwind để khớp với Emerald Theme
          */}
          <DayPicker
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            locale={vi} // Đổi sang tiếng Việt
            numberOfMonths={1}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-bold text-slate-900 capitalize",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-transparent p-0 text-slate-500 hover:text-emerald-600 transition-colors flex items-center justify-center rounded-lg hover:bg-emerald-50",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-slate-500 rounded-md w-9 font-medium text-[0.8rem] capitalize",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-emerald-50 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl",
              day: "h-9 w-9 p-0 font-medium rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors aria-selected:opacity-100",
              day_range_start: "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white focus:bg-emerald-600 focus:text-white",
              day_range_end: "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white focus:bg-emerald-600 focus:text-white",
              day_selected: "bg-emerald-50 text-emerald-900",
              day_today: "text-emerald-600 bg-slate-50 font-black",
              day_outside: "text-slate-300 opacity-50",
              day_disabled: "text-slate-300 opacity-50",
              day_hidden: "invisible",
            }}
          />

          {/* Dải phân cách & Nút Đóng (Divider & Close Button) */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
            <PopoverClose asChild>
              <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                Xong
              </button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};