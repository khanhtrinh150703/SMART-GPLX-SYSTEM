import { PrismaClient } from "@prisma/client";
import { IQuestionRepository } from "@/domain/interfaces/repositories/i-question.repository";
import { Question as DomainQuestion } from "@/domain/entities/question/question.entity";
import { QuestionMapper } from "@/infrastructure/database/mappers/question.mapper";
import { IQuestionRecord, PrismaQuestionWithRelations } from "@/infrastructure/persistence/question.record";

/**
 * @interface IMySQLQuestionRepositoryCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho MySQLQuestionRepository.
 * Chỉ bao gồm PrismaClient để tương tác với cơ sở dữ liệu.
 */
export interface IMySQLQuestionRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLQuestionRepository
 * @description Triển khai Repository cho Câu hỏi sử dụng MySQL và Prisma ORM.
 * Đã fix 100% theo cấu trúc IQuestionRecord và chuẩn Specific Cradle.
 */
export class MySQLQuestionRepository implements IQuestionRepository {
  private readonly _prisma: PrismaClient;

  /** @description Cấu hình Eager Loading để lấy đầy đủ đáp án và hạng bằng lái. */
  private readonly _includeRelations = {
    answers: true,
    licenseLinks: true,
  };

  /**
   * @description Khởi tạo Repository với "vũ khí" Prisma chuyên dụng.
   * @param {IMySQLQuestionRepositoryCradle} cradle - Dependencies được tiêm từ DI Container.
   */
  constructor({ prisma }: IMySQLQuestionRepositoryCradle) {
    this._prisma = prisma;
  }
  /**
   * Helper: Map trực tiếp từ Prisma Result sang IQuestionRecord (CamelCase).
   */
  private _toDomain(raw: PrismaQuestionWithRelations | null): DomainQuestion | null {
    if (!raw) return null;

    const record: IQuestionRecord = {
      id: raw.id,
      chapterId: raw.chapterId,
      content: raw.content,
      imageUrl: raw.imageUrl,
      difficultyLevel: raw.difficultyLevel,
      isCritical: raw.isCritical,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      // Map danh sách đáp án
      answers: raw.answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        content: a.content,
        imageUrl: a.imageUrl,
        isCorrect: a.isCorrect,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      // Map danh sách liên kết bằng lái
      licenseLinks: raw.licenseLinks.map((l) => ({
        questionId: l.questionId,
        licenseCategoryId: l.licenseCategoryId,
      })),
    };

    return QuestionMapper.toDomain(record);
  }

  /**
   * @description Lưu câu hỏi mới cùng danh sách đáp án và liên kết bằng lái trong 1 Transaction.
   */
  public async create(entity: DomainQuestion): Promise<DomainQuestion> {
    const { props } = entity;

    const saved = await this._prisma.question.create({
      data: {
        id: props.id,
        chapterId: props.chapterId,
        content: props.content,
        imageUrl: props.imageUrl,
        isCritical: props.isCritical,
        difficultyLevel: props.difficultyLevel,
        // Tạo nested Answers
        answers: {
          create: props.answers.map((a) => ({
            id: a.id,
            content: a.content,
            imageUrl: a.imageUrl,
            isCorrect: a.isCorrect,
          })),
        },
        // Tạo nested LicenseLinks (quan hệ n-n qua bảng trung gian)
        licenseLinks: {
          create: props.licenseCategoryIds.map((id) => ({
            licenseCategoryId: id,
          })),
        },
      },
      include: this._includeRelations,
    });

    return this._toDomain(saved as PrismaQuestionWithRelations)!;
  }

  /**
  * @description Cập nhật nội dung Question và đồng bộ danh sách Answer.
  */
  public async update(id: string, entity: DomainQuestion): Promise<DomainQuestion> {
    const { props } = entity;

    // Lấy danh sách ID đáp án mà bạn muốn GIỮ LẠI hoặc SỬA
    const incomingAnswerIds = props.answers
      .map((a) => a.id)
      .filter((id): id is string => !!id);

    const updated = await this._prisma.$transaction(async (tx) => {
      // 1. Update thông tin chung của Question (Nội dung, ảnh, chương...)
      await tx.question.update({
        where: { id },
        data: {
          content: props.content,
          imageUrl: props.imageUrl,
          isCritical: props.isCritical,
          chapterId: props.chapterId,
          deletedAt: props.deletedAt,
          // Reset hạng bằng lái (Xóa sạch tạo lại vì bảng này không bị ai tham chiếu lịch sử)
          licenseLinks: {
            deleteMany: {},
            create: props.licenseCategoryIds.map(lId => ({ licenseCategoryId: lId }))
          }
        }
      });

      // 2. Xử lý "Xóa ngầm": Những đáp án không gửi lên thì ẨN ĐI (Soft Delete)
      // Để không bị lỗi Foreign Key với bài thi cũ
      await tx.answer.updateMany({
        where: {
          questionId: id,
          id: { notIn: incomingAnswerIds },
        },
        data: { deletedAt: new Date() },
      });

      // 3. Xử lý "Thêm & Sửa": Dùng Upsert cho gọn
      for (const ans of props.answers) {
        await tx.answer.upsert({
          where: { id: ans.id || 'placeholder-for-new' },
          update: {
            content: ans.content,
            imageUrl: ans.imageUrl,
            isCorrect: ans.isCorrect,
            deletedAt: null // Đảm bảo nó hiện lên nếu trước đó lỡ bị ẩn
          },
          create: {
            questionId: id,
            content: ans.content,
            imageUrl: ans.imageUrl,
            isCorrect: ans.isCorrect
          }
        });
      }

      // 4. Lấy lại data sạch để trả về (Chỉ lấy đáp án không bị ẩn)
      return tx.question.findUnique({
        where: { id },
        include: {
          answers: { where: { deletedAt: null } },
          licenseLinks: true
        }
      });
    });

    return this._toDomain(updated as PrismaQuestionWithRelations)!;
  }

  /**
   * @description Lấy danh sách câu hỏi "Sạch" thuộc về một chương.
   * Chỉ lấy những câu hỏi và đáp án chưa bị ẩn (deletedAt: null).
   */
  public async findByChapterId(chapterId: string): Promise<DomainQuestion[]> {
    const records = await this._prisma.question.findMany({
      where: {
        chapterId,
        deletedAt: null // Lọc câu hỏi chưa bị xóa
      },
      include: {
        licenseLinks: true, // Hạng bằng lái thường không dùng Soft Delete nên include thẳng
        answers: {
          where: { deletedAt: null },  
          orderBy: { createdAt: 'asc' } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return records
      .map((rec) => this._toDomain(rec as unknown as PrismaQuestionWithRelations))
      .filter((q): q is DomainQuestion => q !== null);
  }

  /**
   * @description Lấy chi tiết câu hỏi và các đáp án "Active".
   */
  public async findById(id: string): Promise<DomainQuestion | null> {
    const record = await this._prisma.question.findUnique({
      where: {
        id,
        deletedAt: null
      },
      include: {
        licenseLinks: true,
        answers: {
          where: { deletedAt: null } // Loại bỏ các đáp án "bóng ma"
        }
      },
    });

    if (!record) return null;
    return this._toDomain(record as PrismaQuestionWithRelations);
  }

  /**
   * @description Lấy chi tiết câu hỏi và các đáp án "Active".
   */
  public async findByIdSystem(id: string): Promise<DomainQuestion | null> {
    const record = await this._prisma.question.findUnique({
      where: {
        id,
      },
      include: {
        licenseLinks: true,
        answers: {
          where: { deletedAt: null } // Loại bỏ các đáp án "bóng ma"
        }
      },
    });

    if (!record) return null;
    return this._toDomain(record as PrismaQuestionWithRelations);
  }

  /**
   * @description Xóa mềm câu hỏi bằng cách set deletedAt.
   * @param {string} id - ID câu hỏi.
   */
  public async delete(id: string): Promise<void> {
    await this._prisma.question.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * @description Khôi phục câu hỏi đã xóa bằng cách reset deletedAt về null.
   * @param {string} id - ID câu hỏi.
   */
  public async restore(id: string): Promise<DomainQuestion> {
    const record = await this._prisma.question.update({
      where: { id },
      data: { deletedAt: null },
      include: {
        answers: true,
        licenseLinks: true,
      },
    });

    return this._toDomain(record as PrismaQuestionWithRelations)!;
  }
}