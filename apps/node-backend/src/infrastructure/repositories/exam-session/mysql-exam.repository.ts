import { ExamQueryDTO } from "@/application/dtos/request/exam/exam-query.request.dto";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import { examInclude } from "@/infrastructure/persistence/exam-mgmt";
import { ExamRelatedCount } from "@/shared/types/count.types";
import { ExamStatus, Prisma, PrismaClient } from "@prisma/client";

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
      include: examInclude
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
      include: examInclude
    });

    // 3. Chuyển đổi ngược lại từ Record sang Domain Entity để trả về
    return ExamMapper.toDomain(savedRecord);
  }

  public async updateExam(id: string, exam: ExamEntity): Promise<ExamEntity> {
    // 1. Chuyển đổi Entity sang Data Object của Prisma (Persistence Layer)
    const data = ExamMapper.toUpdatePersistence(exam);

    // 2. Lưu xuống DB (Prisma tự quản lý Transaction cho các bản ghi lồng nhau)
    const savedRecord = await this._prisma.exam.update({
      where: { id},
      data,
      include: examInclude
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
      include: examInclude
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
    limit: number
  ): Promise<[ExamEntity[], number]> {
    const where: Prisma.ExamWhereInput = {};

    // --- 1. GÁN ĐIỀU KIỆN CƠ BẢN (Dịch: Basic Filtering) ---
    if (dto.userId) where.userId = dto.userId;
    if (dto.licenseCategoryId) where.licenseCategoryId = dto.licenseCategoryId;
    if (dto.examMatrixId) where.examMatrixId = dto.examMatrixId;
    if (dto.isPassed !== undefined) where.isPassed = dto.isPassed;

    // --- 2. LOGIC TRẠNG THÁI TỔNG HỢP (Dịch: Integrated Status Logic) ---
    // Xử lý status dựa trên Tab UI hoặc giá trị Enum thực tế
    const statusInput = dto.status?.toString().toLowerCase();

    if (statusInput === 'all') {
      // Không thêm điều kiện status -> Lấy cả đã xóa (nếu cần) hoặc mọi trạng thái
    }
    else if (statusInput === 'deleted') {
      where.deletedAt = { not: null };
    }
    else {
      // Mặc định chỉ lấy bản ghi chưa xóa khi truy vấn danh sách thông thường
      where.deletedAt = null;
      if (dto.status) {
        where.status = dto.status as ExamStatus;
      }
    }

    // --- 3. LOGIC SEARCH (Dịch: Search Logic) ---
    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search } },
        { user: { fullName: { contains: dto.search } } } // Tìm theo tên thí sinh
      ];
    }

    // --- 4. XỬ LÝ SẮP XẾP PHỨC TẠP (Dịch: Complex Sorting Logic) ---
    const sortBy = dto.sortBy;
    const sortOrder = (dto.sortOrder?.toLowerCase() as 'asc' | 'desc') || 'desc';
    const sortCriteria: Prisma.ExamOrderByWithRelationInput[] = [];

    /**
     * LOGIC MẶC ĐỊNH: Ưu tiên đề thi mới nhất hoặc đề thi đang diễn ra
     */
    if (!sortBy || sortBy === 'createdAt' || sortBy === 'all') {
      sortCriteria.push({ startedAt: 'desc' });
      sortCriteria.push({ status: 'asc' });
    }
    else {
      // TRƯỜNG HỢP ADMIN/USER CLICK CHỌN CỘT
      switch (sortBy) {
        case 'score':
          sortCriteria.push({ score: sortOrder });
          break;
        case 'licenseCategory':
          sortCriteria.push({ licenseCategory: { name: sortOrder } });
          break;
        case 'duration':
          sortCriteria.push({ durationMinutes: sortOrder });
          break;
        case 'status':
          sortCriteria.push({ status: sortOrder });
          break;
        default:
          // Ép kiểu an toàn cho các trường hợp động
          sortCriteria.push({ [sortBy]: sortOrder } as Prisma.ExamOrderByWithRelationInput);
      }
    }

    // --- 5. THỰC THI TRANSACTION (Dịch: Database Execution) ---
    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.exam.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortCriteria,
        include: examInclude
      }),
      this._prisma.exam.count({ where })
    ]);

    // --- 6. MAPPING (Dịch: Domain Mapping) ---
    // Tuyệt đối không trả về rawRecords, phải qua Mapper để bảo vệ Domain
    const entities = rawRecords.map((record) => ExamMapper.toDomain(record));

    return [entities, total];
  }

  public async softDelete(id: string): Promise<void> {
    await this._prisma.exam.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  public async hardDelete(id: string): Promise<void> {
    await this._prisma.exam.delete({
      where: { id },
    });
  }

  public async restore(id: string): Promise<void> {
    await this._prisma.exam.update({
      where: { id },
      data: { deletedAt: null }
    });
  }

  /**
   * @description Kiểm tra các thành phần phụ thuộc của Exam.
   * Vì có 'onDelete: Cascade', việc xóa Exam sẽ tự động xóa ExamQuestion.
   * Hàm này giúp Service quyết định: Nếu đã có questions thì nên Soft Delete để an toàn.
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
      include: examInclude
    });

    if (!record) return null;
    return ExamMapper.toDomain(record);
  }

}