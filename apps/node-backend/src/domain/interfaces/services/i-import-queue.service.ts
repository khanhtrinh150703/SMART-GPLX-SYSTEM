// domain/interfaces/services/i-import-queue.service.ts
export interface IImportQueueService {
    /**
     * @description Thêm job vào hàng đợi xử lý ngầm
     * @param {string} jobId - ID của phiên import
     * @param {string} filePath - Đường dẫn vật lý đến file ZIP đã gộp
     */
    addImportJob(jobId: string, filePath: string): Promise<void>;
}