// src/features/gplx-test/hooks/use-exam-taking-actions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examUserService } from "../service/exam-user.service";
import { ICompleteExamRequestDTO } from "../types/exam-complete.types";
import { useUserStore } from "@/store/user/user.store";
import { useExamStore } from "../store/exam.store.";

/**
 * @description Hook chuyên trách thao tác nộp bài và kết thúc phiên thi (Exam Submission Hook).
 * Tự động điều phối giữa luồng User và Guest.
 */
export const useExamTakingActions = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useUserStore();
  const { resetStore } = useExamStore(); // Hàm dọn dẹp Zustand Store

  // Xác định trạng thái đăng nhập (Authentication State)
  const isAuthenticated = !!accessToken && accessToken !== "undefined";

  const EXAM_KEY = ["exams"];
  const SESSION_KEY = ["active-session"];

  /**
   * @description Xử lý sau khi nộp bài thành công (Post-submission Cleanup)
   */
  const handleSubmitSuccess = async () => {
    // Thực hiện song song các tác vụ dọn dẹp (Parallel Execution)
    await Promise.all([
      // 1. Xóa phiên làm bài dở dang trong Cache (Clear Query Cache)
      queryClient.removeQueries({ queryKey: [...SESSION_KEY, "current"] }),
      
      // 2. Làm mới lịch sử thi nếu là User (Invalidate History)
      isAuthenticated 
        ? queryClient.invalidateQueries({ queryKey: [...EXAM_KEY, "history"] })
        : Promise.resolve(),
      
      // 3. Reset toàn bộ trạng thái làm bài local (Zustand Reset)
      resetStore()
    ]);
  };

  // 1. Mutation nộp bài cho Người dùng (User Submission)
  const userMutation = useMutation({
    mutationFn: (payload: ICompleteExamRequestDTO) => examUserService.submit(payload),
    onSuccess: handleSubmitSuccess,
  });

  // 2. Mutation nộp bài cho Khách (Guest Submission)
  const guestMutation = useMutation({
    mutationFn: (payload: ICompleteExamRequestDTO) => examUserService.submitAsGuest(payload),
    onSuccess: handleSubmitSuccess,
  });

  /**
   * @description Action nộp bài hợp nhất (Unified Submit Action)
   * UI chỉ cần gọi hàm này, Hook tự biết gọi API nào.
   */
  const submitAction = isAuthenticated 
    ? userMutation.mutateAsync 
    : guestMutation.mutateAsync;

  return {
    actions: {
      submitExamAction: submitAction,
    },
    // Trạng thái loading và kết quả (State & Data)
    isSubmitting: userMutation.isPending || guestMutation.isPending,
    isSubmitSuccess: userMutation.isSuccess || guestMutation.isSuccess,
    result: userMutation.data?.data || guestMutation.data?.data,
  };
};