import fs from 'node:fs/promises';
import unzipper from 'unzipper';
import { IZipService } from '@/domain/interfaces/services/integration/commands/i-zip.service';
import { QUEUE_CONFIG } from '@/shared/config/queue.config';

/**
 * @class ZipService
 * @description Dịch vụ hạ tầng (Infrastructure Service) chuyên trách các thao tác giải nén tệp ZIP và quản trị tệp tin tạm thời.
 * @principle Infrastructure Isolation - Cách ly hoàn toàn các logic tương tác trực tiếp với hệ thống tệp.
 */
export class ZipService implements IZipService {

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