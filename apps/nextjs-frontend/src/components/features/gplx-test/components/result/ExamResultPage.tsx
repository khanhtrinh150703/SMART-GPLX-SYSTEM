"use client";

import { motion } from "framer-motion";
import { ResultHero } from "../result-hero/ResultHero";
import { ResultStats } from "../result-stats/ResultStats";
import { IExamUserResultResponseDTO } from "../../types/exam-result.types";
import { resultPageVariants } from "./ExamResultPage.variants";
import { cn } from "@/lib/utils/utils";
import { GlassBackButton } from "@/components/ui/Glass-Button/Glass-Button";
import { ExamInfoTag } from "../exam-info/ExamInfoTag";
import { ResultActions } from "../result-action/ResultActions";
import { ResultTimeAnalytics } from "../result-time-analytices/ResultTimeAnalytics";

interface ExamResultPageProps {
  result: IExamUserResultResponseDTO;
  onRestart: () => void;
  onReview: () => void;
  onExit: () => void;
}

export const ExamResultPage = ({
  result,
  onRestart,
  onReview,
  onExit,
}: ExamResultPageProps) => {
  // Xác định theme chủ đạo dựa trên kết quả tổng quát
  // Nếu trượt điểm liệt, dùng màu Rose mạnh hơn
  const isCriticalFail = result.isFailedByCritical;
  const theme = {
    primary: result.passed ? "text-emerald-500" : "text-rose-500",
    bgLight: result.passed ? "bg-emerald-50/50" : "bg-rose-50/50",
    border: result.passed ? "border-emerald-100" : "border-rose-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      // Áp dụng CVA variant chứa y chang các thuộc tính cũ
      className={cn(resultPageVariants({ paddingTop: "small" }))}
    >
   
      <GlassBackButton
        onClick={onExit}
        theme={result.passed ? "emerald" : "slate"}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50"
      />

      {/* Background Grid - Giữ nguyên ý tưởng mask cực sang của ông */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      />

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center gap-6">
        {/* 1. Tag thông tin đề thi (Exam Header Info) */}
        <ExamInfoTag
          title={result.title}
          category={result.licenseCategoryName}
        />

        {/* 2. Hero Section: Trạng thái Đạt/Trượt + Hiệu ứng */}
        <ResultHero
          isPassed={result.passed}
          isCriticalFail={isCriticalFail}
          themePrimary={theme.primary}
        />

        {/* 3. Stats Grid: Đúng/Sai/Bỏ qua (Rich Statistics) */}
        <ResultStats
          score={result.score}
          total={result.totalQuestions}
          correct={result.correctAnswers}
          wrong={result.wrongAnswers}
          skipped={result.skippedAnswers}
          isPassed={result.passed}
          themePrimary={theme.primary}
        />

        {/* 4. Time Analytics: Phân tích thời gian làm bài */}
        <ResultTimeAnalytics
          timeSpent={result.timeSpent}
          timeRemaining={result.timeRemaining}
          isAutoSubmit={result.isAutoSubmit}
        />

        {/* 5. Actions: Nút điều hướng */}
        <ResultActions
          onRestart={onRestart}
          onReview={onReview}
          isPassed={result.passed}
        />
      </div>
    </motion.div>
  );
};
