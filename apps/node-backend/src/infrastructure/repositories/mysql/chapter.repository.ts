import { PrismaClient } from '@prisma/client';
import { IChapterRepository } from '@/domain/interfaces/repositories/i-chapter.repository';
import { Chapter } from '@/domain/entities/chapter/chapter.entity';
import { ChapterMapper } from '@/infrastructure/database/mappers/chapter.mapper';
import { ICradle } from '@/shared/types/container.types';
import { IChapterRecord } from '@/infrastructure/persistence/chapter.record';

/**
 * @description Triển khai Repository cho Chương lý thuyết sử dụng MySQL và Prisma ORM.
 * Thực hiện các thao tác truy vấn dữ liệu thô và ánh xạ về Domain Entity để xử lý nghiệp vụ.
 */
export class MySQLChapterRepository implements IChapterRepository {
    private readonly _prisma: PrismaClient;

    /**
     * @description Khởi tạo Repository với instance Prisma từ DI Container.
     */
    constructor({ prisma }: ICradle) {
        this._prisma = prisma;
    }

    /**
     * @description Truy vấn toàn bộ danh sách chương lý thuyết chưa bị xóa, sắp xếp theo thứ tự hiển thị.
     * @returns {Promise<Chapter[]>}
     */
    public async findAll(): Promise<Chapter[]> {
        const records = await this._prisma.chapter.findMany({
            where: { deletedAt: null },
            orderBy: { orderIndex: 'asc' }
        }) as unknown as IChapterRecord[];

        return records.map(ChapterMapper.toDomain);
  }

    /**
     * @description Tìm kiếm một chương lý thuyết đang hoạt động dựa trên ID.
     * @param {string} id - UUID của chương.
     * @returns {Promise<Chapter | null>}
     */
    public async findById(id: string): Promise<Chapter | null> {
        const record = await this._prisma.chapter.findFirst({
            where: { id, deletedAt: null }
        }) as unknown as IChapterRecord | null;

        return record ? ChapterMapper.toDomain(record) : null;
    }

    /**
     * @description Truy vấn thông tin chương bao gồm cả các bản ghi đã bị xóa mềm (phục vụ Restore/History).
     * @param {string} id - UUID của chương.
     * @returns {Promise<Chapter | null>}
     */
    public async findByIdIncludingDeleted(id: string): Promise<Chapter | null> {
        const record = await this._prisma.chapter.findFirst({
            where: { id }
        }) as unknown as IChapterRecord | null;

        return record ? ChapterMapper.toDomain(record) : null;
    }

    /**
     * @description Tìm kiếm chương lý thuyết theo tên (để kiểm tra tính duy nhất khi tạo/cập nhật).
     * @param {string} name - Tên chương cần tìm.
     * @returns {Promise<Chapter | null>}
     */
    public async findByName(name: string): Promise<Chapter | null> {
        const record = await this._prisma.chapter.findFirst({
            where: { name, deletedAt: null }
        }) as unknown as IChapterRecord | null;

        return record ? ChapterMapper.toDomain(record) : null;
    }

    /**
     * @description Lưu trữ một chương lý thuyết mới vào cơ sở dữ liệu.
     * @param {Chapter} chapter - Thực thể Domain cần bền vững hóa.
     * @returns {Promise<void>}
     */
    public async save(chapter: Chapter): Promise<void> {
        const data = ChapterMapper.toPersistence(chapter);

        await this._prisma.chapter.create({
            data: {
                ...data,
                id: data.id || undefined
            }
        });
    }

    /**
     * @description Cập nhật thông tin chi tiết của một chương lý thuyết hiện có.
     * @param {Chapter} chapter - Thực thể chứa dữ liệu đã thay đổi.
     * @returns {Promise<void>}
     */
    public async update(chapter: Chapter): Promise<void> {
        if (!chapter.id) return;

        const data = ChapterMapper.toPersistence(chapter);

        await this._prisma.chapter.update({
            where: { id: chapter.id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }

    /**
     * @description Đếm số lượng câu hỏi thuộc về chương này để kiểm tra ràng buộc toàn vẹn trước khi xóa.
     * @param {string} id - ID của chương lý thuyết.
     * @returns {Promise<number>}
     */
    public async countQuestions(id: string): Promise<number> {
        return await this._prisma.question.count({
            where: { chapterId: id } // Fix: Phải tìm theo chapterId thay vì id câu hỏi
        });
    }

    /**
     * @description Khôi phục chương lý thuyết đã bị xóa mềm bằng cách đặt deletedAt về null.
     * @param {string} id - UUID của chương cần khôi phục.
     * @returns {Promise<void>}
     */
    public async restore(id: string): Promise<void> {
        await this._prisma.chapter.update({
            where: { id },
            data: { deletedAt: null }
        });
    }
}