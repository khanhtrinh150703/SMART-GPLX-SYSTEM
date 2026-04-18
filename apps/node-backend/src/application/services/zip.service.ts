import fs from 'node:fs/promises';
import unzipper from 'unzipper';
import { IZipService } from '@/domain/interfaces/services/i-zip.service';

export class ZipService implements IZipService {
  /**
   * @description Thực hiện giải nén tệp tin (Dịch: Execute file extraction)
   * Không dùng try-catch để lỗi tự ném lên tầng Application xử lý.
   */
  public async extract(sourcePath: string, targetDir: string): Promise<void> {
    // 1. Đảm bảo thư mục đích tồn tại
    await fs.mkdir(targetDir, { recursive: true });

    // 2. Mở file zip - unzipper.Open.file xử lý buffer/file cực tốt
    const directory = await unzipper.Open.file(sourcePath);
    
    // 3. Thực hiện giải nén
    await directory.extract({ 
      path: targetDir,
      concurrency: 5 
    });
  }

  /**
   * @description Dọn dẹp thư mục tạm sau khi xử lý xong (Dịch: Cleanup temporary directory)
   * @param dirPath - Đường dẫn thư mục cần xóa
   */
  public async cleanup(dirPath: string): Promise<void> {
    // fs.rm với recursive giúp xóa toàn bộ folder và file bên trong
    // force: true giúp không báo lỗi nếu thư mục đó vốn đã không tồn tại
    await fs.rm(dirPath, { recursive: true, force: true });
  }
}