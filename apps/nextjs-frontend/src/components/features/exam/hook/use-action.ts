import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examService } from "../service/exam.service";
import { examGenService } from "../service/exam-generation.service";
import { ICreateManualExamDTO } from "../types/exam.types";
import { IGenerateExamDTO } from "../types/exam-generation";

export const useExamActions = () => {
  const queryClient = useQueryClient();
  // QUERY_KEY gốc để quản lý toàn bộ cache liên quan

  // src/features/exam-mgmt/hooks/use-exam-actions.ts
  const handleSuccess = async () => {
    // 2. Lệnh cưỡng chế: Xóa sạch sành sanh và ép gọi lại bất kể active hay inactive
    await queryClient.resetQueries({
      queryKey: ["exams"],
      exact: false,
    });

    // 3. Nếu vẫn im ru, dùng lệnh "tàn sát" cuối cùng:
    await queryClient.refetchQueries({
      queryKey: ["exams"],
      type: "all", // Ép cả những thằng đang ẩn cũng phải fetch lại
      exact: false,
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

  // 3. Cập nhật đề thi (Update Exam)
  const updateExam = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ICreateManualExamDTO>;
    }) => examService.update(id, data),
    onSuccess: async () => {
      // Đảm bảo các query chi tiết cũng bị xóa
      await handleSuccess();
    },
  });

  // 4. Xóa đề thi (Delete Exam)
  const deleteExam = useMutation({
    mutationFn: (id: string) => examService.delete(id),
    onSuccess: handleSuccess,
  });

  // 5. Khôi phục đề thi (Restore Exam)
  const restoreExam = useMutation({
    mutationFn: (id: string) => examService.restore(id),
    onSuccess: handleSuccess,
  });

  return {
    actions: {
      generateAuto: generateAuto.mutateAsync,
      createManual: createManual.mutateAsync,
      update: updateExam.mutateAsync,
      delete: deleteExam.mutateAsync,
      restore: restoreExam.mutateAsync,
    },
    isGenerating: generateAuto.isPending,
    isMutating:
      createManual.isPending ||
      updateExam.isPending ||
      deleteExam.isPending ||
      restoreExam.isPending,
  };
};
