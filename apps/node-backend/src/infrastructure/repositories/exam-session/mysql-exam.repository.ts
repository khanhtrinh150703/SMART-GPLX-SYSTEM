import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import { PrismaClient } from "@prisma/client";

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
      where: { id },
      include: {
        questions: {
          orderBy: { indexNumber: 'asc' },
        },
      },
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
    const data = ExamMapper.toPersistence(exam);

    // 2. Lưu xuống DB (Prisma tự quản lý Transaction cho các bản ghi lồng nhau)
    const savedRecord = await this._prisma.exam.create({
      data,
      include: {
        questions: {
          orderBy: { indexNumber: 'asc' }
        }
      }
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
      where: { id },
      include: {
        questions: {
          orderBy: { indexNumber: 'asc' },
        },
      },
    });

    if (!record) return null;
    return ExamMapper.toDomain(record);
  }
}