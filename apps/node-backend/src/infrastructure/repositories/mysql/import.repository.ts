import { ImportJobEntity } from "@/domain/entities/import/import-job.entity";
import { IImportJobRepository } from "@/domain/interfaces/repositories/i-import-job.repository";
import { ImportMapper } from "@/infrastructure/database/mappers/import.mapper";
import { IImportJobRecord } from "@/infrastructure/persistence/import.record";
import { Prisma, PrismaClient } from "@prisma/client";

// Interface định nghĩa các dependencies cần thiết cho Repository này
interface ImportRepositoryDeps {
    prisma: PrismaClient;
}

export class MySQLImportRepository implements IImportJobRepository {
    private readonly _prisma: PrismaClient;

    constructor(deps: ImportRepositoryDeps) {
        this._prisma = deps.prisma;
    }


    /**
     * @description Lưu hoặc cập nhật thông tin phiên import vào Database
     * @param {ImportJobEntity} entity - Thực thể nghiệp vụ cần lưu
     * @returns {Promise<ImportJobEntity>} Thực thể đã được lưu (kèm ID nếu tạo mới)
     */
    public async save(entity: ImportJobEntity): Promise<ImportJobEntity> {
        // 1. Chuyển đổi sang persistence format ( camelCase 100% )
        const persistence = ImportMapper.toPersistence(entity);

        // 2. Tách ID để xác định Create hay Update
        const { id, ...data } = persistence;
        const result = data.resultData;
        // Chuẩn bị dữ liệu cho Prisma (Đảm bảo khớp với Schema đã cập nhật)
        const prismaData: Prisma.ImportJobUncheckedCreateInput = {
            fileName: data.fileName!,
            totalSize: data.totalSize!,
            totalChunks: data.totalChunks!,
            chunkSizeLimit: data.chunkSizeLimit!, // Bổ sung
            status: data.status!,
            expiresAt: data.expiresAt!,           // Bổ sung
            resultData: (result as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        };

        let record: IImportJobRecord;

        if (id) {
            // --- CẬP NHẬT (Update) ---
            record = await this._prisma.importJob.update({
                where: { id },
                data: prismaData as Prisma.ImportJobUpdateInput,
            }) as IImportJobRecord;
        } else {
            // --- TẠO MỚI (Create) ---
            record = await this._prisma.importJob.create({
                data: prismaData,
            }) as IImportJobRecord;
        }

        // 3. Trả về Domain Entity thông qua Mapper
        return ImportMapper.toDomain(record);
    }

    /**
     * @description Tìm một phiên Import theo ID
     * @param {string} id - Mã định danh Job
     * @returns {Promise<ImportJobEntity | null>}
     */
    public async findById(id: string): Promise<ImportJobEntity | null> {
        const record = await this._prisma.importJob.findUnique({
            where: { id },
        }) as unknown as IImportJobRecord | null;

        if (!record) return null;
        return ImportMapper.toDomain(record);
    }
}