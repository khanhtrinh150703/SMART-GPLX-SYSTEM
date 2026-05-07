// src/hooks/use-refresh-data.ts
import { useQueryClient } from "@tanstack/react-query";

export const useRefreshData = () => {
  const queryClient = useQueryClient();

  return {
    // Khi sửa License hoặc Chapter (Xóa diện rộng)
    refreshSystem: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    // Khi chỉ sửa nội dung câu hỏi
    refreshQuestions: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    }
  };
};