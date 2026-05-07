import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IStartSessionInputDTO, IUpdateAnswerInputDTO } from "../types/active-session.types";
import { activeSessionService } from "../service/active-session.service";
import { useMemo } from "react";

/**
 * @description Hook quản lý phiên làm bài (Khởi tạo và Đồng bộ nháp)
 */
export const useActiveSessionActions = () => {
  const queryClient = useQueryClient();
  const SESSION_KEY = ["active-session"];

  const handleSuccess = async () => {
    // Luôn làm mới thông tin phiên hiện tại sau khi có thay đổi (trừ Sync để tránh spam)
    await queryClient.invalidateQueries({
      queryKey: [...SESSION_KEY, "current"],
      exact: true,
    });
  };

  // 1. Bắt đầu phiên thi thử (Guest)
  const startGuest = useMutation({
    mutationFn: (dto: IStartSessionInputDTO) => activeSessionService.startGuest(dto),
    onSuccess: handleSuccess,
  });

  // 2. Bắt đầu phiên thi chính thức (User)
  const startOfficial = useMutation({
    mutationFn: (dto: IStartSessionInputDTO) => activeSessionService.startOfficial(dto),
    onSuccess: handleSuccess,
  });

  // 3. Đồng bộ đáp án (Sync - Không cần invalidate cache liên tục để tối ưu hiệu năng)
  const syncAnswer = useMutation({
    mutationFn: (dto: IUpdateAnswerInputDTO) => activeSessionService.sync(dto),
  });

  // 3. Đồng bộ đáp án (Sync - Không cần invalidate cache liên tục để tối ưu hiệu năng)
  const deleteSession = useMutation({
    mutationFn: activeSessionService.terminate,
  });

  const actions = useMemo(() => ({
    startGuest: startGuest.mutateAsync,
    startOfficial: startOfficial.mutateAsync,
    sync: syncAnswer.mutateAsync,
    deleteSession: deleteSession.mutateAsync
  }), [startGuest.mutateAsync, startOfficial.mutateAsync, syncAnswer.mutateAsync, deleteSession.mutateAsync]);

  return {
    actions,
    // Trạng thái loading cho UI
    isStarting: startGuest.isPending || startOfficial.isPending,
    isSyncing: syncAnswer.isPending,
  };
};