"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Info } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { SidebarQuestion } from "../../types/sidebar.types";
import { toggleBadgeVariants, contentBoxVariants } from "./explanation.variants";

interface ExplanationSectionProps {
  question: SidebarQuestion;
  showExplanation: boolean;
  setShowExplanation: (val: boolean) => void;
  correctAnswerId?: number;
  hasImage?: boolean; // Nhận prop này để biết có cần căn giữa hay không
}

export const ExplanationSection = ({
  question,
  showExplanation,
  setShowExplanation,
  correctAnswerId,
  hasImage,
}: ExplanationSectionProps) => {
  if (!("chapterName" in question)) return null;

  return (
    <div className={cn("flex flex-col gap-3 w-full", !hasImage ? "items-center" : "items-start")}>
      
      {/* Nút bật tắt biến thành dạng Badge (Nhỏ, gọn, không thô) */}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className={cn(toggleBadgeVariants({ isOpen: showExplanation }))}
      >
        <Lightbulb
          size={14}
          className={cn(
            "transition-all duration-300",
            showExplanation ? "fill-amber-500 text-amber-500" : "text-current"
          )}
        />
        {showExplanation ? "Đóng giải thích" : "Xem giải thích"}
      </button>

      {/* Nội dung giải thích hiện ra mượt mà */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.98 }}
            animate={{ height: "auto", opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full origin-top"
          >
            <div className={cn(contentBoxVariants())}>
              <div className="relative z-10 flex gap-3 lg:gap-4">
                
                {/* Icon nổi bật bên trái */}
                <div className="w-8 h-8 rounded-full bg-white border border-amber-100 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Info size={16} className="text-amber-500" />
                </div>
                
                {/* Nội dung chữ bên phải */}
                <div className="flex flex-col">
                  <p className="text-[14.5px] lg:text-[15px] text-slate-700 leading-relaxed">
                    <strong className="text-amber-700 font-black mr-1">
                      Đáp án đúng là #{correctAnswerId}.
                    </strong>
                    Nội dung này được trích từ{" "}
                    <span className="font-bold text-slate-900">{question.chapterName}</span>.
                  </p>
                </div>

              </div>
              {/* Bóng mờ trang trí góc phải */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl -z-0 translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};