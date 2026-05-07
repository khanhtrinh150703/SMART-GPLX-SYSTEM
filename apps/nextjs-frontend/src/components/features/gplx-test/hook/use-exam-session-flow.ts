import { useState, useEffect, useRef, useCallback } from "react";
import { useExamStore } from "../store/exam.store.";
import { useUserStore } from "@/store/user/user.store";
import { useActiveSessionActions } from "./use-active-session-actions";
import { activeSessionService } from "../service/active-session.service";
import { IActiveSessionResponseDTO } from "../types/active-session.types";

interface UseExamSessionFlowProps {
  examId: string;
  limitMinutes: number;
}

export const useExamSessionFlow = ({ examId, limitMinutes }: UseExamSessionFlowProps) => {
  const { resetStore, startExam, resumeSession, sessionId } = useExamStore();
  const { user, accessToken, _hasHydrated } = useUserStore();
  const { actions: sessionActions } = useActiveSessionActions();

  const [isInitializing, setIsInitializing] = useState(true);
  const [pendingSession, setPendingSession] = useState<IActiveSessionResponseDTO | null>(null);
  
  const processingRef = useRef<boolean>(false);
  const sessionRef = useRef(sessionId);

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

  const handleInitNewSession = useCallback(async (isOfficial: boolean) => {
    try {
      const payload = {
        examId,
        clientStartedAt: new Date().toISOString(),
        isForce: true,
      };
      const res = isOfficial
        ? await sessionActions.startOfficial(payload)
        : await sessionActions.startGuest(payload);

      if (res.data) {
        startExam(res.data.examId, limitMinutes, res.data.sessionId);
      }
    } catch (error) {
      console.error("Initialization error:", error);
    }
  }, [examId, limitMinutes, sessionActions, startExam]);

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
      resumeSession(pendingSession);
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
          const res = await activeSessionService.getCurrent();
          if (res.data) {
            const session = res.data;
            const offset = calculateServerOffset(session.serverTime);
            const limitMs = limitMinutes * 60 * 1000;
            const examEndsAtMs = new Date(session.createdAt).getTime() + limitMs;
            const currentTimeAdjusted = Date.now() + offset;
            
            const secondsRemaining = Math.max(
              0,
              Math.floor((examEndsAtMs - currentTimeAdjusted) / 1000)
            );

            setPendingSession({
              ...session,
              remainingSeconds: secondsRemaining,
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
  }, [_hasHydrated, accessToken, user, handleInitNewSession, limitMinutes]);

  return {
    isInitializing,
    pendingSession,
    handleRestartAction,
    handleResume,
    handleStartFresh,
    setPendingSession,
  };
};