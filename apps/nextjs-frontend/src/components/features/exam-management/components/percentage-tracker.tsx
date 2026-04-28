// src/features/exam-management/components/percentage-tracker.tsx

import { cn } from "@/lib/utils/utils";

interface PercentageTrackerProps {
  current: number; // Tỉ trọng hiện tại (Current percentage)
}

/**
 * Thành phần theo dõi tổng tỉ trọng thời gian thực.
 * (Real-time percentage tracker component).
 */
export const PercentageTracker = ({ current }: PercentageTrackerProps) => {
  const isValid = current === 100;
  
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
      <span className="text-sm font-medium text-slate-600">Tổng tỉ trọng đã phân bổ:</span>
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-xl font-bold",
          isValid ? "text-emerald-600" : "text-amber-500"
        )}>
          {current}%
        </span>
        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", isValid ? "bg-emerald-500" : "bg-amber-500")}
            style={{ width: `${Math.min(current, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};