"use client";

import React from "react";
import { Clock, Timer, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { timeCardVariants, iconWrapperVariants } from "./ResultTimeAnalytics.variants";

interface ResultTimeAnalyticsProps {
  timeSpent: number; // Thời gian làm bài (Giây - Seconds)
  timeRemaining: number; // Thời gian còn lại (Giây - Seconds)
  isAutoSubmit: boolean; // Cờ báo hiệu tự động nộp (Auto-Submit Flag)
}

/**
 * Helper to format seconds into MM:SS
 * Hàm hỗ trợ định dạng giây thành phút:giây
 */
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const ResultTimeAnalytics: React.FC<ResultTimeAnalyticsProps> = ({
  timeSpent,
  timeRemaining,
  isAutoSubmit,
}) => {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Time Stats Grid: 
        Mobile: Xếp chồng (1 cột) để thông tin to rõ.
        Tablet+: Chia đôi (2 cột) để cân bằng thị giác.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Card: Thời gian làm bài (Time Spent) */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={cn(timeCardVariants({ type: "spent" }), "group")}
        >
          <div className={cn(iconWrapperVariants({ type: "spent" }))}>
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              Thời gian làm bài
            </p>
            <p className="text-2xl font-black text-slate-800 tabular-nums">
              {formatTime(timeSpent)}
            </p>
          </div>
        </motion.div>

        {/* Card: Thời gian dư (Time Remaining) */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={cn(timeCardVariants({ type: "remaining" }), "group")}
        >
          <div className={cn(iconWrapperVariants({ type: "remaining" }))}>
            <Timer className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              Thời gian dư
            </p>
            <p className="text-2xl font-black text-slate-800 tabular-nums">
              {formatTime(timeRemaining)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Auto-Submit Banner: 
        Chỉ hiển thị khi hệ thống ép nộp bài. Sử dụng hiệu ứng Amber để cảnh báo.
      */}
      {isAutoSubmit && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl text-amber-800 shadow-sm"
        >
          <div className="bg-amber-100 p-1.5 rounded-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
          </div>
          <p className="text-sm font-semibold tracking-tight">
            <span className="font-black">Hết giờ!</span> Hệ thống đã tự động lưu kết quả của bạn.
          </p>
        </motion.div>
      )}
    </div>
  );
};