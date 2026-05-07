export interface IZipQueryService {
    /**
     * @description Xác định đường dẫn thư mục lưu trữ tạm thời cho quá trình giải nén.
     * Đảm bảo tính riêng biệt cho từng tiến trình xử lý (Job) để tránh xung đột dữ liệu.
     * @param jobId - Mã định danh duy nhất của tiến trình Import.
     * @returns {string} Đường dẫn vật lý đến thư mục giải nén.
     */
    getExtractionPath(jobId: string): string;
}