"use client";

import { useState, useCallback, useMemo } from "react";
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

// --- UTILS: SHUFFLE ENGINE (Cấm bịa đặt, dùng thuật toán Deterministic) ---

/**
 * Chuyển chuỗi sessionId thành số Seed cố định
 */
const hashStringId = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Bộ tạo số ngẫu nhiên có Seed (PRNG)
 */
class SeededRandom {
  private state: number;
  constructor(seed: number) {
    this.state = seed || 1;
  }
  next() {
    this.state = (this.state * 1664525 + 1013904223) % 4294967296;
    return this.state / 4294967296;
  }
}

/**
 * Hàm tráo đổi mảng dựa trên Seed
 */
const shuffleWithSeed = <T,>(array: T[], seed: number): T[] => {
  const rng = new SeededRandom(seed);
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

interface GplxTestContainerProps {
  exam: IExamFullContent;
  onExit: () => void;
  shouldShuffle?: boolean; // Nhận flag từ GplxTestPage
}

export const GplxTestContainer = ({
  exam,
  onExit,
  shouldShuffle = false,
}: GplxTestContainerProps) => {
  // 1. SELECTORS & STORES
  const isConflict = useExamStore((s) => s.isConflict);
  const isFinished = useExamStore((s) => s.isFinished);
  const resetStore = useExamStore((s) => s.resetStore);
  const sessionId = useExamStore((s) => s.sessionId);
  const { _hasHydrated } = useUserStore();

  // 2. LOGIC TRÁO ĐỔI DỮ LIỆU (Shuffle Logic)
  const processedExam = useMemo(() => {
    if (!shouldShuffle || !sessionId) return exam;

    const seed = hashStringId(sessionId); // Tạo rootSeed từ sessionId
    // BƯỚC 1: Tráo thứ tự toàn bộ danh sách câu hỏi trước

    const shuffledQuestions = shuffleWithSeed(exam.questions, seed); 
    const finalExamData = shuffledQuestions.map((q, qIdx) => {
      const answersWithMeta = q.answers.map((opt, optIdx) => ({
        ...opt,
        index: optIdx, // Giữ index gốc để BE chấm điểm
      })); // Tráo đáp án dùng seed + qIdx (biến thể dựa trên sessionId)

      return {
        ...q,
        answers: shuffleWithSeed(answersWithMeta, seed + qIdx),
      };
    });

    return {
      ...exam,
      questions: finalExamData,
    };
  }, [exam, shouldShuffle, sessionId]);

  // 3. CUSTOM HOOKS
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

  // Lưu ý: handleSubmit bên dưới sẽ gửi đáp án dựa trên originalIndex đã gắn ở trên
  const { isSubmitting, result, handleSubmit } = useExamSubmit({
    examId: exam.examId,
    limitMinutes: exam.limitMinutes,
    questions: processedExam.questions,
    shouldShuffle
  });

  // 4. LOCAL STATE
  const [view, setView] = useState<"exam" | "result" | "review">("exam");

  // 5. HANDLERS
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

  // 6. EARLY RETURNS
  if (isConflict) return <ConflictModalSafe />;
  if (isInitializing || !_hasHydrated) {
    return <SplashScreen variant="take-exam" />;
  }

  return (
    <div
      className={cn(
        "w-full bg-slate-50 flex flex-col relative font-sans h-screen overflow-y-auto overflow-x-hidden",
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

        {!pendingSession && view === "exam" && (
          <motion.div
            key="exam-view"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExamRoom
              exam={processedExam}
              onExit={handleSafeExit}
              onSubmit={handleOnSubmit}
            />
          </motion.div>
        )}

        {view === "result" && result && (
          <ExamResultPage
            result={result}
            onRestart={handleRestart}
            onReview={() => setView("review")}
            onExit={handleSafeExit}
          />
        )}

        {view === "review" && result && (
          <motion.div
            key="review-view"
            className="fixed inset-0 z-[60] bg-white flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Review cũng sẽ nhận seed để tái hiện đúng thứ tự nếu cần */}
            <ExamReviewRoom result={result} onExit={handleSafeExit} />
          </motion.div>
        )}
      </AnimatePresence>

      {isSubmitting && (
        <div className="absolute inset-0 z-[200] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-emerald-700 font-black uppercase tracking-[0.2em] text-sm animate-pulse">
            Đang chấm điểm...
          </p>
        </div>
      )}
    </div>
  );
};
