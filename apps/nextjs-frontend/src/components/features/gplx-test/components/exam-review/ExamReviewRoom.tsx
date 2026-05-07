"use client";

import { useMemo, useState } from "react";
import { IExamUserResultResponseDTO } from "../../types/exam-result.types";
import { ExamHeader } from "../exam-header/ExamHeader";
import { ExamNavigation } from "../exam-navigation/ExamNavigation";
import { ExamSidebar } from "../exam-sidebar/ExamSidebar";
import { QuestionSection } from "../question-section/QuestionSection";


interface ExamReviewRoomProps {
  result: IExamUserResultResponseDTO; // Dữ liệu kết quả từ API (DTO)
  onExit: () => void;
}

export const ExamReviewRoom = ({ result, onExit }: ExamReviewRoomProps) => {
  // 1. LOCAL STATE: Khi xem lại, chỉ cần state cục bộ để đổi câu hỏi
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = result.questions[currentIndex];

  const reviewAnswers = useMemo(() => {
    return result.questions.reduce(
      (acc, q) => {
        acc[q.questionId] = q.userSelectedAnswer;
        return acc;
      },
      {} as Record<string, number | undefined>,
    );
  }, [result.questions]);


  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex gap-6 p-6 w-screen h-screen overflow-hidden font-sans">
      <main className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        <ExamHeader
          currentIndex={currentIndex}
          title={result.title}
          licenseCategoryName={result.licenseCategoryName}
          total={result.totalQuestions}
          isReviewMode={true}
          // Review mode không cần fullscreen phức tạp
          isFullscreen={false}
          onToggleFullscreen={() => {}}
        />

        <QuestionSection
          question={currentQuestion}
          selectedAnswerId={currentQuestion.userSelectedAnswer}
          isReviewMode={true}
          onSelectAnswer={() => {}} // Read-only
        />

        <ExamNavigation
          total={result.totalQuestions}
          currentIndex={currentIndex}
          isReviewMode={true}
          onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNext={() =>
            setCurrentIndex((prev) =>
              Math.min(result.totalQuestions - 1, prev + 1),
            )
          }
        />
      </main>

      <ExamSidebar
        questions={result.questions} // Dữ liệu từ DTO kết quả
        currentIndex={currentIndex} // Từ State địa phương
        answers={reviewAnswers} // Object mapping vừa tạo ở trên
        timeRemaining={0} // Review thì timer = 0
        isReviewMode={true} // Bật cờ Review
        isAutoNext={false} // Review không cần auto-next
        onToggleAutoNext={() => {}} // No-op (hàm rỗng)
        onNavigate={setCurrentIndex} // Cập nhật State địa phương
        onExit={onExit} // Thoát ra trang Dashboard kết quả
      />
    </div>
  );
};
