import { useState, useEffect, useRef, useCallback } from "react";
import { useExamStore } from "../store/exam.store."; // Chú ý: đuôi file của bạn đang có dấu '.' ở cuối, hãy kiểm tra lại tên file gốc nhé
import { useUserStore } from "@/store/user/user.store";
import { useActiveSessionActions } from "./use-active-session-actions";
import { activeSessionService } from "../service/active-session.service";
import { IActiveSessionResponseDTO } from "../types/active-session.types";
import { examUserService } from "../service/exam-user.service";

interface UseExamSessionFlowProps {
  examId: string;
  limitMinutes: number;
}

// 1. ĐỊNH NGHĨA STRICT TYPE ĐỂ TRÁNH DÙNG "any"
interface IExamQuestion {
  id?: string;
  questionId?: string;
}

interface IPendingSession extends IActiveSessionResponseDTO {
  hydratedQuestionIds: string[]; // Chứa danh sách ID đã được bù đắp từ Exam API
  remainingSeconds: number;
}

export const useExamSessionFlow = ({
  examId,
  limitMinutes,
}: UseExamSessionFlowProps) => {
  const { resetStore, startExam, resumeSession, sessionId } = useExamStore();
  const { user, accessToken, _hasHydrated } = useUserStore();
  const { actions: sessionActions } = useActiveSessionActions();

  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [pendingSession, setPendingSession] = useState<IPendingSession | null>(
    null,
  );

  const processingRef = useRef<boolean>(false);
  const sessionRef = useRef<string>(sessionId);

  useEffect(() => {
    sessionRef.current = sessionId;
  }, [sessionId]);

  // LẮNG NGHE TÍN HIỆU TỪ CÁC TAB KHÁC
  useEffect(() => {
    const bc = new BroadcastChannel("gplx_exam_sync_channel");
    bc.postMessage({ type: "PING_EXISTING_SESSION" });
    return () => bc.close();
  }, []);

  const calculateServerOffset = (serverTimeIso: string): number => {
    const serverTime = new Date(serverTimeIso).getTime();
    return serverTime - Date.now();
  };

  const handleInitNewSession = useCallback(
    async (isOfficial: boolean) => {
      try {
        const payload = {
          examId,
          clientStartedAt: new Date().toISOString(),
          isForce: true,
        };

        // PARALLEL FETCH: Vừa tạo phiên, vừa lấy chi tiết đề thi để nhặt questionIds
        const [res, examRes] = await Promise.all([
          isOfficial
            ? sessionActions.startOfficial(payload)
            : sessionActions.startGuest(payload),
          examUserService.getDetails(examId),
        ]);

        if (res.data) {
          // Trích xuất Type an toàn thay vì dùng any
          const questions = (examRes.data?.questions || []) as IExamQuestion[];
          const questionIds = questions
            .map((q) => q.questionId || q.id || "")
            .filter(Boolean); // Lọc bỏ các giá trị rỗng

          startExam(
            res.data.examId,
            limitMinutes,
            res.data.sessionId,
            questionIds,
          );
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    },
    [examId, limitMinutes, sessionActions, startExam],
  );

  const handleStartFresh = useCallback(async () => {
    setPendingSession(null);
    setIsInitializing(true);
    await handleInitNewSession(!!accessToken);
    setIsInitializing(false);
  }, [accessToken, handleInitNewSession]);

  const handleRestartAction = useCallback(async () => {
    setIsInitializing(true);
    resetStore(); // Dọn dẹp RAM trước khi bắt đầu
    await handleInitNewSession(!!accessToken);
    setIsInitializing(false);
  }, [accessToken, handleInitNewSession, resetStore]);

  const handleResume = useCallback(() => {
    if (pendingSession) {
      // Truyền cả data session và danh sách ID đã lấy từ Exam API
      resumeSession(pendingSession, pendingSession.hydratedQuestionIds);
      setPendingSession(null);
    }
  }, [pendingSession, resumeSession]);

  // KHỞI TẠO LUỒNG (INITIALIZATION EFFECT)
  useEffect(() => {
    if (!_hasHydrated || processingRef.current) return;
    processingRef.current = true;

    const initializeFlow = async () => {
      setIsInitializing(true);
      try {
        if (accessToken && user) {
          // PARALLEL FETCH: Vừa lấy phiên cũ, vừa lấy chi tiết đề thi
          const [res, examRes] = await Promise.all([
            activeSessionService.getCurrent(),
            examUserService.getDetails(examId),
          ]);

          if (res.data) {
            const session = res.data;

            // Trích xuất Type an toàn
            const questions = (examRes.data?.questions ||
              []) as IExamQuestion[];
            const hydratedQuestionIds = questions
              .map((q) => q.questionId || q.id || "")
              .filter(Boolean);

            const offset = calculateServerOffset(session.serverTime);
            const limitMs = limitMinutes * 60 * 1000;
            const examEndsAtMs =
              new Date(session.createdAt).getTime() + limitMs;
            const currentTimeAdjusted = Date.now() + offset;

            const secondsRemaining = Math.max(
              0,
              Math.floor((examEndsAtMs - currentTimeAdjusted) / 1000),
            );

            setPendingSession({
              ...session,
              remainingSeconds: secondsRemaining,
              hydratedQuestionIds, // Nạp danh sách ID đã bù đắp vào state
            });
            return;
          }
        }
        await handleInitNewSession(!!accessToken);
      } catch (error) {
        console.error("Initialization error:", error);
        processingRef.current = false;
      } finally {
        setIsInitializing(false);
      }
    };

    initializeFlow();
  }, [
    _hasHydrated,
    accessToken,
    user,
    handleInitNewSession,
    limitMinutes,
    examId,
  ]);

  return {
    isInitializing,
    pendingSession,
    handleRestartAction,
    handleResume,
    handleStartFresh,
    setPendingSession,
  };
};
