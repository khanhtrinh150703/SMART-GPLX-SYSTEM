import fs from 'fs/promises';
import path from 'path';
import { IUploadedFile } from '../../shared/types/file.type';
import { IFileStorageService } from '@/domain/interfaces/external/i-file-storage.service';

/**
 * Service xử lý lưu trữ file vật lý tại local server
 */
export class FileStorageService implements IFileStorageService {
  private readonly _uploadRoot = 'uploads';

  /**
   * Lưu file từ bộ nhớ vào thư mục chỉ định
   * @param {IUploadedFile} file - Đối tượng file từ middleware upload
   * @param {string} folder - Thư mục con muốn lưu (vd: 'avatars')
   * @returns {Promise<string>} Đường dẫn URL của file sau khi lưu
   */
  async saveFile(file: IUploadedFile, folder: string): Promise<string> {
    const targetFolder = path.join(this._uploadRoot, folder);
    
    // Đảm bảo thư mục tồn tại
    await fs.mkdir(targetFolder, { recursive: true });

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(targetFolder, fileName);

    // Ghi file từ buffer
    await fs.writeFile(filePath, file.buffer);

    // Trả về path định dạng chuẩn để lưu DB (vd: uploads/avatars/abc.jpg)
    return filePath.replace(/\\/g, '/');
  }
}