import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IActiveSessionResponseDTO } from "../types/active-session.types";

interface ExamStore {
  examId: string;
  sessionId: string;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeRemaining: number;
  isFinished: boolean;
  instanceId: string;
  isConflict: boolean; // Trạng thái xung đột phiên làm bài
  // Actions
  startExam: (examId: string, limitMinutes: number, sessionId: string) => void;
  /**
   * Khôi phục trạng thái bài làm từ dữ liệu Backend
   */
  resumeSession: (data: IActiveSessionResponseDTO) => void;
  setAnswer: (questionId: string, position: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  tick: () => void;
  finishExam: () => void;
  resetStore: () => void;
  setConflict: (status: boolean) => void;
}

const defaultState = {
  sessionId: "",
  examId: "",
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 0,
  isFinished: false,
};

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      isConflict: false,
      instanceId: typeof window !== "undefined" ? Math.random().toString(36).substring(7) : "",
      setConflict: (status) => set({ isConflict: status }),
      startExam: (examId, limitMinutes, sessionId) => {
        const { instanceId } = get();
        const bc = new BroadcastChannel("gplx_exam_sync_channel");

        bc.postMessage({
          type: "NEW_SESSION_STARTED",
          payload: { sessionId, ownerTabId: instanceId }
        });
        bc.close();

        set({
          sessionId,
          examId,
          answers: {},
          isFinished: false,
          timeRemaining: limitMinutes * 60,
        });
      },

      /**
       * Triển khai resumeSession: 
       * 1. Tính toán timeRemaining từ ServerTime và ExpiresAt.
       * 2. Map mảng câu trả lời sang Record object.
       */
      resumeSession: (data) => {
        // 1. Chuyển đổi danh sách answers từ API sang format của Store
        const mappedAnswers: Record<string, number> = {};
        data.currentAnswers.forEach((ans) => {
          if (ans.selectedAnswerIndex !== null && ans.selectedAnswerIndex !== undefined) {
            mappedAnswers[ans.questionId] = Number(ans.selectedAnswerIndex);
          }
        });

        // 2. KHÔNG CẦN TÍNH TOÁN LẠI THỜI GIAN NỮA! LẤY THẲNG TỪ DATA!
        const remainingSeconds = data.remainingSeconds || 0;

        // 3. Đổ vào Store
        set({
          sessionId: data.sessionId,
          examId: data.examId,
          answers: mappedAnswers,
          timeRemaining: remainingSeconds,
          isFinished: remainingSeconds <= 0, // Chỉ true nếu thực sự hết thời gian
          currentQuestionIndex: get().currentQuestionIndex || 0,
        });
      },
      // Ví dụ hàm reset trong Store
      reset: () => set({
        answers: {},
        examId: undefined,
        currentQuestionIndex: 0,
        timeRemaining: 0,
        sessionId: undefined,
      }),

      setAnswer: (qId, position) =>
        set((state) => ({ answers: { ...state.answers, [qId]: position } })),

      nextQuestion: () =>
        set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),

      prevQuestion: () =>
        set((state) => ({ currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1) })),

      goToQuestion: (index) => set({ currentQuestionIndex: index }),

      tick: () =>
        set((state) => {
          if (state.isFinished || state.timeRemaining <= 0) return state;
          const newTime = state.timeRemaining - 1;
          return {
            timeRemaining: newTime,
            isFinished: newTime <= 0,
          };
        }),

      finishExam: () => set({ isFinished: true }),

      resetStore: () => {
        set(defaultState);
        localStorage.removeItem('exam-session-storage');
      },
    }),

    {
      name: "exam-session-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        examId: state.examId,
        answers: state.answers,
        timeRemaining: state.timeRemaining,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);

if (typeof window !== "undefined") {
  const bc = new BroadcastChannel("gplx_exam_sync_channel");
  
  bc.onmessage = (event) => {
    const { type, payload } = event.data;
    const store = useExamStore.getState();

    // 1. Khi Tab khác báo có Session mới
    if (type === "NEW_SESSION_STARTED") {
      // Nếu ID tab chủ mới khác với ID tab mình, thì mình là "người cũ" -> Conflict
      if (payload.ownerTabId !== store.instanceId && store.sessionId !== "") {
        useExamStore.setState({ isConflict: true });
      }
    }

    // 2. Cơ chế PING/PONG để chặn tab mới mở khi tab cũ đang thi
    if (type === "PING_EXISTING_SESSION") {
      if (store.sessionId !== "" && !store.isFinished) {
        bc.postMessage({ type: "PONG_ALIVE", payload: { ownerTabId: store.instanceId } });
      }
    }

    if (type === "PONG_ALIVE") {
      // Nếu nhận được PONG từ tab khác, nghĩa là đã có chủ -> Conflict
      if (payload.ownerTabId !== store.instanceId) {
        useExamStore.setState({ isConflict: true });
      }
    }
  };
}