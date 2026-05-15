import { IZipQueryService } from "@/domain/interfaces/services";
import { STORAGE_CONFIG } from "@/shared/config/storage.config";
import path from "path";

export class ZipQueryService implements IZipQueryService {
    /**
     * @description Lấy đường dẫn thư mục giải nén dựa trên ID của Job.
     * @param {string} jobId - ID của tiến trình Import.
     * @returns {string} Đường dẫn tuyệt đối đến thư mục giải nén tạm thời.
     */
    public getExtractionPath(jobId: string): string {
        return path.join(STORAGE_CONFIG.TEMP_DIR, jobId);
    }
}