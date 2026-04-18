import { IExamMatrixRepository } from "@/domain/interfaces/repositories/i-exam-matrix.repository";
import { ExamMatrixMapper } from "@/infrastructure/database/mappers/exam/exam-matrix.mapper";
import { ExamMatrix as ExamMatrixEntity } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { PrismaClient } from "@prisma/client";

/**
 * @interface IMySQLExamMatrixRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho Exam Matrix Repository.
 * Chỉ cho phép tiếp cận PrismaClient để thực hiện các thao tác với Database.
 */
export interface IMySQLExamMatrixRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLExamMatrixRepository
 * @description Triển khai Repository cho Ma trận đề thi sử dụng MySQL và Prisma ORM.
 * Quản lý các bản ghi liên quan đến cấu trúc ma trận, phân bổ tỷ lệ phần trăm và câu hỏi.
 */
export class MySQLExamMatrixRepository implements IExamMatrixRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo Repository với "vũ khí" Prisma được "tiêm" từ DI Container.
   * @param {IMySQLExamMatrixRepositoryCradle} cradle - Chỉ chứa PrismaClient.
   */
  constructor({ prisma }: IMySQLExamMatrixRepositoryCradle) {
    this._prisma = prisma;
  }

  /**
   * @description Tìm ma trận theo ID.
   * @param {string} id - UUID của ma trận.
   * @returns {Promise<ExamMatrixEntity | null>} Trả về Entity hoặc null.
   */
  public async findById(id: string): Promise<ExamMatrixEntity | null> {
    const record = await this._prisma.examMatrix.findUnique({
      where: { id, deletedAt: null },
      include: { details: true },
    });

    if (!record) return null;

    // Chuyển đổi từ Prisma Model sang Domain Entity
    return ExamMatrixMapper.toDomain(record);
  }

  /** 
   * @description Truy vấn Ma trận theo ID ở cấp độ hệ thống, bao gồm cả bản ghi đã xóa mềm (Persistence/Database).
   * @param {string} id - UUID định danh của Ma trận cần tìm.
   * @returns {Promise<ExamMatrixEntity | null>} Thực thể Domain (đã map) hoặc null nếu không tồn tại trong DB.
   */
  public async findByIdSystem(id: string): Promise<ExamMatrixEntity | null> {
    const record = await this._prisma.examMatrix.findUnique({
      where: { id },
      include: { details: true } // Luôn kèm theo details để Mapper hoạt động chính xác
    });

    if (!record) return null;

    // Chuyển đổi dữ liệu từ Persistence Record sang Domain Entity
    return ExamMatrixMapper.toDomain(record);
  }

  /**
   * @description Lưu mới một ma trận đề thi.
   * @param {ExamMatrixEntity} entity - Thực thể cần lưu trữ.
   * @returns {Promise<ExamMatrixEntity>} Thực thể sau khi lưu.
   */
  public async save(entity: ExamMatrixEntity): Promise<ExamMatrixEntity> {
    const data = ExamMatrixMapper.toPersistence(entity);

    const created = await this._prisma.examMatrix.create({
      data,
      include: { details: true },
    });

    return ExamMatrixMapper.toDomain(created);
  }

  /**
   * @description Cập nhật các thông tin cơ bản của ma trận.
   * @param {string} id - ID ma trận.
   * @param {ExamMatrixEntity} entity - Dữ liệu cập nhật.
   * @returns {Promise<ExamMatrixEntity>} Thực thể sau khi cập nhật.
   */
  public async update(id: string, entity: ExamMatrixEntity): Promise<ExamMatrixEntity> {
    const data = ExamMatrixMapper.toPersistence(entity);

    const updated = await this._prisma.examMatrix.update({
      where: { id },
      data: {
        totalQuestions: data.totalQuestions,
        passingScore: data.passingScore,
        durationMinutes: data.durationMinutes,
        minCriticalQuestions: data.minCriticalQuestions,
      },
      include: { details: true },
    });

    return ExamMatrixMapper.toDomain(updated);
  }

  /** 
   * @description Thực hiện xóa vĩnh viễn bản ghi Ma trận khỏi cơ sở dữ liệu (Persistence/Database - Hard Delete).
   * @param {string} id - UUID của ma trận cần xóa.
   */
  public async delete(id: string): Promise<void> {
    await this._prisma.examMatrix.delete({ where: { id } });
  }

  /** 
   * @description Đánh dấu bản ghi Ma trận là đã xóa bằng cách cập nhật trường deletedAt (Persistence/Database - Soft Delete).
   * @param {string} id - UUID của ma trận cần ẩn.
   */
  public async softDelete(id: string): Promise<void> {
    await this._prisma.examMatrix.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /** 
   * @description Thống kê số lượng đề thi đang tham chiếu đến ma trận này (Persistence/Database).
   * @param {string} id - UUID của ma trận cần kiểm tra liên kết.
   * @returns {Promise<number>} Số lượng đề thi đang sử dụng ma trận.
   */
  public async countLinkedExams(id: string): Promise<number> {
    return await this._prisma.exam.count({
      where: { examMatrixId: id, deletedAt: null },
    });
  }

  /**
   * @description Khôi phục trạng thái hoạt động của bản ghi bằng cách xóa dấu vết deletedAt (Persistence/Database - Restore).
   * @param {string} id - UUID của ma trận cần khôi phục.
   */
  public async restore(id: string): Promise<void> {
    await this._prisma.examMatrix.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}