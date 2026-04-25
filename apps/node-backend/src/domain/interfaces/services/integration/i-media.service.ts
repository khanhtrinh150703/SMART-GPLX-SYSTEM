import { StorageFolder } from "@/domain/constants/storage.constant";
import { IUploadFile } from "@/shared/types/storage.type";

/**
 * @description Kiểu dữ liệu nguồn của Media: Có thể là File từ Request hoặc Path từ hệ thống.
 */
export type MediaSource = Express.Multer.File | string | IUploadFile; 

export interface IMediaService {
  /**
   * @description Lưu trữ media từ bất kỳ nguồn nào và trả về URL bền vững.
   */
  save(source: MediaSource, folder: StorageFolder): Promise<string>;

  /**
   * @description Xử lý lưu trữ hàng loạt (Dùng cho ảnh đáp án).
   */
  saveMany(sources: MediaSource[], folder: StorageFolder): Promise<string[]>;

  /**
   * @description Xóa media cũ khi cập nhật hoặc xóa thực thể.
   */
  deleteFile(url: string): Promise<void>;
}