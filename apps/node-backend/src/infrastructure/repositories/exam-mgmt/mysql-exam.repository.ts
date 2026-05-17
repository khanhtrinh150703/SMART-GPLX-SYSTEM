import { IExamUserFilterOptions } from "@/application/dtos/request/exam/exam-query-list.request.dto";
import { ExamQueryDTO } from "@/application/dtos/request/exam/exam-query.request.dto";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import {
  examInclude,
  PrismaExamWithRelations,
} from "@/infrastructure/persistence/exam-mgmt";
import { STATUS } from "@/shared/config/status.config";
import { ExamRelatedCount } from "@/shared/types/count.types";
import { Prisma, PrismaClient } from "@prisma/client";

export interface ICradle {
  prisma: PrismaClient;
}

/**
 * @description Triển khai các phương thức thao tác dữ liệu bài thi trên MySQL sử dụng Prisma.
 */
export class MySQLExamRepository implements IExamRepository {
  private readonly _prisma: PrismaClient;

  constructor({ prisma }: ICradle) {
    this._prisma = prisma;
  }

  /**
   * @description Lấy thông tin bài thi chi tiết kèm theo danh sách câu hỏi.
   * @param id - ID của bài thi.
   * @returns {Promise<ExamEntity | null>} Trả về Domain Entity hoặc null nếu không tìm thấy.
   */
  public async getByIdWithQuestions(id: string): Promise<ExamEntity | null> {
    const record = await this._prisma.exam.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: examInclude,
    });

    if (!record) return null;

    return ExamMapper.toDomain(record);
  }

  /**
   * @description Tạo mới bài thi và lưu danh sách câu hỏi đi kèm (Nested Create).
   * @param exam - Domain Entity bài thi cần lưu.
   * @returns {Promise<ExamEntity>} Trả về Entity sau khi đã lưu thành công.
   */
  public async createExam(exam: ExamEntity): Promise<ExamEntity> {
    // 1. Chuyển đổi Entity sang Data Object của Prisma (Persistence Layer)
    const data = ExamMapper.toCreatePersistence(exam);

    // 2. Lưu xuống DB (Prisma tự quản lý Transaction cho các bản ghi lồng nhau)
    const savedRecord = await this._prisma.exam.create({
      data,
      include: examInclude,
    });

    // 3. Chuyển đổi ngược lại từ Record sang Domain Entity để trả về
    return ExamMapper.toDomain(savedRecord);
  }

  public async updateExam(exam: ExamEntity): Promise<ExamEntity> {
    // 1. Chuyển đổi Entity sang Data Object của Prisma (Persistence Layer)
    const data = ExamMapper.toUpdatePersistence(exam);

    // 2. Lưu xuống DB (Prisma tự quản lý Transaction cho các bản ghi lồng nhau)
    const savedRecord = await this._prisma.exam.update({
      where: { id: exam.id },
      data,
      include: examInclude,
    });

    // 3. Chuyển đổi ngược lại từ Record sang Domain Entity để trả về
    return ExamMapper.toDomain(savedRecord);
  }

  /**
   * @description Tìm kiếm thông tin bài thi theo mã định danh (ID).
   * @param id - ID của bài thi cần tìm.
   * @returns {Promise<ExamEntity | null>} Trả về Domain Entity hoặc null.
   */
  public async findById(id: string): Promise<ExamEntity | null> {
    const record = await this._prisma.exam.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: examInclude,
    });

    if (!record) return null;
    return ExamMapper.toDomain(record);
  }

  /**
   * @description Tìm kiếm thông tin bài thi theo tên (Name).
   * @param name - Tên của bài thi cần tìm.
   * @returns {Promise<ExamEntity | null>} Trả về Domain Entity hoặc null.
   */
  public async findByNameSystem(name: string): Promise<ExamEntity | null> {
    const record = await this._prisma.exam.findFirst({
      where: {
        name,
      },
      include: examInclude,
    });

    if (!record) return null;
    return ExamMapper.toDomain(record);
  }

  /**
   * @description Tìm kiếm và phân trang danh sách đề thi (Dịch: Find and count exams with filters)
   * @param {ExamQueryDTO} dto - DTO chứa các điều kiện lọc từ Client.
   * @param {number} skip - Vị trí bắt đầu lấy dữ liệu.
   * @param {number} limit - Số lượng bản ghi tối đa.
   * @returns {Promise<[ExamEntity[], number]>} Mảng thực thể Domain và tổng số lượng.
   */
  public async findAndCount(
    dto: ExamQueryDTO,
    skip: number,
    limit: number,
  ): Promise<[ExamEntity[], number]> {
    const where: Prisma.ExamWhereInput = {};
    // --- 1. LỌC THEO TRƯỜNG CỤ THỂ (Explicit Filters) ---
    if (dto.fullName) {
      where.user = {
        fullName: { contains: dto.fullName },
      };
    }
    if (dto.examMatrixId) where.examMatrixId = dto.examMatrixId;
    if (dto.isPassed !== undefined) where.isPassed = dto.isPassed;
    if (dto.name) where.name = { contains: dto.name };
    if (dto.totalQuestions !== undefined)
      where.totalQuestions = dto.totalQuestions;
    if (dto.passingScore !== undefined) where.passingScore = dto.passingScore;
    if (dto.durationMinutes !== undefined)
      where.durationMinutes = dto.durationMinutes;
    if (dto.minCriticalQuestions !== undefined)
      where.minCriticalQuestions = dto.minCriticalQuestions;
    if (dto.licenseCategoryName) {
      where.licenseCategory = {
        name: { contains: dto.licenseCategoryName },
      };
    }

    // --- 2. LOGIC TRẠNG THÁI (Status Logic) ---
    const statusInput = dto.status?.toString().toLowerCase();
    if (statusInput === "active") {
      where.deletedAt = null;
      where.status = STATUS.ACTIVE;
    } else if (statusInput === "deleted") {
      where.deletedAt = { not: null };
    } else if (statusInput === "draft") {
      where.status = STATUS.DRAFT;
    } else if (statusInput !== "all") {
      where.deletedAt = null;
    }

    // --- 3. SEARCH TỔNG QUÁT (Global Search) ---
    if (dto.search) {
      const searchTag: Prisma.StringFilter = { contains: dto.search };
      where.OR = [
        { name: searchTag },
        { user: { fullName: searchTag } },
        { licenseCategory: { name: searchTag } },
      ];
    }

    // --- 4. XỬ LÝ SẮP XẾP KHÔNG DÙNG ANY (Strict Sorting) ---
    const sortOrder = dto.sortOrder || "desc";

    // Xây dựng mảng orderBy với kiểu dữ liệu chuẩn của Prisma
    const orderBy: Prisma.ExamOrderByWithRelationInput[] = [];

    // Ưu tiên 1: Gom nhóm theo trạng thái xóa
    orderBy.push({ deletedAt: sortOrder });

    orderBy.push({ status: "asc" });
    // Ưu tiên 2: Ánh xạ sort từ DTO sang Prisma Order Object mà không dùng any
    const sortMap: Record<string, Prisma.ExamOrderByWithRelationInput> = {
      name: { name: sortOrder },
      score: { score: sortOrder },
      startedAt: { startedAt: sortOrder },
      duration: { durationMinutes: sortOrder },
      status: { status: sortOrder },
      user: { user: { fullName: sortOrder } },
      licenseCategoryName: { licenseCategory: { name: sortOrder } },
    };

    const userCriteria = sortMap[dto.sortBy || "startedAt"] || {
      startedAt: "desc",
    };
    orderBy.push(userCriteria);

    // --- 5. THỰC THI TRUY VẤN (Database Execution) ---
    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.exam.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: examInclude,
      }),
      this._prisma.exam.count({ where }),
    ]);

    // --- 6. MAPPING SANG DOMAIN (Domain Mapping) ---
    const entities = rawRecords.map((record: PrismaExamWithRelations) =>
      ExamMapper.toDomain(record),
    );

    return [entities, total];
  }

  public async softDelete(id: string): Promise<void> {
    await this._prisma.exam.update({
      where: { id },
      data: { deletedAt: new Date(), status: "DELETED" },
    });
  }

  public async hardDelete(id: string): Promise<void> {
    await this._prisma.exam.delete({
      where: { id },
    });
  }

  public async restore(id: string): Promise<ExamEntity> {
    // Lệnh update của Prisma trả về luôn record vừa sửa
    const updatedRecord = await this._prisma.exam.update({
      where: { id },
      data: {
        deletedAt: null,
        status: "ACTIVE",
      },
      include: examInclude, // Đảm bảo gom đủ câu hỏi/snapshot đi kèm nếu Mapper yêu cầu
    });

    // Ép kiểu qua Mapper và trả ngược lên tầng nghiệp vụ (Service)
    return ExamMapper.toDomain(updatedRecord);
  }
  
  /**
   * @description Thống kê các thành phần phụ thuộc của Đề thi.
   * @param {string} id - Định danh duy nhất (UUID) của đề thi.
   * @returns {Promise<ExamRelatedCount>} Đối tượng chứa số lượng chi tiết các thực thể liên quan
   * @note Do cơ chế 'onDelete: Cascade' trong DB, việc xóa Exam sẽ xóa sạch các bản ghi phụ thuộc.
   */
  public async countRelatedData(id: string): Promise<ExamRelatedCount> {
    const questionsCount = await this._prisma.examQuestion.count({
      where: { examId: id },
    });

    return {
      questions: questionsCount,
    };
  }

  /**
   * @description Tìm kiếm thông tin bài thi theo mã định danh (ID).
   * @param id - ID của bài thi cần tìm.
   * @returns {Promise<ExamEntity | null>} Trả về Domain Entity hoặc null.
   */
  public async findByIdSystem(id: string): Promise<ExamEntity | null> {
    const record = await this._prisma.exam.findUnique({
      where: {
        id,
      },
      include: examInclude,
    });

    if (!record) return null;
    return ExamMapper.toDomain(record);
  }

  /**
   * @description Tìm kiếm thông tin bài thi theo mã định danh (ID).
   * @param id - ID của bài thi cần tìm.
   * @returns {Promise<ExamEntity | null>} Trả về Domain Entity hoặc null.
   */
  public async findDetailById(id: string): Promise<ExamEntity | null> {
    const record = await this._prisma.exam.findUnique({
      where: {
        id,
        status: "ACTIVE",
        deletedAt: null,
      },
      include: examInclude,
    });

    if (!record) return null;
    return ExamMapper.toDomain(record);
  }

  /**
   * @description Truy vấn danh sách bộ đề thi dành cho người dùng cuối .
   * @param options - Tiêu chí lọc động (tìm kiếm theo tên, mã hạng bằng lái).
   * @param skip - Số lượng bản ghi cần bỏ qua (Offset).
   * @param take - Số lượng bản ghi tối đa cần lấy (Limit).
   * @returns {Promise<[ExamEntity[], number]>} Tuple chứa danh sách Entity và tổng số bản ghi khớp điều kiện.
   */
  public async findAllUser(
    options: IExamUserFilterOptions,
    skip: number,
    take: number,
  ): Promise<[ExamEntity[], number]> {
    // 1. Định nghĩa điều kiện lọc dùng chung cho cả query data và query count
    const where: Prisma.ExamWhereInput = {
      status: "ACTIVE",
      deletedAt: null,
      name: options.search ? { contains: options.search } : undefined,
      licenseCategory: options.licenseCode
        ? { name: options.licenseCode }
        : undefined,
    };

    // 2. Chạy song song truy vấn dữ liệu và đếm tổng số (Tuple Pattern)
    const [records, total] = await Promise.all([
      this._prisma.exam.findMany({
        where,
        skip,
        take,
        include: examInclude,
        orderBy: { createdAt: "desc" },
      }),
      this._prisma.exam.count({ where }),
    ]);

    // 3. Ánh xạ dữ liệu sang Domain Entity và trả về Tuple
    const entities = records.map((record) => ExamMapper.toDomain(record));

    return [entities, total];
  }
}
