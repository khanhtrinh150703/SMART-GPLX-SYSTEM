"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ResultStatsProps {
  score: number;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  isPassed: boolean;
  themePrimary: string;
}

export const ResultStats = ({
  score,
  total,
  correct,
  wrong,
  skipped,
  themePrimary,
}: ResultStatsProps) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="w-full bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-sm mb-8"
    >
      <div className="flex w-full items-stretch justify-between divide-x divide-slate-100">
        {/* Cột 1: Điểm số */}
        <div className="flex-1 flex flex-col items-center justify-center px-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5 whitespace-nowrap">
            <Target size={12} /> Điểm
          </span>
          <div className="flex items-baseline gap-0.5">
            <span
              className={cn(
                "text-3xl font-black tabular-nums tracking-tighter leading-none",
                themePrimary,
              )}
            >
              {score}
            </span>
            <span className="text-slate-300 font-bold text-sm">/{total}</span>
          </div>
        </div>

        {/* Cột 2: Đúng */}
        <div className="flex-1 flex flex-col items-center justify-center px-2">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5 whitespace-nowrap">
            <CheckCircle2 size={12} /> Đúng
          </span>
          <span className="text-3xl font-black text-emerald-600 tabular-nums leading-none">
            {correct}
          </span>
        </div>

        {/* Cột 3: Sai */}
        <div className="flex-1 flex flex-col items-center justify-center px-2">
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5 whitespace-nowrap">
            <XCircle size={12} /> Sai
          </span>
          <span className="text-3xl font-black text-rose-600 tabular-nums leading-none">
            {wrong}
          </span>
        </div>

        {/* Cột 4: Bỏ qua */}
        <div className="flex-1 flex flex-col items-center justify-center px-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5 whitespace-nowrap">
            <MinusCircle size={12} /> Chưa Chọn
          </span>
          <span className="text-3xl font-black text-slate-600 tabular-nums leading-none">
            {skipped}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
