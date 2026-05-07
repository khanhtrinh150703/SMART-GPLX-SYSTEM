"use client";

import { motion } from "framer-motion";
import { Award, XCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ResultHeroProps {
  isPassed: boolean;
  isCriticalFail?: boolean; // Cờ báo hiệu trượt do câu điểm liệt (Critical Fail Flag)
  themePrimary: string;
}

export const ResultHero = ({
  isPassed,
  isCriticalFail,
  themePrimary,
}: ResultHeroProps) => {
  return (
    <div className="flex flex-col items-center mb-6 w-full">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, delay: 0.1 }}
        className="mb-5"
      >
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl rotate-3 border-4 border-white",
            isPassed
              ? "bg-emerald-500 text-white"
              : isCriticalFail
                ? "bg-rose-600 text-white" // Đỏ đậm hơn cho điểm liệt
                : "bg-rose-500 text-white",
          )}
        >
          {isPassed ? (
            <Award size={48} strokeWidth={1.5} />
          ) : isCriticalFail ? (
            <AlertOctagon size={48} strokeWidth={1.5} />
          ) : (
            <XCircle size={48} strokeWidth={1.5} />
          )}
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none text-center",
          themePrimary,
        )}
      >
        {isPassed ? "Đạt sát hạch" : "Không đạt"}
      </motion.h1>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 max-w-md text-center"
      >
        {isCriticalFail && !isPassed && (
          <p className="inline-block px-4 py-1.5 bg-rose-100 text-rose-700 font-bold text-sm rounded-full mb-2 uppercase tracking-wide animate-pulse">
            Lỗi nghiêm trọng: Sai câu điểm liệt
          </p>
        )}
        <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
          {isPassed
            ? "Tuyệt vời! Bạn đã vượt qua bài thi. Hãy kiểm tra lại các đáp án chi tiết bên dưới."
            : isCriticalFail
              ? "Dù điểm số của bạn có thể cao, nhưng việc sai câu hỏi điểm liệt sẽ dẫn đến kết quả Không đạt."
              : "Rất tiếc, kết quả chưa đủ để Đạt. Bạn cần ôn tập thêm và thử sức lại nhé."}
        </p>
      </motion.div>
    </div>
  );
};
