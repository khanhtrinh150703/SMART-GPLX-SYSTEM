import fs from 'node:fs/promises';
import path from 'node:path';
import unzipper from 'unzipper';
import { IZipService } from '@/domain/interfaces/services/integration/i-zip.service';
import { STORAGE_CONFIG } from '@/shared/config/storage.config';
import { QUEUE_CONFIG } from '@/shared/config/queue.config';

/**
 * @description Dịch vụ xử lý giải nén file ZIP và dọn dẹp hệ thống file.
 * Nằm ở tầng Infrastructure để cách ly logic I/O (File System) khỏi tầng Application.
 */
export class ZipService implements IZipService {

  /**
   * @description Lấy đường dẫn thư mục giải nén dựa trên ID của Job.
   * @param {string} jobId - ID của tiến trình Import.
   * @returns {string} Đường dẫn tuyệt đối đến thư mục giải nén tạm thời.
   */
  public getExtractionPath(jobId: string): string {
    return path.join(STORAGE_CONFIG.TEMP_DIR, jobId);
  }

  /**
   * @description Thực hiện giải nén tệp tin (Execute file extraction).
   * @param {string} sourcePath - Đường dẫn file ZIP gốc.
   * @param {string} targetDir - Thư mục đích để giải nén nội dung.
   * @returns {Promise<void>}
   */
  public async extract(sourcePath: string, targetDir: string): Promise<void> {
    // 1. Đảm bảo thư mục đích tồn tại trước khi giải nén
    await fs.mkdir(targetDir, { recursive: true });

    // 2. Mở file zip - unzipper.Open.file tối ưu hóa việc đọc luồng (stream)
    const directory = await unzipper.Open.file(sourcePath);

    // 3. Thực hiện giải nén song song (concurrency: 5) giúp tăng tốc độ
    await directory.extract({
      path: targetDir,
      concurrency: QUEUE_CONFIG.concurrency
    });
  }

  /**
   * @description Dọn dẹp thư mục hoặc file tạm sau khi xử lý xong (Cleanup temporary items).
   * @param {string} targetPath - Đường dẫn thư mục hoặc file cần xóa.
   * @returns {Promise<void>}
   */
  public async cleanup(targetPath: string): Promise<void> {
    await fs.rm(targetPath, { recursive: true, force: true });
  }
}