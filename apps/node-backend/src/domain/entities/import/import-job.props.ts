import { IImportResultData } from "@/domain/entities/import/import-result.type";
import { ImportStatus } from "./import.status";

export interface IImportJobProps {
    id?: string;
    fileName: string;
    totalSize: number;
    totalChunks: number;
    chunkSizeLimit: number;
    status: ImportStatus;
    expiresAt: Date;
    resultData: IImportResultData;
    createdAt: Date;
    updatedAt: Date;
}


/**
 * @description Type phục vụ cho việc khởi tạo ImportJob mới.
 * Loại bỏ các trường hệ thống tự sinh và cho phép truyền vào các trường tùy chọn.
 */
export type CreateImportJobProps = Omit<IImportJobProps,
    | 'id'
    | 'status'
    | 'expiresAt'
    | 'resultData'
    | 'createdAt'
    | 'updatedAt'
    | 'totalChunks'      // totalChunks cũng nên tính toán bên trong
    | 'chunkSizeLimit'   // chunkSizeLimit lấy từ config
> & {
    status?: ImportStatus;
    expiresAt?: Date;
    resultData?: Partial<IImportResultData>;
    fileName: string;
    totalSize: number;
};