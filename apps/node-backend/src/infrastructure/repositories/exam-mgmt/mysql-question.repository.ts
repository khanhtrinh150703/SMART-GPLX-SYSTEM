import { Prisma, PrismaClient } from "@prisma/client";
import { IQuestionRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-question.repository";
import { Question as DomainQuestion } from "@/domain/entities/question/question.entity";
import { QuestionMapper } from "@/infrastructure/database/mappers/exam-mgmt/question.mapper";
import {
  PrismaQuestionWithRelations,
  QuestionWithDetails,
} from "@/infrastructure/persistence/exam-mgmt/question.record";
import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { GetSelectionPoolDto } from "@/application/dtos/request/question/selection-question.request.dto";
import { QuestionRelatedCount } from "@/shared/types/count.types";
import { STATUS } from "@/shared/config/status.config";

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
  private _toDomain(
    raw: PrismaQuestionWithRelations | null,
  ): DomainQuestion | null {
    if (!raw) return null;
    return QuestionMapper.toDomain(raw);
  }

  /**
   * @description Lưu câu hỏi mới cùng danh sách đáp án và liên kết bằng lái trong 1 Transaction.
   */
  public async createQuestion(entity: DomainQuestion): Promise<DomainQuestion> {
    const persistence = QuestionMapper.toCreatePersistence(entity);

    const saved = await this._prisma.question.create({
      data: persistence,
      include: this._includeRelations,
    });

    return QuestionMapper.toDomain(saved);
  }

  /**
   * @description Cập nhật nội dung Question và đồng bộ danh sách Answer.
   */
  public async updateQuestion(entity: DomainQuestion): Promise<DomainQuestion> {
    const persistence = QuestionMapper.toUpdatePersistence(entity);

    // Prisma nested update tự động bọc trong transaction ngầm
    const updated = await this._prisma.question.update({
      where: { id: entity.id },
      data: persistence,
      include: this._includeRelations,
    });

    return QuestionMapper.toDomain(updated);
  }

  /**
   * @description Lấy danh sách câu hỏi "Sạch" thuộc về một chương.
   * Chỉ lấy những câu hỏi và đáp án chưa bị ẩn (deletedAt: null).
   */
  public async findByChapterId(chapterId: string): Promise<DomainQuestion[]> {
    const records = await this._prisma.question.findMany({
      where: {
        chapterId,
        deletedAt: null, // Lọc câu hỏi chưa bị xóa
      },
      include: {
        licenseLinks: true, // Hạng bằng lái thường không dùng Soft Delete nên include thẳng
        answers: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return records
      .map((rec) =>
        this._toDomain(rec as unknown as PrismaQuestionWithRelations),
      )
      .filter((q): q is DomainQuestion => q !== null);
  }

  /**
   * @description Lấy chi tiết câu hỏi và các đáp án "Active".
   */
  public async findById(id: string): Promise<DomainQuestion | null> {
    const record = await this._prisma.question.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        licenseLinks: true,
        answers: {
          where: { deletedAt: null }, // Loại bỏ các đáp án "bóng ma"
        },
      },
    });

    if (!record) return null;
    return this._toDomain(record as PrismaQuestionWithRelations);
  }

  /**
   * @description Lấy danh sách chi tiết các câu hỏi và đáp án "Active" theo danh sách IDs.
   * @param {string[]} questionIds - Mảng các ID câu hỏi cần lấy.
   * @returns {Promise<DomainQuestion[]>} Danh sách các thực thể câu hỏi tìm thấy.
   */
  public async findByIds(questionIds: string[]): Promise<DomainQuestion[]> {
    // 1. Truy vấn hàng loạt sử dụng toán tử 'in'
    const records = await this._prisma.question.findMany({
      where: {
        id: { in: questionIds },
        deletedAt: null, // Chỉ lấy các câu hỏi chưa bị xóa
      },
      include: {
        licenseLinks: true,
        answers: {
          where: { deletedAt: null }, // Chỉ lấy các đáp án chưa bị xóa
        },
      },
    });
    // 2. Map danh sách record sang danh sách Domain Entity
    return records
      .map((record) => this._toDomain(record as PrismaQuestionWithRelations))
      .filter((item): item is DomainQuestion => item !== null);
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
          where: { deletedAt: null }, // Loại bỏ các đáp án "bóng ma"
        },
      },
    });

    if (!record) return null;
    return this._toDomain(record as PrismaQuestionWithRelations);
  }

  /**
   * @description Thực hiện xóa logic (Soft Delete) bằng cách ghi nhận thời điểm xóa và chuyển trạng thái về DELETED.
   * @param {string} id - Định danh duy nhất (Unique Identifier) của hạng bằng lái cần xóa.
   * @returns {Promise<void>}
   * @principle Data Retention - Giữ lại dữ liệu vật lý để phục vụ mục đích tra soát (Audit) hoặc khôi phục khi cần.
   */
  public async softDelete(id: string): Promise<void> {
    await this._prisma.question.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "DELETED",
      },
    });
  }

  /**
   * @description Thực hiện xóa vật lý (Hard Delete) - loại bỏ vĩnh viễn bản ghi khỏi cơ sở dữ liệu.
   * @param {string} id - Định danh duy nhất (Unique Identifier) của hạng bằng lái.
   * @returns {Promise<void>}
   * @warning Irreversible - Thao tác này không thể hoàn tác và sẽ xóa sạch mọi dữ liệu liên quan trong DB.
   */
  public async hardDelete(id: string): Promise<void> {
    await this._prisma.question.delete({
      where: { id },
    });
  }

  /**
   * @description Khôi phục câu hỏi đã xóa bằng cách reset deletedAt về null.
   * @param {string} id - ID câu hỏi.
   */
  public async restore(id: string): Promise<DomainQuestion> {
    const record = await this._prisma.question.update({
      where: { id },
      data: { deletedAt: null, status: "ACTIVE" },
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
    limit: number,
  ): Promise<[DomainQuestion[], number]> {
    const where: Prisma.QuestionWhereInput = {};
    // --- 1. GÁN ĐIỀU KIỆN CƠ BẢN (Dịch: Basic Filtering) ---
    if (dto.chapterId) where.chapterId = dto.chapterId;
    if (dto.difficultyLevel !== undefined)
      where.difficultyLevel = dto.difficultyLevel;
    if (dto.isCritical !== undefined) where.isCritical = dto.isCritical;

    // --- 2. LOGIC TRẠNG THÁI TỔNG HỢP (Dịch: Integrated Status Logic) ---
    // Xử lý thông minh: Phân biệt giữa Tab UI và Business Status (Enum)
    if (dto.status === "all") {
      // Không thêm điều kiện -> Lấy hết (Cả đã xóa và chưa xóa)
    } else if (dto.status === "active") {
      where.status = STATUS.ACTIVE;
      where.deletedAt = null;
    } else if (dto.status === "deleted") {
      where.deletedAt = { not: null };
    } else if (dto.status) {
      // Nếu là DRAFT hoặc PUBLISHED: Phải viết hoa để khớp Enum Prisma
      where.status = STATUS.DRAFT;
      where.deletedAt = null; // Thường xem status nghiệp vụ thì chỉ xem cái chưa xóa
    }

    // --- 3. LOGIC QUAN HỆ & SEARCH (Dịch: Relation & Search Logic) ---
    if (dto.licenseCategoryIds) {
      where.licenseLinks = {
        some: { licenseCategoryId: dto.licenseCategoryIds },
      };
    }

    if (dto.search) {
      /**
       * TRƯỜNG HỢP 1: Admin bật cờ tìm kiếm theo Số thứ tự (indexNumber = true)
       */
      if (dto.indexNumber === true) {
        const searchAsNumber = Number(dto.search);
        // Nếu search là số hợp lệ, tìm chính xác theo indexNumber
        if (!isNaN(searchAsNumber)) {
          where.indexNumber = searchAsNumber;
        }
      } else {
        /**
         * TRƯỜNG HỢP 2: Tìm kiếm mờ theo nội dung văn bản (Mặc định)
         */
        where.OR = [{ content: { contains: dto.search } }];
      }
    }

    // --- 4. XỬ LÝ SẮP XẾP PHỨC TẠP (Dịch: Complex Sorting Logic) ---
    const sortBy = dto.sortBy;
    const sortOrder = dto.sortOrder || "desc";
    const sortCriteria: Prisma.QuestionOrderByWithRelationInput[] = [];

    /**
     * LOGIC MẶC ĐỊNH (Khi mới vào trang hoặc sortBy là 'createdAt')
     */
    if (!sortBy || sortBy === "createdAt" || sortBy === "all") {
      sortCriteria.push({ deletedAt: "asc" });
      sortCriteria.push({ status: "asc" });
      sortCriteria.push({ licenseLinks: { _count: "desc" } });
      sortCriteria.push({ content: "asc" });
    } else {
      // TRƯỜNG HỢP ADMIN CLICK CHỌN CỘT CỤ THỂ
      switch (sortBy) {
        case "answers":
          sortCriteria.push({ imageUrl: sortOrder });
          sortCriteria.push({ answers: { _count: sortOrder } });
          break;
        case "chapterName":
          sortCriteria.push({ chapter: { name: sortOrder } });
          break;
        case "licenseCategoryNames":
          sortCriteria.push({ licenseLinks: { _count: sortOrder } });
          sortCriteria.push({ content: "asc" });
          break;
        case "status":
          sortCriteria.push({
            deletedAt: sortOrder === "desc" ? "asc" : "desc",
          });
          sortCriteria.push({ status: sortOrder });
          break;
        case "difficulty":
          sortCriteria.push({ chapter: { name: sortOrder } });
          sortCriteria.push({
            deletedAt: sortOrder === "desc" ? "asc" : "desc",
          });
          sortCriteria.push({ difficultyLevel: sortOrder });
          break;
        default:
          sortCriteria.push({
            [sortBy]: sortOrder,
          } as Prisma.QuestionOrderByWithRelationInput);
      }

      // Chốt chặn cuối cùng cho mọi trường hợp click cột khác
      sortCriteria.push({ createdAt: "desc" });
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
            include: { licenseCategory: { select: { name: true } } },
          },
        },
      }),
      this._prisma.question.count({ where }),
    ]);

    // --- 6. MAPPING (Dịch: Domain Mapping) ---
    const entities = rawRecords.map((record) =>
      QuestionMapper.toDomain(record),
    );

    return [entities, total];
  }

  /**
   * @description Lấy danh sách câu hỏi dựa trên mảng tên hạng bằng lái (B1, B2...), nạp đầy đủ các bảng quan hệ liên quan.
   * @param {string[]} licenseNames - Danh sách tên các hạng bằng lái cần tìm kiếm câu hỏi.
   * @returns {Promise<DomainQuestion[]>} Danh sách các thực thể Domain Question hợp lệ (đã lọc các bản ghi lỗi/null).
   */
  public async findByLicenseCategoryIds(
    licenseNames: string[],
  ): Promise<DomainQuestion[]> {
    const records = await this._prisma.question.findMany({
      where: {
        licenseLinks: {
          some: {
            licenseCategory: {
              name: { in: licenseNames },
            },
          },
        },
        deletedAt: null,
      },
      include: {
        answers: true,
        licenseLinks: true,
        chapter: true,
      },
    });

    return records
      .map((rec) =>
        this._toDomain(rec as unknown as PrismaQuestionWithRelations),
      )
      .filter((q): q is DomainQuestion => q !== null);
  }

  /**
   * @description Lấy toàn bộ danh sách câu hỏi thuộc về các chương học được chỉ định qua danh sách ID.
   * @param {string[]} chapterIds - Mảng các UUID định danh của các chương học cần quét câu hỏi.
   * @returns {Promise<DomainQuestion[]>} Danh sách các thực thể Domain Question thuộc các chương học đó.
   */
  public async findByChapterIds(
    chapterIds: string[],
  ): Promise<DomainQuestion[]> {
    const records = await this._prisma.question.findMany({
      where: {
        chapterId: { in: chapterIds },
        deletedAt: null,
      },
      include: {
        answers: true,
        licenseLinks: true,
        chapter: true,
      },
    });

    return records
      .map((rec) =>
        this._toDomain(rec as unknown as PrismaQuestionWithRelations),
      )
      .filter((q): q is DomainQuestion => q !== null);
  }

  /**
   * @description Thực thi đếm số lượng bản ghi thỏa mãn điều kiện ID và chưa xóa.
   */
  public async countActiveByIds(ids: string[]): Promise<number> {
    // Zero Any: Trả về kết quả trực tiếp từ Prisma (kiểu number)
    return await this._prisma.question.count({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
    });
  }

  /**
   * @description Truy vấn kho câu hỏi dựa trên quan hệ n-n với hạng bằng lái.
   * @param {GetSelectionPoolDto} filter - Bộ lọc từ Application Layer.
   * @returns {Promise<QuestionWithDetails[]>} Danh sách câu hỏi.
   */
  public async findSelectionPool(
    filter: GetSelectionPoolDto,
  ): Promise<QuestionWithDetails[]> {
    return (await this._prisma.question.findMany({
      where: {
        // Nếu licenseId rỗng, ta truyền undefined để Prisma bỏ qua filter này
        licenseLinks: filter.licenseId
          ? {
              some: { licenseCategoryId: filter.licenseId },
            }
          : undefined,

        // Tương tự cho chapterId
        chapterId: filter.chapterId || undefined,

        isCritical: filter.isCritical, // undefined sẵn rồi nên ko sao
        deletedAt: null,

        // Search: Chỉ filter khi có nội dung
        content: filter.search ? { contains: filter.search } : undefined,

        // Loại trừ IDs: Chỉ filter khi mảng có phần tử
        id: filter.excludeIds?.length
          ? { notIn: filter.excludeIds }
          : undefined,

        // Trạng thái: isActive
        status: filter.isActive ? "ACTIVE" : undefined,
      },
      orderBy: {
        indexNumber: "asc", // Sắp xếp tăng dần theo số thứ tự câu hỏi
      },
      include: {
        chapter: true, // Lấy toàn bộ thông tin chương
        licenseLinks: {
          include: {
            licenseCategory: { select: { name: true } }, // Chỉ lấy tên hạng bằng
          },
        },
      },
    })) as QuestionWithDetails[];
  }

  /**
   * @description Kiểm tra sự tồn tại của tập hợp ID câu hỏi.
   * @param {string[]} ids - Danh sách ID cần check.
   * @returns {Promise<boolean>}
   */
  public async existsAll(ids: string[]): Promise<boolean> {
    const count = await this._prisma.question.count({
      where: { id: { in: ids } },
    });
    return count === ids.length;
  }

  /**
   * @description Thống kê các liên kết và thành phần phụ thuộc của Câu hỏi (Question) trên toàn hệ thống.
   * @param {string} id - Định danh duy nhất (UUID) của câu hỏi cần kiểm tra. (Unique identifier of the question).
   * @returns {Promise<QuestionRelatedCount>} Đối tượng chứa số lượng chi tiết các mối quan hệ. (Object containing counts of related entities).
   */
  public async countRelatedData(id: string): Promise<QuestionRelatedCount> {
    // 1. Chạy song song tất cả các truy vấn I/O (Dịch: Run all I/O queries in parallel)
    // Việc này giúp giảm tổng thời gian chờ đợi xuống mức thấp nhất
    const [
      question,
      licenseLinksCount,
      examQuestionsCount,
      questionStatsCount,
    ] = await Promise.all([
      this._prisma.question.findUnique({
        where: { id },
        select: { chapterId: true }, // Cheap Query: Chỉ lấy đúng field cần
      }),
      this._prisma.questionLicenseCategory.count({
        where: { questionId: id }, // Pivot Table: Bảng trung gian N-N
      }),
      this._prisma.examQuestion.count({
        where: { questionId: id },
      }),
      this._prisma.questionStatistics.count({
        where: { questionId: id },
      }),
    ]);

    // 2. Trả về kết quả đã được thống kê (Dịch: Return aggregated stats)
    return {
      questionStats: questionStatsCount, // Đã sửa lỗi sai tên biến (Fixed variable naming mismatch)
      chapter: question?.chapterId ? 1 : 0,
      licenseLinks: licenseLinksCount,
      examQuestions: examQuestionsCount,
    };
  }
}
