import { IExamMatrixRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-matrix.repository";
import { ExamMatrixMapper } from "@/infrastructure/database/mappers/exam-session/exam-matrix.mapper";
import { ExamMatrix as ExamMatrixEntity } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { Prisma, PrismaClient } from "@prisma/client";
import { ExamMatrixQueryDTO } from "@/application/dtos/request/exam-matrix/exam-matrix-query.request.dto";

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
    * @description Truy vấn danh sách ma trận đề thi.
    * Logic: Xử lý tìm kiếm động và sắp xếp nâng cao (theo status và số lượng chương).
    */
  public async findAndCount(
    query: ExamMatrixQueryDTO,
    skip: number,
    limit: number
  ): Promise<[ExamMatrixEntity[], number]> {
    const where: Prisma.ExamMatrixWhereInput = {};

    // 1. LỌC TRẠNG THÁI (THEO TAB)
    // (Filtering by status tabs based on deletedAt column)
    if (query.status === 'active') {
      where.deletedAt = null;
    } else if (query.status === 'deleted') {
      where.deletedAt = { not: null };
    }

    // 2. TÌM KIẾM ĐỘNG (DYNAMIC SEARCH - SWITCH CASE)
    const searchVal = query.search?.trim();
    const activeField = query.activeField;

    if (searchVal && activeField) {
      switch (activeField) {
        case 'licenseCategory':
          where.licenseCategory = {
            name: { contains: searchVal }
          };
          break;
        case 'name':
          where.name = { contains: searchVal };
          break;
        case 'id':
          where.id = { contains: searchVal };
          break;
        case 'totalQuestions':
        case 'passingScore':
        case 'durationMinutes': {
          const numVal = Number(searchVal);
          if (!isNaN(numVal)) {
            if (activeField === 'totalQuestions') where.totalQuestions = numVal;
            if (activeField === 'passingScore') where.passingScore = numVal;
            if (activeField === 'durationMinutes') where.durationMinutes = numVal;
          }
          break;
        }
      }
    }

    // 3. ĐỊNH NGHĨA QUAN HỆ CẦN LẤY (INCLUDE)
    const include = {
      details: true,
      licenseCategory: { select: { name: true } }
    };

    // 4. XỬ LÝ SẮP XẾP NÂNG CAO (ADVANCED SORTING)
    // Mặc định sắp xếp theo ngày tạo mới nhất
    let orderBy: Prisma.ExamMatrixOrderByWithRelationInput = { createdAt: 'desc' };

    if (query.sortBy) {
      const direction = query.sortOrder || 'desc';

      // Trường hợp 1: Sắp xếp theo Trạng thái (status -> deletedAt)
      if (query.sortBy === 'status') {
        orderBy = { deletedAt: direction };
      }
      // Trường hợp 2: Sắp xếp theo Số lượng chương (details -> _count)
      // (Sorting by count of related records in the 'details' collection)
      else if (query.sortBy === 'details' || query.sortBy === 'detailsCount') {
        orderBy = {
          details: {
            _count: direction
          }
        };
      }
      // Trường hợp 3: Các trường cơ bản có trong Schema
      else {
        const validFields = ['name', 'totalQuestions', 'passingScore', 'durationMinutes', 'createdAt'];
        if (validFields.includes(query.sortBy)) {
          orderBy = { [query.sortBy]: direction };
        }
      }
    }

    // 5. THỰC THI TRUY VẤN TRANSACTION
    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.examMatrix.findMany({
        where,
        skip,
        take: limit,
        include,
        orderBy,
      }),
      this._prisma.examMatrix.count({ where }),
    ]);

    // 6. CHUYỂN ĐỔI SANG DOMAIN ENTITY
    return [
      rawRecords.map((rec) => ExamMatrixMapper.toDomain(rec)),
      total
    ];
  }

  /**
   * @description Khởi tạo và lưu trữ một Ma trận đề thi mới vào hệ thống.
   * @param {ExamMatrixEntity} entity - Thực thể ma trận đề thi từ tầng Domain.
   * @returns {Promise<ExamMatrixEntity>} Thực thể đã được lưu kèm thông tin ID và quan hệ (details).
   */
  public async createExamMatrix(entity: ExamMatrixEntity): Promise<ExamMatrixEntity> {
    // 1. Chuyển đổi Thực thể Domain sang dạng dữ liệu có thể lưu trữ (Persistence)
    const createData = ExamMatrixMapper.toCreatePersistence(entity);

    // 2. Thực hiện lệnh tạo mới trong Database thông qua Prisma
    // include: { details: true } đảm bảo lấy về cả danh sách cấu trúc chi tiết của đề thi
    const result = await this._prisma.examMatrix.create({
      data: createData,
      include: { details: true },
    });

    // 3. Chuyển đổi dữ liệu từ Database ngược lại thành Thực thể Domain để trả về tầng Application
    return ExamMatrixMapper.toDomain(result);
  }

  /**
   * @description Cập nhật các thông tin cơ bản của ma trận.
   * @param {string} id - ID ma trận.
   * @param {ExamMatrixEntity} entity - Dữ liệu cập nhật.
   * @returns {Promise<ExamMatrixEntity>} Thực thể sau khi cập nhật.
   */
  public async updateExamMatrix(entity: ExamMatrixEntity): Promise<ExamMatrixEntity> {
    const data = ExamMatrixMapper.toUpdatePersistence(entity);

    const updated = await this._prisma.examMatrix.update({
      where: { id: entity.id },
      data: data,
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