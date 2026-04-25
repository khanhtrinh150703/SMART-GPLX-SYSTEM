import JSZip from "jszip";
import { ImportApi } from "../api/import.api";
import {
  AssetInfo,
  IImportJobStatusDTO,
  ImportFinalResponse
} from "../types/import.types";
import { StandardResponse } from "@/types/common.type";

/**
 * @description Constants for upload configuration
 * (Các hằng số cấu hình cho việc tải lên)
 */
const MAX_CONCURRENT = 3; // Max parallel requests (Giới hạn yêu cầu song song)
const POLLING_INTERVAL = 2000; // 2 seconds (Khoảng thời gian truy vấn lại)

export const ImportService = {

  /**
   * @description Xử lý đóng gói ZIP và tải lên theo cơ chế Chunking Bất đồng bộ
   * @param {File} excelFile - File câu hỏi Excel
   * @param {Map<string, AssetInfo>} assetMap - Map chứa file ảnh (Key: fileName, Value: AssetInfo)
   * @param {Function} onProgress - Callback cập nhật % tiến độ cho UI
   * @returns {Promise<StandardResponse<ImportFinalResponse>>} Trả về kết quả của hàm complete
   */
  processAndUploadZip: async (
    excelFile: File,
    assetMap: Map<string, AssetInfo>,
    onProgress: (percent: number) => void
  ): Promise<StandardResponse<ImportFinalResponse>> => {

    // 1. Packaging Data (Đóng gói ZIP)
    const zip = new JSZip();
    zip.file("questions.xlsx", excelFile);
    const imgFolder = zip.folder("images");

    assetMap.forEach((val, key) => {
      if (imgFolder) imgFolder.file(key, val.file);
    });

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });

    // 2. Initialize Session (Khởi tạo phiên làm việc với BE)
    // SỬA LỖI: Truyền đúng 1 tham số kiểu number (zipBlob.size) theo ImportApi
    const resInit = await ImportApi.init(zipBlob.size);

    if (!resInit.success || !resInit.data) {
      throw new Error(resInit.message || "Không thể khởi tạo phiên làm việc.");
    }

    // Lấy cấu hình từ BE
    const { jobId, chunkSizeLimit } = resInit.data;

    // 3. Chunking Logic
    const dynamicChunkSize = chunkSizeLimit || 5 * 1024 * 1024; // Fallback 5MB
    const totalChunks = Math.ceil(zipBlob.size / dynamicChunkSize);

    for (let i = 0; i < totalChunks; i += MAX_CONCURRENT) {
      // SỬA LỖI: Khai báo mảng Promise khớp với kiểu trả về <null> của uploadChunk
      const pPool: Promise<StandardResponse<null>>[] = [];

      for (let j = i; j < Math.min(i + MAX_CONCURRENT, totalChunks); j++) {
        const start = j * dynamicChunkSize;
        const end = Math.min(start + dynamicChunkSize, zipBlob.size);
        const chunk = zipBlob.slice(start, end);

        const fd = new FormData();
        fd.append("jobId", jobId);
        fd.append("index", j.toString());
        fd.append("chunk", chunk);

        pPool.push(ImportApi.uploadChunk(fd));
      }

      // Thực thi batch upload song song
      await Promise.all(pPool);

      // Cập nhật tiến độ tải lên (Dịch: Update upload progress)
      const currentPercent = Math.round(((i + pPool.length) / totalChunks) * 100);
      onProgress(currentPercent);
    }

    // 4. Finalize & Trigger Worker (Xác nhận hoàn tất để BE đưa vào Queue)
    // SỬA LỖI: Trả về ImportFinalResponse khớp với chữ ký của hàm
    return await ImportApi.complete(jobId);
  },

  /**
   * @description Poll the server for job status until completion or failure
   * (Truy vấn máy chủ lấy trạng thái công việc cho đến khi hoàn thành/thất bại)
   */
  pollImportStatus: async (
    jobId: string,
    onStatusUpdate: (status: IImportJobStatusDTO) => void
  ): Promise<IImportJobStatusDTO> => {
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          // Lấy StandardResponse trực tiếp từ ImportApi
          const response = await ImportApi.getStatus(jobId);
          
          if (!response.success || !response.data) {
            reject(new Error(response.message || "Lỗi khi truy vấn trạng thái xử lý."));
            return;
          }

          const statusData = response.data;
          onStatusUpdate(statusData);

          if (statusData.status === "COMPLETED") {
            resolve(statusData);
          } else if (statusData.status === "FAILED") {
            reject(new Error("Tiến trình import trên máy chủ đã thất bại."));
          } else {
            // Tiếp tục truy vấn nếu chưa xong
            setTimeout(checkStatus, POLLING_INTERVAL);
          }
        } catch (error) {
           // Bắt lỗi Network hoặc Server (5xx, 4xx) để tránh kẹt Promise
           reject(error);
        }
      };

      // Bắt đầu vòng lặp polling
      checkStatus();
    });
  }
};