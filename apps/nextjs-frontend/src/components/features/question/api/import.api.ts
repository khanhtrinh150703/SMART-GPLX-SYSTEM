// src/features/question/api/import.api.ts
import { StandardResponse } from "@/types/common.type";
import axiosClient from "@/services/axios-client";
import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import { 
  IImportJobResponseDTO, 
  IImportJobStatusDTO, 
  ImportFinalResponse 
} from "../types/import.types";

/**
 * @description API layer for handling Question Import process
 * (Tầng API xử lý quy trình nhập câu hỏi)
 */
export const ImportApi = {
  /**
   * @description Initialize a new import session 
   * (Khởi tạo một phiên nhập dữ liệu mới)
   */
  init: async (totalSize: number): Promise<StandardResponse<IImportJobResponseDTO>> => {
    const response = await axiosClient.post<StandardResponse<IImportJobResponseDTO>>(
      ENDPOINTS.IMPORT.INIT, 
      { totalSize }
    );
    return response.data;
  },

  /**
   * @description Upload an individual file chunk 
   * (Tải lên một mảnh tệp riêng lẻ)
   */
  uploadChunk: async (formData: FormData): Promise<StandardResponse<null>> => {
    const response = await axiosClient.post<StandardResponse<null>>(
      ENDPOINTS.IMPORT.UPLOADCHUNK, 
      formData, 
    );
    return response.data;
  },

  /**
   * @description Finalize the upload and trigger the background worker
   * (Hoàn tất việc tải lên và kích hoạt trình xử lý chạy ngầm)
   */
  complete: async (jobId: string): Promise<StandardResponse<ImportFinalResponse>> => {
    const response = await axiosClient.post<StandardResponse<ImportFinalResponse>>(
      ENDPOINTS.IMPORT.COMPLETE, 
      { jobId }
    );
    return response.data;
  },

  /**
   * @description Get the current status of the import job (Polling)
   * (Lấy trạng thái hiện tại của công việc nhập dữ liệu - Truy vấn liên tục)
   */
  getStatus: async (jobId: string): Promise<StandardResponse<IImportJobStatusDTO>> => {
    const response = await axiosClient.get<StandardResponse<IImportJobStatusDTO>>(
      `${ENDPOINTS.IMPORT.STATUS}/${jobId}`
    );
    return response.data;
  },
};