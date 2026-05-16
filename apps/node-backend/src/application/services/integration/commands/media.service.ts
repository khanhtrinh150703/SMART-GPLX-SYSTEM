import { StorageFolder } from "@/domain/constants/storage.constant";
import { IFileStorageService } from "@/domain/interfaces/services/external/commands/i-file-storage.service";
import { IMediaService, MediaSource } from "@/domain/interfaces/services/integration/commands/i-media.service";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface IMediaServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết để khởi tạo MediaService.
 */
export interface IMediaServiceCradle {
    /** @description Dịch vụ hạ tầng thực hiện việc đọc/ghi tập tin vật lý. */
    fileStorageService: IFileStorageService;
}

/**
 * @class MediaService
 * @description Dịch vụ điều phối xử lý tập tin đa phương tiện (Ảnh, tài liệu).
 * @principle Abstraction Layer - Tách biệt logic nghiệp vụ khỏi các phương thức lưu trữ vật lý cụ thể.
 */
export class MediaService implements IMediaService {
    /** 
     * @private 
     * @readonly 
     * @description Instance hạ tầng lưu trữ tệp tin. 
     */
    private readonly _storage: IFileStorageService;

    /**
     * @constructor
     * @description Khởi tạo dịch vụ Media với các phụ thuộc được tiêm qua Container.
     * @param {IMediaServiceCradle} cradle - Chứa instance của FileStorageService.
     */
    constructor({ fileStorageService }: IMediaServiceCradle) {
        this._storage = fileStorageService;
    }
    
    /**
     * @description Lưu trữ phương tiện (Media) vào hệ thống dựa trên nguồn dữ liệu đầu vào.
     * Tự động điều phối giữa việc lưu từ đường dẫn cục bộ hoặc tệp tin tải lên (Multer).
     * @param {MediaSource} source - Nguồn dữ liệu: chuỗi đường dẫn (string) hoặc đối tượng tệp tin (Multer.File).
     * @param {StorageFolder} folder - Thư mục đích được chỉ định để phân loại lưu trữ.
     * @returns {Promise<string>} Đường dẫn hoặc định danh của tệp tin sau khi đã lưu trữ thành công.
     * @throws {AppError} MEDIA.SOURCE_REQUIRED - Nếu nguồn dữ liệu (source) không hợp lệ hoặc bị bỏ trống.
     */
    public async save(source: MediaSource, folder: StorageFolder): Promise<string> {
        // 1. Kiểm tra sự tồn tại của nguồn dữ liệu (Null Safety)
        if (!source) {
            throw new AppError(ErrorCode.MEDIA.SOURCE_REQUIRED);
        }

        // 2. Điều phối dựa trên kiểu dữ liệu của Source
        // Nếu là string -> Xử lý như đường dẫn cục bộ (ví dụ: từ file Zip tạm)
        if (typeof source === 'string') {
            return await this._storage.saveFromLocalPath(source, folder);
        }

        // Nếu là Object -> Xử lý như file upload từ Multer
        return await this._storage.saveFile(source, folder);
    }

    /**
     * @description Lưu trữ danh sách phương tiện hàng loạt.
     * @param {MediaSource[]} sources - Mảng các nguồn file.
     * @param {StorageFolder} folder - Thư mục đích (Bắt buộc thuộc StorageFolder).
     */
    public async saveMany(sources: MediaSource[], folder: StorageFolder): Promise<string[]> {
        // 1. Guard clause: Nếu mảng rỗng thì trả về mảng rỗng ngay, không chạy tiếp
        if (!sources || sources.length === 0) return [];

        /**
         * 2. Thực thi song song (Parallel Execution)
         */
        return await Promise.all(sources.map(s => this.save(s, folder)));
    }

    public async deleteFile(url: string): Promise<void> {
        // Chỉ thực hiện xóa nếu URL tồn tại (tránh lỗi bậy)
        if (url && url.trim() !== '') {
            await this._storage.deleteFile(url);
        }
    }
}