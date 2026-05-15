"use client";

import { useCallback } from "react";
import { useExamStore } from "../store/exam.store.";

/**
 * useExamSessionManager: Hook quản lý việc vào/ra không gian thi.
 * (Hook managing the entry/exit of the exam workspace.)
 */
export const useExamSessionManager = (
  setActiveExamId: (id: string | null) => void,
) => {
  const resetStore = useExamStore((s) => s.resetStore);
  const isFinished = useExamStore((s) => s.isFinished);
  const answers = useExamStore((s) => s.answers);

  /**
   * handleJoinExamRoom: Chuẩn bị dữ liệu sạch và kích hoạt phòng thi.
   * (Prepare clean data and activate the exam room.)
   */
  const handleJoinExamRoom = useCallback(
    (id: string) => {
      // 1. Reset Store để đảm bảo không còn dữ liệu rác từ đề thi trước.
      // (Reset Store to ensure no stale data from previous exams.)
      resetStore();

      // 2. Kích hoạt ID đề thi để UI Render Container.
      // (Activate exam ID for UI to render the Container.)
      setActiveExamId(id);
    },
    [resetStore, setActiveExamId],
  );

  /**
   * handleExitExamRoom: Kiểm tra điều kiện thoát và dọn dẹp trạng thái.
   * (Check exit conditions and clean up state.)
   */
  const handleExitExamRoom = useCallback(() => {
    const hasProgress = Object.keys(answers).length > 0;

    if (hasProgress && !isFinished) {}

    // 1. Giải phóng Body Scroll (Mở khóa cuộn trang nếu bị kẹt)
    // (Unlock body scroll if it was locked by modals)
    document.body.style.overflow = "unset";

    // 2. Dọn dẹp Store và thoát
    resetStore();
    setActiveExamId(null);
  }, [answers, isFinished, resetStore, setActiveExamId]);

  return {
    handleJoinExamRoom,
    handleExitExamRoom,
  };
};
