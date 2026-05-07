// src/features/exam-mgmt/hooks/use-exam-actions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examService } from "../service/exam.service";
import { examGenService } from "../service/exam-generation.service";
import { ICreateManualExamDTO } from "../types/exam.types";
import { IGenerateExamDTO } from "../types/exam-generation";

/**
 * @description Hook chuyên trách các thao tác thay đổi Đề thi (Mutation-only hook)
 */
export const useExamActions = () => {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["exams"];

  const handleSuccess = async () => {
    // Ép buộc xóa cache và fetch lại toàn bộ danh sách đề thi
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEY,
      exact: false, // Bắt mọi thứ liên quan đến exams
      refetchType: "all", // Ép fetch lại dù component đang ẩn hay hiện
    });
  };
  
  // 1. Sinh đề tự động (Auto Generation)
  const generateAuto = useMutation({
    mutationFn: (data: IGenerateExamDTO) => examGenService.generateAuto(data),
    onSuccess: handleSuccess,
  });

  // 2. Tạo đề thủ công (Manual Creation)
  const createManual = useMutation({
    mutationFn: (data: ICreateManualExamDTO) => examService.createManual(data),
    onSuccess: handleSuccess,
  });

  // 3. Cập nhật đề thi (Update)
  const updateExam = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICreateManualExamDTO> }) =>
      examService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
    },
  });

  // 4. Xóa đề thi (Delete)
  const deleteExam = useMutation({
    mutationFn: (id: string) => examService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  // 5. Khôi phục đề thi (Restore)
  const restoreExam = useMutation({
    mutationFn: (id: string) => examService.restore(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    // Mutation functions (async)
    actions: {
      generateAuto: generateAuto.mutateAsync,
      createManual: createManual.mutateAsync,
      update: updateExam.mutateAsync,
      delete: deleteExam.mutateAsync,
      restore: restoreExam.mutateAsync,
    },

    // Global loading states for UI
    isGenerating: generateAuto.isPending,
    isMutating:
      createManual.isPending ||
      updateExam.isPending ||
      deleteExam.isPending ||
      restoreExam.isPending,
  };
};