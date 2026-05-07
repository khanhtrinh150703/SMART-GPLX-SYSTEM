import fs from 'node:fs/promises';
import path from 'node:path';
import { IFileStorageService } from '@/domain/interfaces/services/external/i-file-storage.service';
import { StorageFolder } from '@/domain/constants/storage.constant';
import { AppError, ErrorCode } from '@/shared/errors';
import { IUploadedFile } from '@/shared/types/file.type';

/**
 * @description Service xử lý lưu trữ file vật lý tại local server (Dịch: Physical file storage service on local server)
 */
export class FileStorageService implements IFileStorageService {
  // Lấy đường dẫn từ biến môi trường, mặc định là 'public/uploads' nếu không có cấu hình
  private readonly _uploadRoot = process.env.UPLOAD_DIR || 'public/uploads';
  private readonly _tempBaseDir = path.resolve(process.cwd(), 'temp');

  /**
   * @description Lưu tệp tin với thư mục được bảo vệ bởi Type Safety
   * @param {IUploadedFile} file - File từ Multer
   * @param {StorageFolder} folder - Một trong các giá trị của STORAGE_FOLDERS
   */
  public async saveFile(file: IUploadedFile, folder: StorageFolder): Promise<string> {
    // 1. Tạo đường dẫn vật lý: public/uploads/questions/...
    const targetFolder = path.resolve(this._uploadRoot, 'uploads', folder);

    // 2. Tạo tên file duy nhất (Unique Filename)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = path.join(targetFolder, fileName);

    // 3. Thực thi mkdir & writeFile (Zero Try-Catch)
    await fs.mkdir(targetFolder, { recursive: true })
      .catch(() => { throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR); });

    await fs.writeFile(filePath, file.buffer)
      .catch(() => { throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR); });

    return `uploads/${folder}/${fileName}`;
  }

  /**
    * @description Xóa tệp tin vật lý (Dịch: Delete physical file)
    * @param {string} relativePath - Đường dẫn tương đối từ DB
    * @throws {AppError} Ném lỗi nếu không thể xóa file (Dịch: Throw error if file cannot be deleted)
    */
  public async deleteFile(relativePath: string): Promise<void> {
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    // 1. Kiểm tra sự tồn tại (Functional Style)
    const isExists = await fs.access(absolutePath)
      .then(() => true)
      .catch(() => false);

    if (!isExists) return; // Nếu file không tồn tại thì coi như đã xóa xong

    // 2. Thực hiện xóa và ném lỗi chuẩn nếu thất bại
    // Không dùng console.log, ném thẳng AppError để tầng Service xử lý
    await fs.unlink(absolutePath).catch(() => {
      throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);
    });
  }

  /**
   * @description Lưu file từ một đường dẫn vật lý tạm thời sang thư mục lưu trữ chính thức.
   * @param localPath - Đường dẫn tới file ảnh trong thư mục ZIP vừa giải nén.
   * @param folder - Tên thư mục con (VD: 'questions', 'answers').
   * @returns URL tương đối để lưu vào Database.
   */
  public async saveFromLocalPath(localPath: string, folder: string): Promise<string> {
    // 1. Kiểm tra tồn tại (Dùng .catch để ném lỗi cụ thể mà không cần khối try-catch)
    await fs.access(localPath).catch(() => {
      throw new AppError(ErrorCode.FILE.NOT_FOUND);
    });

    // 2. Tạo thư mục đích
    const targetDir = path.join(this._uploadRoot, folder);
    await fs.mkdir(targetDir, { recursive: true }).catch((err) => {
      throw new AppError(ErrorCode.FILE.UPLOAD_FAILED, `Không thể tạo thư mục: ${err.message}`);
    });

    // 3. Chuẩn bị định danh duy nhất (UUID)
    const extension = path.extname(localPath);
    const uniqueFilename = `${crypto.randomUUID()}${extension}`;
    const targetPath = path.join(targetDir, uniqueFilename);

    // 4. Copy file (Dùng .catch để xử lý lỗi vật lý như đầy ổ cứng/quyền ghi)
    await fs.copyFile(localPath, targetPath).catch((err) => {
      throw new AppError(ErrorCode.FILE.UPLOAD_FAILED, `Lỗi copy file: ${err.message}`);
    });

    // 5. Trả về đường dẫn chuẩn (Dịch: Return normalized relative path)
    return `/${path.join(folder, uniqueFilename).replace(/\\/g, '/')}`;
  }
}