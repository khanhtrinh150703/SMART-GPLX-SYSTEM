// src/features/question/hooks/use-import-questions.ts
import { useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { ImportService } from "../services/import.service";
import { 
  ImportMutationParams, 
  IImportJobStatusDTO 
} from "../types/import.types";

/**
 * @description Custom hook to manage the full lifecycle of question import:
 * 1. ZIP Packaging & Chunked Upload (Giai đoạn tải lên)
 * 2. Background Processing Polling (Giai đoạn xử lý ngầm)
 * (Hook tùy chỉnh quản lý toàn bộ vòng đời nhập câu hỏi)
 */
export const useImportQuestions = (): {
  mutation: UseMutationResult<IImportJobStatusDTO, Error, ImportMutationParams>;
  uploadProgress: number;
  processStatus: IImportJobStatusDTO | null;
} => {
  // State for upload percentage (Tiến độ tải tệp lên - % )
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // State for background worker status (Trạng thái xử lý của worker chạy ngầm)
  const [processStatus, setProcessStatus] = useState<IImportJobStatusDTO | null>(null);

  const mutation = useMutation({
    /**
     * @description Combined mutation function for upload and polling
     * (Hàm biến đổi kết hợp việc tải lên và truy vấn trạng thái)
     */
    mutationFn: async ({ excelFile, assetMap }: ImportMutationParams): Promise<IImportJobStatusDTO> => {
      // GIAI ĐOẠN 1: Upload (Tải lên)
      // Gọi service để nén ZIP và đẩy các mảnh song song (Parallel)
      const uploadResponse = await ImportService.processAndUploadZip(
        excelFile, 
        assetMap, 
        (p) => setUploadProgress(p)
      );
      const jobId = uploadResponse.data?.jobId;
      if (!jobId) {
        throw new Error("MISSING_JOB_ID: Initialization failed.");
      }

      // GIAI ĐOẠN 2: Polling (Truy vấn trạng thái)
      // Sau khi hoàn tất upload, bắt đầu theo dõi tiến độ của Worker (Excel -> DB)
      return await ImportService.pollImportStatus(jobId, (status) => {
        setProcessStatus(status);
      });
    },
    
    // Reset states on mutate (Làm mới các trạng thái khi bắt đầu thực hiện)
    onMutate: () => {
      setUploadProgress(0);
      setProcessStatus(null);
    },
  });

  return {
    mutation,
    uploadProgress,
    processStatus,
  };
};