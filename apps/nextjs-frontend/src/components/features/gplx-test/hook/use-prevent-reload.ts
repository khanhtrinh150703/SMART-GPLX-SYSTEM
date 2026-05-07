import { useEffect } from "react";

export const usePreventReload = (isReviewMode: boolean, isFinished: boolean) => {
  useEffect(() => {
    if (isReviewMode || isFinished) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Bắt buộc cho Chrome/Edge
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isReviewMode, isFinished]);
};