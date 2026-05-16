"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { useExamStore } from "../../store/exam.store.";
import { IExamFullContent } from "../../types/exam-session.types";
import { useSyncExam } from "../../hook/use-sync-exam";
import { Alert } from "@/components/ui/Alert";
import { useExamTakingActions } from "../../hook/use-exam-taking-actions";
import { ExamHeader } from "../exam-header/ExamHeader";
import { ExamNavigation } from "../exam-navigation/ExamNavigation";
import { ExamSidebar } from "../exam-sidebar/ExamSidebar";
import { QuestionSection } from "../question-section/QuestionSection";
import SplashScreen from "@/components/common/Loaders/SplashScreen";

interface ExamRoomProps {
  exam: IExamFullContent;
  onExit: () => void;
  onSubmit: () => void; // Bắt buộc phải có khi thi
}

export const ExamRoom = ({ exam, onExit, onSubmit }: ExamRoomProps) => {
  // 1. SELECTORS: Chỉ lấy dữ liệu thi từ Store (Only Testing State)
  const {
    currentQuestionIndex,
    isFinished,
    timeRemaining,
    answers,
    goToQuestion,
    prevQuestion,
    tick,
    setAnswer,
    nextQuestion,
  } = useExamStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoNext, setIsAutoNext] = useState(true);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const { isSubmitting } = useExamTakingActions();
  // 2. SYNC HOOK: Tự động đồng bộ đáp án lên Server mỗi 1.5s
  const { message, setMessage } = useSyncExam(false);

  /**
   * HEARTBEAT TIMER: Chạy mỗi giây để giảm timeRemaining
   */
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  }, [isFinished, tick]);

  /**
   * AUTO-SUBMIT: Tự động nộp bài khi Store báo isFinished (hết giờ)
   */
  useEffect(() => {
    if (isFinished && timeRemaining <= 0) {
      onSubmit();
    }
  }, [isFinished, timeRemaining, onSubmit]);

  /**
   * XỬ LÝ CHỌN ĐÁP ÁN: Lưu vào Store + Auto-next
   */
  const handleSelectAnswer = useCallback(
    (position: number) => {
      setAnswer(currentQuestion.questionId, position);

      if (isAutoNext && currentQuestionIndex < exam.questions.length - 1) {
        if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
        autoNextTimerRef.current = setTimeout(() => {
          nextQuestion();
        }, 400);
      }
    },
    [
      isAutoNext,
      currentQuestionIndex,
      exam.questions.length,
      nextQuestion,
      setAnswer,
      currentQuestion.questionId,
    ],
  );

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen toggle failed", error);
    }
  };

  if (!currentQuestion) {
    return <SplashScreen variant="take-exam" />; 
  }
  return (
    <div className="fixed inset-0 z-[9999] bg-[#F8FAFC] flex gap-6 p-6 w-screen h-screen overflow-hidden font-sans">
      <main className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        <ExamHeader
          currentIndex={currentQuestionIndex}
          title={exam.title}
          licenseCategoryName={exam.licenseCategoryName}
          total={exam.questions.length}
          isReviewMode={false}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {message && (
          <Alert
            intent={message.intent}
            message={message.text}
            onClose={() => setMessage(null)}
            duration={5000}
          />
        )}

        <div className="flex-1 relative overflow-y-auto flex flex-col custom-scrollbar">
          <QuestionSection
            question={currentQuestion}
            selectedAnswerId={answers[currentQuestion.questionId]}
            isReviewMode={false}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        <ExamNavigation
          total={exam.questions.length}
          currentIndex={currentQuestionIndex}
          isReviewMode={false}
          onPrev={prevQuestion}
          onNext={nextQuestion}
        />
      </main>

      <ExamSidebar
        questions={exam.questions} // Dữ liệu tĩnh từ props exam
        currentIndex={currentQuestionIndex} // Từ Store
        answers={answers} // Từ Store
        timeRemaining={timeRemaining} // Từ Store
        isReviewMode={false} // Đang thi mà!
        isAutoNext={isAutoNext}
        onToggleAutoNext={() => setIsAutoNext(!isAutoNext)}
        onNavigate={goToQuestion} // Hàm chuyển câu từ Store
        onExit={onExit}
        onFinish={onSubmit} // Hàm nộp bài
        isLoading={isSubmitting}
      />
    </div>
  );
};
