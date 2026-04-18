// domain/entities/import/import-job.props.ts

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
    createdAt?: Date;
    updatedAt?: Date;
}


/** * @description Kiểu dữ liệu để khởi tạo Entity (Cho phép optional một số trường có default logic) 
 */
export type CreateImportJobProps = Omit<IImportJobProps, 'status' | 'expiresAt' | 'resultData'> & {
    status?: ImportStatus;
    expiresAt?: Date;
    resultData?: Partial<IImportResultData>;
};