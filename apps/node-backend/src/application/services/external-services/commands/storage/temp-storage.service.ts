import fs from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { ITempStorageService } from '@/domain/interfaces/services/external/commands/i-temp-storage.service';
import { AppError, ErrorCode } from '@/shared/errors';

/**
 * @description Service xử lý lưu trữ tệp tin tạm thời (Dịch: Temporary storage service)
 * Tối ưu hóa cho việc xử lý file lớn thông qua Stream.
 */
export class TempStorageService implements ITempStorageService {
    // Đường dẫn gốc cho các file tạm
    private readonly _tempBaseDir = path.join(process.cwd(), 'temp', 'imports');

    /**
      * @description Xây dựng đường dẫn tuyệt đối đến thư mục hoặc file cụ thể trong vùng lưu trữ tạm thời.
      * @param {string} jobId - Mã định danh duy nhất của phiên Import (UUID).
      * @param {string} [subPath=''] - Tên file hoặc thư mục con cụ thể bên trong folder của Job (ví dụ: '0.part', 'final.zip').
      * @returns {string} Đường dẫn hệ thống hoàn chỉnh (Absolute System Path).
      */
    public getTempPath(jobId: string, subPath: string = ''): string {
        return path.join(this._tempBaseDir, jobId, subPath);
    }

    /**
     * @description Liệt kê danh sách tất cả các file có trong một thư mục.
     * @param {string} folderPath - Đường dẫn tuyệt đối đến thư mục cần quét.
     * @returns {Promise<string[]>} Mảng chứa tên hoặc đường dẫn các file tìm thấy.
     */
    public async listFilesInFolder(folderPath: string): Promise<string[]> {
        try {
            const entries = await fs.readdir(folderPath, { withFileTypes: true });
            return entries
                .filter(entry => entry.isFile())
                .map(entry => entry.name);
        } catch (_) {
            return [];
        }
    }

    /**
     * @description Đọc nội dung file và trả về dưới dạng Buffer.
     * @param {string} folderPath - Đường dẫn đến thư mục chứa file.
     * @param {string} fileName - Tên file cụ thể cần đọc.
     * @returns {Promise<Buffer>} Dữ liệu thô của file dưới dạng Buffer.
     */
    public async readFile(folderPath: string, fileName: string): Promise<Buffer> {
        const fullPath = path.join(folderPath, fileName);
        return await fs.readFile(fullPath).catch(() => {
            throw new AppError(ErrorCode.IMPORT.FILE_MISSING, `Could not read file: ${fileName}`);
        });
    }

    /**
     * @description Khởi tạo thư mục tạm thời cho phiên làm việc dựa trên Job ID.
     * @param {string} jobId - Mã định danh duy nhất của phiên Import (UUID).
     * @returns {Promise<void>}
     */
    public async createTempDir(jobId: string): Promise<void> {
        const dir = this.getTempPath(jobId);
        await fs.mkdir(dir, { recursive: true }).catch(() => {
            throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR, 'Could not create temp directory');
        });
    }

    /**
     * @description Lưu trữ mảnh dữ liệu (chunk) vào thư mục tạm theo vị trí index.
     * @param {string} jobId - Mã định danh phiên làm việc (UUID).
     * @param {number} index - Số thứ tự của mảnh chunk.
     * @param {Buffer} buffer - Nội dung dữ liệu thô của mảnh.
     * @returns {Promise<void>}
     */
    public async saveChunk(jobId: string, index: number, buffer: Buffer): Promise<void> {
        const chunkPath = this.getTempPath(jobId, `${index}.part`);
        await fs.writeFile(chunkPath, buffer).catch(() => {
            throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR, 'Could not save chunk');
        });
    }

    /**
     * @description Gộp các mảnh chunk thành file hoàn chỉnh và xóa các mảnh tạm.
     * @param {string} jobId - Mã định danh phiên làm việc (UUID).
     * @param {number} totalChunks - Tổng số lượng mảnh cần gộp.
     * @returns {Promise<string>} Đường dẫn đến file ZIP cuối cùng.
     */
    public async mergeChunks(jobId: string, totalChunks: number): Promise<string> {
        const jobDir = this.getTempPath(jobId);
        const finalPath = path.join(jobDir, 'final.zip');
        const writeStream = createWriteStream(finalPath);

        try {
            for (let i = 0; i < totalChunks; i++) {
                const partPath = path.join(jobDir, `${i}.part`);

                // 1. Kiểm tra sự tồn tại (Dùng hằng số fs.constants.F_OK cho chuẩn)
                try {
                    await fs.access(partPath);
                } catch {
                    throw new AppError(ErrorCode.IMPORT.INVALID_CHUNK_INDEX, `Missing chunk at index: ${i}`);
                }

                // 2. Sử dụng for await để đọc từng mảnh và ghi vào writeStream
                // Cách này xử lý backpressure cực tốt mà không cần pipeline lồng vòng lặp
                const readStream = createReadStream(partPath);
                for await (const chunk of readStream) {
                    const canContinue = writeStream.write(chunk);

                    // Nếu buffer đầy (backpressure), đợi cho đến khi nó rỗng (drain)
                    if (!canContinue) {
                        await new Promise((resolve) => writeStream.once('drain', resolve));
                    }
                }

                // 3. Xóa mảnh ngay sau khi gộp xong mảnh đó
                await fs.unlink(partPath);
            }

            // 4. Kết thúc ghi file
            writeStream.end();

            // Đợi stream ghi xong hoàn toàn vào đĩa (Dùng utility finished của stream cho sạch)
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            return finalPath;
        } catch (error) {
            writeStream.destroy();
            if (error instanceof AppError) throw error;
            throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR, 'Merge process failed');
        }
    }

    /**
     * @description Xóa bỏ toàn bộ thư mục tạm và tài nguyên liên quan đến Job ID.
     * @param {string} jobId - Mã định danh phiên làm việc (UUID).
     * @returns {Promise<void>}
     */
    public async cleanup(jobId: string): Promise<void> {
        const dir = this.getTempPath(jobId);
        await fs.rm(dir, { recursive: true, force: true }).catch(() => {
            // Log error but don't necessarily block the process
            console.error(`Failed to cleanup directory for job: ${jobId}`);
        });
    }
}