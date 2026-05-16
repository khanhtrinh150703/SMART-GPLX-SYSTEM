import { StorageFolder } from "@/domain/constants/storage.constant";
import { IUploadFile } from "@/shared/types/storage.type";

/**
 * @typedef {Express.Multer.File | string | IUploadFile} MediaSource
 * @description Nguồn media đầu vào (File, Path hoặc Object upload).
 */
export type MediaSource = Express.Multer.File | string | IUploadFile;

/**
 * @interface IMediaService
 * @description Giao diện quản lý lưu trữ và xử lý tập tin.
 */
export interface IMediaService {
  /**
   * @description Lưu một tập tin và trả về URL cố định.
   * @param source Nguồn dữ liệu cần lưu.
   * @param folder Thư mục lưu trữ đích.
   * @returns {Promise<string>} URL của tập tin sau khi lưu.
   */
  save(source: MediaSource, folder: StorageFolder): Promise<string>;

  /**
   * @description Lưu nhiều tập tin cùng lúc (thường dùng cho ảnh đáp án).
   * @param sources Danh sách nguồn dữ liệu.
   * @param folder Thư mục lưu trữ đích.
   * @returns {Promise<string[]>} Danh sách các URL tương ứng.
   */
  saveMany(sources: MediaSource[], folder: StorageFolder): Promise<string[]>;

  /**
   * @description Xóa tập tin dựa trên URL.
   * @param url Đường dẫn tập tin cần xóa.
   */
  deleteFile(url: string): Promise<void>;
}