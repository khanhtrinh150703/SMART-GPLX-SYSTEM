// src/features/gplx-test/hooks/use-sync-exam.ts
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useExamStore } from "../store/exam.store.";
import { useActiveSessionActions } from "./use-active-session-actions";
import { useUserStore } from "@/store/user/user.store"; // Import store người dùng

/**
 * Hook: Đồng bộ hóa bài thi (Sync Exam)
 * @param isReviewMode - Chế độ xem lại (Review Mode)
 */
export const useSyncExam = (isReviewMode: boolean) => {
  const { sessionId, answers, examId, currentQuestionIndex } = useExamStore();
  const { actions } = useActiveSessionActions();
  
  // Lấy token để kiểm tra trạng thái đăng nhập (Authentication Status)
  const accessToken = useUserStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken && accessToken !== "undefined";

  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);
  
  const lastSyncedStateRef = useRef<string>("");

  /**
   * Helper: Lấy thông báo lỗi từ API (Get API Error Message)
   */
  const getApiError = (error: unknown): string => {
    return axios.isAxiosError(error)
      ? error.response?.data?.message || "Lỗi kết nối đến máy chủ"
      : "Đã xảy ra lỗi không xác định.";
  };

  useEffect(() => {
    // 1. Guard Clause: Nếu là Guest (không có token), hoặc đang review, hoặc thiếu ID thì thoát sớm (Early Return)
    if (!isAuthenticated || isReviewMode || !examId || !sessionId) {
      return;
    }

    const performSync = async () => {
      const currentState = JSON.stringify({ answers, currentQuestionIndex });
      
      // 2. Tránh gọi API thừa nếu dữ liệu không đổi (Deep Comparison)
      if (currentState === lastSyncedStateRef.current) return;

      try {
        await actions.sync({
          sessionId,
          examId,
          answers,
          currentQuestionIndex,
          clientTimestamp: new Date().toISOString()
        });
        
        lastSyncedStateRef.current = currentState;
      } catch (error: unknown) {
        setMessage({
          intent: "warning",
          text: getApiError(error)
        });
      }
    };

    // 3. Debounce logic: Đợi người dùng ngừng thao tác 1.5s mới sync để tối ưu tài nguyên (Resource Optimization)
    const timer = setTimeout(performSync, 1500);
    
    return () => clearTimeout(timer);
  }, [answers, currentQuestionIndex, examId, isReviewMode, isAuthenticated, sessionId, actions]); 
  // Bổ sung đầy đủ Dependency để đảm bảo tính nhất quán của Hook

  return { message, setMessage };
};