// src/features/gplx-test/components/GplxTestContainer.tsx

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, RefreshCcw, Play } from "lucide-react";

// Components & UI
import { ExamRoom } from "./exam-room/ExamRoom";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { ConflictModalSafe } from "./conflict-modal";

// Services & Hooks
import { useExamStore } from "../store/exam.store.";
import { useUserStore } from "@/store/user/user.store";
import { useExamSessionFlow } from "../hook/use-exam-session-flow";

// Types
import { IExamFullContent } from "../types/exam-session.types";
import { ExamResultPage } from "./result/ExamResultPage";
import { ExamReviewRoom } from "./exam-review/ExamReviewRoom";
import { cn } from "@/lib/utils/utils";
import { useExamSubmit } from "../hook/use-exam-submit";

interface GplxTestContainerProps {
  exam: IExamFullContent; // Dữ liệu bộ đề (Exam data)
  onExit: () => void; // Thoát khỏi phòng thi (Exit handler)
}

/**
 * @description Container quản lý vòng đời và trạng thái của một bài thi GPLX.
 * (Container managing the lifecycle and state of a GPLX exam.)
 */
export const GplxTestContainer = ({ exam, onExit }: GplxTestContainerProps) => {
  // 1. SELECTORS & STORES (Luôn ở trên cùng)
  const isConflict = useExamStore((s) => s.isConflict);
  const isFinished = useExamStore((s) => s.isFinished);
  const resetStore = useExamStore((s) => s.resetStore);
  const { _hasHydrated } = useUserStore();

  // 2. CUSTOM HOOKS (Luôn ở trên cùng)
  const {
    isInitializing,
    pendingSession,
    handleResume,
    handleRestartAction,
    handleStartFresh,
  } = useExamSessionFlow({
    examId: exam.examId,
    limitMinutes: exam.limitMinutes,
  });

  const { isSubmitting, result, handleSubmit } = useExamSubmit({
    examId: exam.examId,
    limitMinutes: exam.limitMinutes,
    questions: exam.questions,
  });

  // 3. LOCAL STATE
  const [view, setView] = useState<"exam" | "result" | "review">("exam");

  // 4. HANDLERS (useCallback - Phải ở trên cùng, trước Early Returns)
  const handleRestart = useCallback(async () => {
    setView("exam");
    await handleRestartAction();
  }, [handleRestartAction]);

  const handleOnSubmit = useCallback(async () => {
    const res = await handleSubmit();
    if (res) setView("result");
  }, [handleSubmit]);

  const handleSafeExit = useCallback(() => {
    if (view === "exam" && !isFinished) {
      if (!window.confirm("Bạn đang làm bài thi. Chắc chắn thoát?")) return;
    }
    resetStore();
    onExit();
  }, [view, isFinished, resetStore, onExit]);

  // --- 5. EARLY RETURNS (Đặt tất cả ở ĐÂY, sau khi đã khai báo xong Hook) ---

  if (isConflict) return <ConflictModalSafe />;

  if (isInitializing || !_hasHydrated) {
    return <SplashScreen variant="take-exam" />;
  }

  // --- 6. MAIN RENDER ---

  return (
    <div
      className={cn(
        "w-full bg-slate-50 flex flex-col relative font-sans",
        "h-screen",
        "overflow-y-auto overflow-x-hidden",
      )}
    >
      <AnimatePresence mode="wait">
        {pendingSession && (
          <motion.div
            key="resume-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center border border-emerald-100"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
                <Clock size={40} className="animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">
                Tiếp tục bài thi?
              </h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Hệ thống tìm thấy một bài làm dở dang của bạn. Bạn có muốn tiếp
                tục hay làm đề mới?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleResume}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-200"
                >
                  <Play size={20} fill="currentColor" /> Tiếp tục làm bài
                </button>
                <button
                  onClick={handleStartFresh}
                  className="w-full py-4 bg-white hover:bg-slate-50 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCcw size={18} /> Làm đề thi mới
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* VIEW 1: PHÒNG THI (Exam Room View) */}
        {!pendingSession && view === "exam" && (
          <motion.div
            key="exam-view"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExamRoom
              exam={exam}
              onExit={handleSafeExit}
              onSubmit={handleOnSubmit} // Sử dụng handler đã tích hợphandleSubmit
            />
          </motion.div>
        )}

        {/* VIEW 2: KẾT QUẢ (Result View) */}
        {view === "result" && result && (
          <ExamResultPage
            result={result} // Dữ liệu DTO trả về từ Backend sau khi nộp bài thành công
            onRestart={handleRestart}
            onReview={() => setView("review")} // Chuyển sang chế độ xem lại đáp án (Review Mode)
            onExit={handleSafeExit} // Thoát an toàn về danh sách đề thi
          />
        )}

        {/* VIEW 3: XEM LẠI (Review Mode View) 
        Sử dụng ExamReviewRoom chuyên biệt để tách biệt hoàn toàn logic thi và xem lại.
      */}
        {view === "review" && result && (
          <motion.div
            key="review-view"
            className="fixed inset-0 z-[60] bg-white flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ExamReviewRoom result={result} onExit={handleSafeExit} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* OVERLAY: TRẠNG THÁI ĐANG NỘP BÀI (Submission Loading Overlay) */}
      {isSubmitting && (
        <div className="absolute inset-0 z-[200] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-emerald-700 font-black uppercase tracking-[0.2em] text-sm animate-pulse">
            Đang chấm điểm... (Calculating Score...)
          </p>
        </div>
      )}
    </div>
  );
};
