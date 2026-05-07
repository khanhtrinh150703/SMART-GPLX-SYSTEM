import { useCallback } from "react";
import { useExamStore } from "../store/exam.store.";
import { useExamTakingActions } from "./use-exam-taking-actions";
import { ICompleteExamRequestDTO, IExamAnswerItem } from "../types/exam-complete.types";
import { IExamUserResultResponseDTO } from "../types/exam-result.types";
import { SidebarQuestion } from "../types/sidebar.types";

interface UseExamSubmitProps {
  examId: string;
  limitMinutes: number;
  questions: SidebarQuestion[];
}

export const useExamSubmit = ({ examId, limitMinutes, questions }: UseExamSubmitProps) => {
  const { actions: examActions, isSubmitting, result } = useExamTakingActions();

  const handleSubmit = useCallback(async (): Promise<IExamUserResultResponseDTO | null> => {
    try {
      // Lấy snapshot mới nhất từ Store để tránh closure stale
      const state = useExamStore.getState();
      const { answers, timeRemaining } = state;

      const totalQuestions = questions?.length || 0;
      const answeredCount = Object.keys(answers).length;

      // 1. Chặn nộp bài trống
      if (answeredCount === 0) {
        alert("Bạn chưa chọn bất kỳ câu trả lời nào. Vui lòng làm bài trước khi nộp!");
        return null;
      }

      // 2. Cảnh báo nộp thiếu
      if (answeredCount < totalQuestions) {
        const isConfirmed = window.confirm(
          `Cảnh báo: Bạn còn ${totalQuestions - answeredCount} câu chưa làm. Nộp bài bây giờ sẽ tính những câu đó là SAI. Tiếp tục?`
        );
        if (!isConfirmed) return null;
      }

      // 3. Data Transformation
      const totalTimeSeconds = limitMinutes * 60;
      const timeSpent = Math.max(0, totalTimeSeconds - timeRemaining);

      const formattedAnswers: IExamAnswerItem[] = Object.entries(answers).map(
        ([qId, ansIndex]) => ({
          questionId: qId,
          answer: ansIndex,
        })
      );

      const payload: ICompleteExamRequestDTO = {
        examId,
        answers: formattedAnswers,
        timeSpent,
        timeRemaining,
        isAutoSubmit: timeRemaining <= 0,
        clientFinishedAt: new Date().toISOString(),
      };

      // 4. Thực hiện nộp bài
      const response = await examActions.submitExamAction(payload);
      return response.data ?? null;

    } catch (error) {
      console.error("Submission failed (Nộp bài thất bại):", error);
      return null;
    }
  }, [limitMinutes, examActions, questions, examId]);

  return {
    isSubmitting,
    result,
    handleSubmit,
  };
};