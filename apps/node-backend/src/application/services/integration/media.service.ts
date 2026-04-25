import { StorageFolder } from "@/domain/constants/storage.constant";
import { IFileStorageService } from "@/domain/interfaces/external/i-file-storage.service";
import { IMediaService, MediaSource } from "@/domain/interfaces/services/integration/i-media.service";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Kiểu dữ liệu nguồn: Có thể là File từ Web (Multer) hoặc Path hệ thống (String).
 */
export interface IMediaServiceCradle {
    fileStorageService: IFileStorageService;
}

export class MediaService implements IMediaService {
    private readonly _storage: IFileStorageService;

    constructor({ fileStorageService }: IMediaServiceCradle) {
        this._storage = fileStorageService;
    }

    /**
     * @description Lưu trữ một phương tiện (Media) đơn lẻ.
     * @param {MediaSource} source - Nguồn file (Multer File hoặc Path string).
     * @param {StorageFolder} folder - Thư mục đích (Đã được định nghĩa sẵn).
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