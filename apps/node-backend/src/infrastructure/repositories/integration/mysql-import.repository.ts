import { ImportJobEntity } from "@/domain/entities/import/import-job.entity";
import { IImportJobRepository } from "@/domain/interfaces/repositories/integration/i-import-job.repository";
import { ImportMapper } from "@/infrastructure/database/mappers/integration/import.mapper";
import { IImportJobRecord } from "@/infrastructure/persistence/integration/import.record";
import { PrismaClient } from "@prisma/client";

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
    public async createImportJob(entity: ImportJobEntity): Promise<ImportJobEntity> {
        // 1. Chuyển đổi sang persistence 
        const persistence = ImportMapper.toPersistence(entity);
        // 2. Thực hiện Upsert 
        const record = await this._prisma.importJob.create({
            data: persistence,
        });

        // 3. Trả về Domain Entity thông qua Mapper
        return ImportMapper.toDomain(record);
    }

    public async updateImportJob(entity: ImportJobEntity): Promise<ImportJobEntity> {
        const persistence = ImportMapper.toPersistence(entity);
        const { id, ...updateData } = persistence;
        const record = await this._prisma.importJob.update({
            where: { id: id },
            data: updateData
        });

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