"use client";

import { motion } from "framer-motion";
import {
  Play,
  FileText,
  Star,
  Trophy,
  ChevronRight,
  Users,
  CheckCircle2,
  ListChecks,
  Calendar,
} from "lucide-react";
import {
  cardVariants,
  difficultyVariants,
  CardVariantsProps,
} from "./exam-card.variants";
import { cn } from "@/lib/utils/utils"; // cn: Hàm kết hợp class CSS
import { IExamItem } from "../types/exam-ui.types";

interface ExamCardProps extends CardVariantsProps {
  exam: IExamItem;
  index: number;
  onSelect: (id: string) => void;
}

export const ExamCard = ({
  exam,
  index,
  onSelect,
  size = "md",
}: ExamCardProps) => {
  const passRate = "85%";
  const lastUpdated = "Tháng 05/2026";
  const isSmall = size === "sm"; // Kiểm tra trạng thái kích thước nhỏ

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{
        scale: 1.02, // Scale: Tỷ lệ phóng to
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onClick={() => onSelect(exam.id)}
      className="relative w-full h-fit flex justify-center group"
    >
      <div className={cn(cardVariants({ size }))}>
        {/* Top Glow & Watermark (Giữ nguyên phong cách của bạn) */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Watermark: Chữ mờ nền hạng GPLX */}
        <div className="absolute -bottom-8 -right-4 text-[140px] font-black text-slate-50 leading-none z-0 pointer-events-none select-none group-hover:scale-110 group-hover:-rotate-6 group-hover:text-emerald-50/50 transition-all duration-700">
          {exam.category}
        </div>

        {/* --- CONTENT AREA (Khu vực nội dung) --- */}
        <div
          className={cn(
            "relative z-10 flex flex-col",
            isSmall ? "gap-4" : "gap-6",
          )}
        >
          <div className="flex justify-between items-start">
            <div
              className={cn(
                "rounded-[20px] bg-emerald-50/50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:-rotate-6 transition-all duration-500 shadow-sm",
                isSmall ? "w-10 h-10" : "w-14 h-14",
              )}
            >
              <FileText size={isSmall ? 20 : 26} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[9px] font-bold uppercase">
                <Calendar size={10} /> {lastUpdated}
              </span>
              <span
                className={cn(difficultyVariants({ level: exam.difficulty }))}
              >
                {exam.difficulty}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              {exam.isHot && (
                <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                  <Star size={10} fill="currentColor" /> HOT
                </span>
              )}
              <h3
                className={cn(
                  "font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors",
                  isSmall ? "text-lg" : "text-xl",
                )}
              >
                {exam.title}
              </h3>
            </div>
            <p
              className={cn(
                "text-slate-500 font-medium line-clamp-2",
                isSmall ? "text-xs" : "text-sm",
              )}
            >
              {exam.description ||
                "Bao gồm các câu hỏi điểm liệt và tình huống mô phỏng mới nhất."}
            </p>
          </div>

          {/* Stats Bar (Thanh chỉ số) */}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-600">
                {exam.completedCount || 0} lượt
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-600">
                {passRate} đạt
              </span>
            </div>
          </div>
        </div>

        {/* --- FOOTER AREA (Khu vực chân trang) --- */}
        <div className="relative z-10 mt-auto pt-6">
          <div
            className={cn("grid grid-cols-3 gap-2", isSmall ? "mb-3" : "mb-5")}
          >
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Hạng
              </span>
              <span className="text-sm font-black text-slate-700">
                {exam.category}
              </span>
            </div>
            <div className="flex flex-col border-x border-slate-100 px-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Câu hỏi
              </span>
              <div className="flex items-center gap-1 text-sm font-black text-slate-700">
                <ListChecks size={12} className="text-emerald-500" />
                {exam.totalQuestions} Câu
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Thời gian
              </span>
              <span className="text-sm font-black text-slate-700">
                {exam.limitMinutes} Phút
              </span>
            </div>
          </div>

          {/* Interactive Bottom (Hiệu ứng tương tác phía dưới) */}
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 transition-all",
              isSmall ? "h-10" : "h-12",
            )}
          >
            <div className="absolute inset-0 flex items-center justify-between px-4 transition-all duration-500 group-hover:translate-y-[-100%] opacity-100 group-hover:opacity-0">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-600">
                  Kỷ lục: {exam.highestScore || 0}/{exam.totalQuestions}
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>

            <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-emerald-600 text-white font-black text-xs tracking-widest gap-2">
              <Play size={14} className="fill-current" />
              BẮT ĐẦU SÁT HẠCH
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
