export interface ITempStorageService {
    /**
     * @description Tạo thư mục tạm cho Job
     */
    createTempDir(jobId: string): Promise<void>;

    /**
     * @description Lưu một mảnh file vào thư mục tạm
     */
    saveChunk(jobId: string, index: number, buffer: Buffer): Promise<void>;

    /**
     * @description Gộp các mảnh thành file hoàn chỉnh
     */
    mergeChunks(jobId: string, totalChunks: number): Promise<string>;

    /**
     * @description Xóa thư mục tạm sau khi xử lý xong
     */
    cleanup(jobId: string): Promise<void>;

    // domain/interfaces/external/i-temp-storage.service.ts

    // Thêm các hàm mà QuestionImportProcessor cần (đã nhắc ở chat trước)
    getTempPath(jobId: string, subPath?: string): string;
    listFilesInFolder(folderPath: string): Promise<string[]>;
    readFile(folderPath: string, fileName: string): Promise<Buffer>;
}