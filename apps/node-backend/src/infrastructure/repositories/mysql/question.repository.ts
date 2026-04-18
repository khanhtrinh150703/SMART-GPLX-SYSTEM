import { Prisma, PrismaClient } from "@prisma/client";
import { IQuestionRepository } from "@/domain/interfaces/repositories/i-question.repository";
import { Question as DomainQuestion } from "@/domain/entities/question/question.entity";
import { QuestionMapper } from "@/infrastructure/database/mappers/question.mapper";
import { IQuestionRecord, PrismaQuestionWithRelations } from "@/infrastructure/persistence/question.record";
import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { QuestionStatus } from "@/domain/entities/question/question.status";

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
      deletedAt: raw.deletedAt,
      status: raw.status,
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
        status: props.status,
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
      data: {
        deletedAt: new Date(),
        status: "DELETED"
      },
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


  /**
  * @description Tìm kiếm và phân trang câu hỏi dành cho Admin (Dịch: Find and count questions for Admin)
  * @param {QuestionsAdminQueryDto} dto - DTO chứa các điều kiện lọc từ Client.
  * @param {number} skip - Vị trí bắt đầu lấy dữ liệu.
  * @param {number} limit - Số lượng bản ghi tối đa.
  * @returns {Promise<[DomainQuestion[], number]>} Mảng thực thể Domain và tổng số lượng.
  */
  public async findAndCountAdmin(
    dto: QuestionsAdminQueryDto,
    skip: number,
    limit: number
  ): Promise<[DomainQuestion[], number]> {
    const where: Prisma.QuestionWhereInput = {};  
    // --- 1. GÁN ĐIỀU KIỆN CƠ BẢN (Dịch: Basic Filtering) ---
    if (dto.chapterId) where.chapterId = dto.chapterId;
    if (dto.difficultyLevel !== undefined) where.difficultyLevel = dto.difficultyLevel;
    if (dto.isCritical !== undefined) where.isCritical = dto.isCritical;

    // --- 2. LOGIC TRẠNG THÁI TỔNG HỢP (Dịch: Integrated Status Logic) ---
    // Xử lý thông minh: Phân biệt giữa Tab UI và Business Status (Enum)
    if (dto.status === 'all') {
      // Không thêm điều kiện -> Lấy hết (Cả đã xóa và chưa xóa)
    }
    else if (dto.status === 'active') {
      where.status = dto.status.toUpperCase() as QuestionStatus;
      where.deletedAt = null;
    }
    else if (dto.status === 'deleted') {
      where.deletedAt = { not: null };
    }
    else if (dto.status) {
      // Nếu là DRAFT hoặc PUBLISHED: Phải viết hoa để khớp Enum Prisma
      where.status = dto.status.toUpperCase() as QuestionStatus;
      where.deletedAt = null; // Thường xem status nghiệp vụ thì chỉ xem cái chưa xóa
    }

    // --- 3. LOGIC QUAN HỆ & SEARCH (Dịch: Relation & Search Logic) ---
    if (dto.licenseCategoryIds) {
      where.licenseLinks = {
        some: { licenseCategoryId: dto.licenseCategoryIds }
      };
    }

    if (dto.search) {
      where.OR = [
        { content: { contains: dto.search } }
      ];
    }

    // --- 4. XỬ LÝ SẮP XẾP PHỨC TẠP (Dịch: Advanced Sorting Logic) ---
    // --- 4. XỬ LÝ SẮP XẾP PHỨC TẠP (Dịch: Complex Sorting Logic) ---
    const sortBy = dto.sortBy;
    const sortOrder = dto.sortOrder || 'desc';
    const sortCriteria: Prisma.QuestionOrderByWithRelationInput[] = [];

    /**
     * LOGIC MẶC ĐỊNH (Khi mới vào trang hoặc sortBy là 'createdAt')
     */
    if (!sortBy || sortBy === 'createdAt' || sortBy === 'all') {
      sortCriteria.push({ deletedAt: 'asc' });
      sortCriteria.push({ status: 'asc' });
      sortCriteria.push({ licenseLinks: { _count: 'desc' } });
      sortCriteria.push({ content: 'asc' });
    }
    else {
      // TRƯỜNG HỢP ADMIN CLICK CHỌN CỘT CỤ THỂ
      switch (sortBy) {
        case 'answers':
          sortCriteria.push({ imageUrl: sortOrder });
          sortCriteria.push({ answers: { _count: sortOrder } });
          break;
        case 'chapterName':
          sortCriteria.push({ chapter: { name: sortOrder } });
          break;
        case 'licenseCategoryNames':
          sortCriteria.push({ licenseLinks: { _count: sortOrder } });
          sortCriteria.push({ content: 'asc' });
          break;
        case 'status':
          // Khi click cột trạng thái, ta đảo ngược logic nhóm
          sortCriteria.push({ deletedAt: sortOrder === 'desc' ? 'asc' : 'desc' });
          sortCriteria.push({ status: sortOrder });
          break;
        case 'difficulty':
          sortCriteria.push({ chapter: { name: sortOrder } });
          sortCriteria.push({ deletedAt: sortOrder === 'desc' ? 'asc' : 'desc' });
          sortCriteria.push({ difficultyLevel: sortOrder });
          break;
        default:
          sortCriteria.push({ [sortBy]: sortOrder } as Prisma.QuestionOrderByWithRelationInput);
      }

      // Chốt chặn cuối cùng cho mọi trường hợp click cột khác
      sortCriteria.push({ createdAt: 'desc' });
    }

    const finalOrderBy = [...sortCriteria];

    // --- 5. THỰC THI TRANSACTION (Dịch: Database Execution) ---
    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: finalOrderBy,
        include: {
          answers: true,
          chapter: { select: { name: true } },
          licenseLinks: {
            include: { licenseCategory: { select: { name: true } } }
          }
        }
      }),
      this._prisma.question.count({ where })
    ]);

    // --- 6. MAPPING (Dịch: Domain Mapping) ---
    // Chuyển đổi Database Record thô sang Domain Entity xịn xò
    const entities = rawRecords.map((record) => QuestionMapper.toDomain(record));

    return [entities, total];
  }

  public async bulkInsert(_questions: DomainQuestion[]): Promise<number> {
    // Prisma Fluent API: Rất sạch và an toàn về type
    // const result = await this._prisma.question.createMany({
    //   data: questions,
    //   skipDuplicates: true,
    // });

    return 3;
  }
}