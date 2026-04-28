"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Thư viện xử lý chuyển động
import { cn } from "@/lib/utils/utils";

interface SheetProps {
  isOpen: boolean; // Trạng thái mở (Open state)
  onClose: () => void; // Hàm đóng (Close function)
  title: string; // Tiêu đề
  children: React.ReactNode;
}

export const Sheet = ({ isOpen, onClose, title, children }: SheetProps) => {
  return (
    /**
     * AnimatePresence: Cho phép component chạy animation "exit" trước khi bị gỡ khỏi DOM.
     * (Enables components to animate out before they're unmounted.)
     */
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* LỚP NỀN (BACKDROP) */}
          <motion.div
            initial={{ opacity: 0 }} // Bắt đầu: Trong suốt
            animate={{ opacity: 1 }} // Hiển thị: Hiện rõ
            exit={{ opacity: 0 }} // Thoát: Biến mất dần
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* NỘI DUNG TRƯỢT (SLIDE PANEL) */}
          <motion.div
            /** * Hiệu ứng trượt ngang (Horizontal Slide):
             * initial: Nằm ngoài màn hình bên phải 100%
             * animate: Trượt vào vị trí 0 (vừa khít màn hình)
             * exit: Trượt ngược lại ra ngoài 100% khi đóng
             */
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring", // Kiểu vật lý lò xo (Spring physics)
              damping: 30, // Độ tắt chấn (giảm rung động)
              stiffness: 300, // Độ cứng của lò xo
              mass: 0.8, // Khối lượng (giúp chuyển động mượt hơn)
            }}
            className={cn(
              // Bỏ w-screen, dùng max-w để giới hạn chiều rộng
              "relative w-full max-w-[1100px] ml-auto bg-white shadow-2xl h-full flex flex-col",
              "rounded-l-[3rem] border-l border-slate-100 overflow-hidden",
            )}
          >
            {/* Header Area */}
            <div className="p-10 pb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                  {title}
                </h2>
                <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-2" />
              </div>
              <button
                onClick={onClose}
                className="p-4 hover:bg-slate-100 rounded-full transition-all active:scale-90 text-slate-400"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
