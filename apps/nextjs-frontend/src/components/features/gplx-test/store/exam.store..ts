import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IActiveSessionResponseDTO } from "../types/active-session.types";

// 1. ĐỊNH NGHĨA STRICT TYPE CHO BROADCAST VÀ ANSWERS
interface SyncPayload {
  sessionId?: string;
  ownerTabId: string;
}

interface SyncMessage {
  type: "NEW_SESSION_STARTED" | "PING_EXISTING_SESSION" | "PONG_ALIVE";
  payload: SyncPayload;
}

interface ISessionAnswerItem {
  questionId: string;
  selectedAnswerIndex?: number | null;
  timeSpent?: number;
}

// 2. KHAI BÁO STORE INTERFACE
interface ExamStore {
  examId: string;
  sessionId: string;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeRemaining: number;
  isFinished: boolean;
  instanceId: string;
  isConflict: boolean; // Trạng thái xung đột phiên làm bài
  
  // -- CÁC TRƯỜNG THÊM MỚI ĐỂ QUẢN LÝ THỜI GIAN --
  totalTimeSpent: number;
  timeSpentPerQuestion: Record<string, number>; 
  questionIds: string[]; 

  // Actions
  startExam: (examId: string, limitMinutes: number, sessionId: string, questionIds: string[]) => void;
  // Bổ sung tham số thứ 2 để nhận danh sách ID đã Hydrate
  resumeSession: (data: IActiveSessionResponseDTO, hydratedQuestionIds: string[]) => void;
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
  // -- RESET LUÔN THỜI GIAN --
  totalTimeSpent: 0,
  timeSpentPerQuestion: {},
  questionIds: [],
};

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      isConflict: false,
      instanceId: typeof window !== "undefined" ? Math.random().toString(36).substring(7) : "",
      setConflict: (status: boolean) => set({ isConflict: status }),
      
      startExam: (examId: string, limitMinutes: number, sessionId: string, questionIds: string[]) => {
        const { instanceId } = get();
        const bc = new BroadcastChannel("gplx_exam_sync_channel");

        bc.postMessage({
          type: "NEW_SESSION_STARTED",
          payload: { sessionId, ownerTabId: instanceId }
        });
        bc.close();

        set({
          ...defaultState, // Chắc chắn dọn sạch rác từ phiên thi trước
          sessionId,
          examId,
          questionIds, // Nạp danh sách ID vào Store
          timeRemaining: limitMinutes * 60,
        });
      },

      resumeSession: (data: IActiveSessionResponseDTO, hydratedQuestionIds: string[]) => {
        const mappedAnswers: Record<string, number> = {};
        const mappedTimeSpent: Record<string, number> = {};
        
        // Đảm bảo Type-safe khi duyệt mảng
        const currentAnswers = (data.currentAnswers || []) as ISessionAnswerItem[];

        currentAnswers.forEach((ans) => {
          if (ans.selectedAnswerIndex !== null && ans.selectedAnswerIndex !== undefined) {
            mappedAnswers[ans.questionId] = Number(ans.selectedAnswerIndex);
          }
          // Khôi phục timeSpent của từng câu từ backend (nếu có)
          mappedTimeSpent[ans.questionId] = ans.timeSpent || 0;
        });

        // Lấy thời gian lấy từ interface trả về, dự phòng bằng 0 nếu API lỗi
        const remainingSeconds = ("remainingSeconds" in data ? Number(data.remainingSeconds) : 0);
        // Lấy tổng timeSpent (Cần kiểm tra xem DTO có trường này không, nếu không lấy tổng của timeSpentPerQuestion)
        const serverTotalTime = ("timeSpent" in data ? Number(data.timeSpent) : 0);

        set({
          sessionId: data.sessionId,
          examId: data.examId,
          answers: mappedAnswers,
          timeRemaining: remainingSeconds,
          isFinished: remainingSeconds <= 0,
          currentQuestionIndex: get().currentQuestionIndex || 0,
          
          // -- NẠP DATA HYDRATE --
          questionIds: hydratedQuestionIds,
          timeSpentPerQuestion: mappedTimeSpent,
          totalTimeSpent: serverTotalTime,
        });
      },

      reset: () => set({ ...defaultState }),

      setAnswer: (qId: string, position: number) =>
        set((state) => ({ answers: { ...state.answers, [qId]: position } })),

      nextQuestion: () =>
        set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),

      prevQuestion: () =>
        set((state) => ({ currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1) })),

      goToQuestion: (index: number) => set({ currentQuestionIndex: index }),

      tick: () =>
        set((state) => {
          // Ngừng đếm nếu đã nộp bài hoặc hết giờ
          if (state.isFinished || state.timeRemaining <= 0) return state;

          const qIds = state.questionIds || [];
          const currentId = qIds[state.currentQuestionIndex];

          const newTimeSpentPerQuestion = { ...state.timeSpentPerQuestion };

          // Cộng thêm 1 giây cho câu hỏi đang hiển thị trên màn hình
          if (currentId) {
            newTimeSpentPerQuestion[currentId] = (newTimeSpentPerQuestion[currentId] || 0) + 1;
          }

          const newTimeRemaining = state.timeRemaining - 1;

          return {
            timeRemaining: newTimeRemaining,
            totalTimeSpent: (state.totalTimeSpent || 0) + 1, // Cộng tổng thời gian thi
            timeSpentPerQuestion: newTimeSpentPerQuestion,
            isFinished: newTimeRemaining <= 0,
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
      // BẮT BUỘC LƯU CÁC TRƯỜNG THỜI GIAN VÀ ID XUỐNG LOCALSTORAGE
      partialize: (state) => ({
        sessionId: state.sessionId,
        examId: state.examId,
        answers: state.answers,
        timeRemaining: state.timeRemaining,
        currentQuestionIndex: state.currentQuestionIndex,
        questionIds: state.questionIds,
        totalTimeSpent: state.totalTimeSpent,
        timeSpentPerQuestion: state.timeSpentPerQuestion,
      }),
    }
  )
);

if (typeof window !== "undefined") {
  const bc = new BroadcastChannel("gplx_exam_sync_channel");
  
  // Ép kiểu Event data thay vì để 'any'
  bc.onmessage = (event: MessageEvent<SyncMessage>) => {
    const { type, payload } = event.data;
    const store = useExamStore.getState();

    if (type === "NEW_SESSION_STARTED") {
      if (payload.ownerTabId !== store.instanceId && store.sessionId !== "") {
        useExamStore.setState({ isConflict: true });
      }
    }

    if (type === "PING_EXISTING_SESSION") {
      if (store.sessionId !== "" && !store.isFinished) {
        bc.postMessage({ type: "PONG_ALIVE", payload: { ownerTabId: store.instanceId } });
      }
    }

    if (type === "PONG_ALIVE") {
      if (payload.ownerTabId !== store.instanceId) {
        useExamStore.setState({ isConflict: true });
      }
    }
  };
}