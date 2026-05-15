"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogOut, ArrowLeft, Send, Menu, X, Timer } from "lucide-react";
import ActionMotion from "@/components/ui/ActionMotion/ActionMotion";
import { SidebarQuestion } from "../../types/sidebar.types";
import { asideVariants, timerVariants } from "./exam-sidebar.variants";
import { cn } from "@/lib/utils/utils";

interface ExamSidebarProps {
  questions: SidebarQuestion[];
  currentIndex: number;
  answers: Record<string, number | undefined>;
  timeRemaining: number;
  isReviewMode: boolean;
  isAutoNext: boolean;
  isLoading?: boolean;
  // Thêm 2 thuộc tính mới (Add 2 new properties)
  timeSpent?: number;
  totalTime?: number;
  onNavigate: (index: number) => void;
  onToggleAutoNext: () => void;
  onExit: () => void;
  onFinish?: () => void;
}

export const ExamSidebar = ({
  questions,
  currentIndex,
  answers,
  timeRemaining,
  isReviewMode,
  isAutoNext,
  isLoading = false,
  timeSpent = 0,
  totalTime = 0, // Giá trị mặc định (Default value)
  onNavigate,
  onToggleAutoNext,
  onExit,
  onFinish,
}: ExamSidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const isTimeLow = timeRemaining < 300 && !isReviewMode;

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timerStatus = isReviewMode ? "review" : isTimeLow ? "low" : "normal";

  return (
    <>
      {/* Nút điều khiển Mobile */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-24 right-6 z-[60] w-14 h-14 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-95 transition-all border-2 border-white/20 backdrop-blur-sm"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Lớp phủ mờ (Overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(asideVariants({ isMobileOpen }))}>
        {/* Header Sidebar */}
        <div className="p-6 flex justify-end bg-slate-50/30">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
          >
            {isReviewMode ? "Thoát Review" : "Thoát"} <LogOut size={14} />
          </button>
        </div>

        {/* Timer Section */}
        <div className="px-8 pb-6 flex flex-col items-center bg-slate-50/30 border-b border-slate-50">
          {isReviewMode ? (
            // Giao diện khi ở chế độ Review (Review Mode UI)
            <div className="flex flex-col w-full items-center">
              <div className="text-3xl font-black text-slate-800 tracking-tight">
                {formatTime(timeSpent)}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 mb-4 flex items-center gap-1.5">
                <Clock size={12} />
                Thời gian làm bài
              </span>
              
              <div className="w-full bg-white border border-slate-100 shadow-sm rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Timer size={14} /> T.Gian Bài Thi
                </span>
                <span className="text-sm font-black text-slate-700">
                  {formatTime(totalTime)}
                </span>
              </div>
            </div>
          ) : (
            // Giao diện khi đang làm bài (Normal Mode UI)
            <>
              <div className={cn(timerVariants({ status: timerStatus }))}>
                {formatTime(timeRemaining)}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-1.5">
                <Clock size={12} />
                Thời gian còn lại
              </span>

              <div
                onClick={onToggleAutoNext}
                className="mt-5 flex items-center gap-3 cursor-pointer group bg-white px-4 py-2 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all shadow-sm"
              >
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                    isAutoNext ? "text-emerald-600" : "text-slate-400"
                  )}
                >
                  {isAutoNext ? "Auto Next: ON" : "Auto Next: OFF"}
                </span>
                <div
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-colors duration-300",
                    isAutoNext ? "bg-emerald-500" : "bg-slate-200"
                  )}
                >
                  <motion.div
                    animate={{ x: isAutoNext ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Question Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q: SidebarQuestion, idx: number) => {
              const isCurrent = currentIndex === idx;
              const isAnswered = answers[q.questionId] !== undefined;
              let btnClass = "";

              if (isReviewMode) {
                const correctAnswer = "correctAnswer" in q ? (q.correctAnswer as number) : undefined;
                const isCorrect = answers[q.questionId] === correctAnswer;

                if (isCurrent) btnClass = "bg-slate-800 text-white scale-110 shadow-lg z-10";
                else if (!isAnswered) btnClass = "bg-slate-50 text-slate-300 ring-1 ring-slate-200 border border-dashed border-slate-300";
                else if (isCorrect) btnClass = "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-400 shadow-sm";
                else btnClass = "bg-rose-100 text-rose-600 ring-2 ring-rose-400 shadow-sm";
              } else {
                btnClass = isCurrent
                  ? "bg-emerald-500 text-white shadow-[0_8px_15px_rgba(16,185,129,0.3)] scale-110 z-10"
                  : isAnswered
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-300 shadow-sm"
                  : "bg-white text-slate-400 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-600";
              }

              return (
                <button
                  key={q.questionId}
                  onClick={() => {
                    onNavigate(idx);
                    if (window.innerWidth < 1024) setIsMobileOpen(false);
                  }}
                  className={cn(
                    "aspect-square rounded-xl text-[14px] font-bold flex items-center justify-center leading-none transition-all duration-300",
                    btnClass
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-white border-t border-slate-50 relative z-20">
          {isReviewMode ? (
            <ActionMotion
              variant="slate"
              label="QUAY LẠI KẾT QUẢ"
              icon={<ArrowLeft size={18} />}
              onClick={onExit}
              className="w-full"
            />
          ) : (
            <ActionMotion
              variant="emerald"
              label="NỘP BÀI THI"
              icon={<Send size={18} />}
              onClick={onFinish}
              className="w-full"
              isLoading={isLoading}
            />
          )}
        </div>
      </aside>
    </>
  );
};