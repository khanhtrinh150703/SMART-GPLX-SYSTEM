import fs from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { ITempStorageService } from '@/domain/interfaces/external/i-temp-storage.service';
import { AppError, ErrorCode } from '@/shared/errors';

/**
 * @description Service xử lý lưu trữ tệp tin tạm thời (Dịch: Temporary storage service)
 * Tối ưu hóa cho việc xử lý file lớn thông qua Stream.
 */
export class TempStorageService implements ITempStorageService {
    // Đường dẫn gốc cho các file tạm
    private readonly _tempBaseDir = path.join(process.cwd(), 'temp', 'imports');

    /**
     * @description Lấy đường dẫn thư mục/file trong vùng tạm (Dịch: Get temporary path)
     */
    public getTempPath(jobId: string, subPath: string = ''): string {
        return path.join(this._tempBaseDir, jobId, subPath);
    }

    /**
     * @description Liệt kê toàn bộ file trong một folder (Dịch: List all files in folder)
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
     * @description Đọc nội dung file trả về Buffer (Dịch: Read file content as Buffer)
     */
    public async readFile(folderPath: string, fileName: string): Promise<Buffer> {
        const fullPath = path.join(folderPath, fileName);
        return await fs.readFile(fullPath).catch(() => {
            throw new AppError(ErrorCode.IMPORT.FILE_MISSING, `Could not read file: ${fileName}`);
        });
    }

    /**
     * @description Tạo thư mục tạm cho Job Import (Dịch: Create temp directory for job)
     */
    public async createTempDir(jobId: string): Promise<void> {
        const dir = this.getTempPath(jobId);
        await fs.mkdir(dir, { recursive: true }).catch(() => {
            throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR, 'Could not create temp directory');
        });
    }

    /**
     * @description Lưu mảnh file - Chunk (Dịch: Save file chunk)
     */
    public async saveChunk(jobId: string, index: number, buffer: Buffer): Promise<void> {
        const chunkPath = this.getTempPath(jobId, `${index}.part`);
        await fs.writeFile(chunkPath, buffer).catch(() => {
            throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR, 'Could not save chunk');
        });
    }

    /**
     * @description Gộp các mảnh chunk thành file ZIP hoàn chỉnh (Dịch: Merge chunks into final ZIP)
     * Sử dụng Pipeline để quản lý backpressure và tránh tràn bộ nhớ (Memory leak).
     */
    public async mergeChunks(jobId: string, totalChunks: number): Promise<string> {
        const jobDir = this.getTempPath(jobId);
        const finalPath = path.join(jobDir, 'final.zip');
        const writeStream = createWriteStream(finalPath);

        try {
            for (let i = 0; i < totalChunks; i++) {
                const partPath = path.join(jobDir, `${i}.part`);

                // Kiểm tra sự tồn tại của mảnh trước khi đọc
                const isExists = await fs.access(partPath).then(() => true).catch(() => false);
                if (!isExists) {
                    throw new AppError(ErrorCode.IMPORT.INVALID_CHUNK_INDEX, `Missing chunk at index: ${i}`);
                }

                const readStream = createReadStream(partPath);

                // Gộp chunk vào file cuối. { end: false } để không đóng writeStream sau mỗi lần gộp.
                await pipeline(readStream, writeStream, { end: false });

                // Xóa mảnh ngay sau khi gộp để tiết kiệm ổ đĩa (Dịch: Cleanup chunk after merge)
                await fs.unlink(partPath);
            }

            // Đóng stream thủ công sau khi đã xong tất cả các mảnh
            writeStream.end();

            // Đợi stream ghi xong hoàn toàn vào đĩa
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
     * @description Dọn dẹp toàn bộ thư mục tạm của Job (Dịch: Cleanup all job resources)
     */
    public async cleanup(jobId: string): Promise<void> {
        const dir = this.getTempPath(jobId);
        await fs.rm(dir, { recursive: true, force: true }).catch(() => {
            // Log error but don't necessarily block the process
            console.error(`Failed to cleanup directory for job: ${jobId}`);
        });
    }
}