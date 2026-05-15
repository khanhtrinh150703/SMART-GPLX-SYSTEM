import {
  IQuestionAdminResponseDTO,
  QuestionAdminResponseDTO,
} from "@/application/dtos/response/question/admin-question.respone.dto";
import {
  ExamQuestionSummaryResponseDTO,
  IExamQuestionSummaryResponseDTO,
} from "@/application/dtos/response/question/exam-question-summary.respone.dto";
import {
  IQuestionResponseDTO,
  QuestionResponseDTO,
} from "@/application/dtos/response/question/question.respone.dto";
import { labels } from "@/domain/constants/difficulty.constant";
import { Answer } from "@/domain/entities/question/answer.entity";
import { Question } from "@/domain/entities/question/question.entity";
import { IQuestionProps } from "@/domain/entities/question/question.props";
import {
  IQuestionRecord,
  QuestionWithDetails,
} from "@/infrastructure/persistence/exam-mgmt/question.record";
import { Status } from "@/shared/config/status.config";
import { formatImageUrl } from "@/shared/utils/url.util";
import { Prisma } from "@prisma/client";

export class QuestionMapper {
  /**
   * @description Chuyển đổi bản ghi DB sang thực thể Domain (Convert DB record to Domain Entity)
   * @param raw Dữ liệu thô từ Database (Raw DB record)
   * @returns Thực thể câu hỏi hoàn chỉnh kèm danh sách câu trả lời (Complete Question entity with answers)
   */
  public static toDomain(raw: IQuestionRecord): Question {
    // 1. Tái tạo danh sách Answer Entities trước
    const answerEntities = (raw.answers || []).map((a) =>
      Answer.reconstitute({
        id: a.id,
        content: a.content,
        imageUrl: a.imageUrl || "",
        isCorrect: a.isCorrect,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        deletedAt: a.deletedAt ?? undefined,
      }),
    );

    // 2. Tái tạo Question Entity với mảng Answer Entities đã chuẩn bị
    return Question.reconstitute({
      id: raw.id,
      chapterId: raw.chapterId,
      content: raw.content,
      imageUrl: raw.imageUrl || "",
      difficultyLevel: raw.difficultyLevel,
      isCritical: raw.isCritical,
      indexNumber: raw.indexNumber,
      chapterName: raw.chapter?.name || "Chưa phân loại",

      // Làm phẳng IDs và Names
      licenseCategoryIds: (raw.licenseLinks || []).map(
        (l) => l.licenseCategoryId,
      ),
      licenseCategoryNames: (raw.licenseLinks || [])
        .map((l) => l.licenseCategory?.name)
        .filter((name): name is string => !!name),

      status: raw.status,
      answers: answerEntities,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? undefined,
    });
  }

  /**
   * @description Chuyển đổi thực thể sang dữ liệu tạo mới Prisma (Map entity to Prisma create input)
   * @param entity Thực thể câu hỏi (Question entity)
   * @returns Đối tượng để chèn dữ liệu vào DB kèm các quan hệ (Object for DB insertion with relations)
   */
  public static toCreatePersistence(
    entity: Question,
  ): Prisma.QuestionCreateInput {
    const props = entity.props;

    return {
      ...this.getCommonFields(props),
      answers: {
        create: props.answers.map((ans) => ({
          id: ans.id,
          content: ans.content,
          imageUrl: ans.imageUrl,
          isCorrect: ans.isCorrect,
        })),
      },
      licenseLinks: {
        create: props.licenseCategoryIds.map((catId) => ({
          licenseCategory: { connect: { id: catId } },
        })),
      },
    };
  }

  /**
   * @description Chuyển đổi thực thể sang dữ liệu cập nhật Prisma (Map entity to Prisma update input)
   * @param entity Thực thể câu hỏi (Question entity)
   * @returns Đối tượng cập nhật kèm logic đồng bộ Answers và Licenses (Update object with relation sync)
   */
  public static toUpdatePersistence(
    entity: Question,
  ): Prisma.QuestionUpdateInput {
    const props = entity.props;

    return {
      ...this.getCommonFields(props),
      answers: {
        updateMany: {
          where: {
            id: {
              notIn: props.answers
                .map((a) => a.id)
                .filter((id): id is string => !!id),
            },
            questionId: props.id,
          },
          data: { deletedAt: new Date() },
        },
        upsert: props.answers.map((ans) => ({
          where: { id: ans.id || "new-identity" },
          update: {
            content: ans.content,
            imageUrl: ans.imageUrl,
            isCorrect: ans.isCorrect,
            deletedAt: null,
          },
          create: {
            content: ans.content,
            imageUrl: ans.imageUrl,
            isCorrect: ans.isCorrect,
          },
        })),
      },
      licenseLinks: {
        deleteMany: {},
        create: props.licenseCategoryIds.map((catId) => ({
          licenseCategory: { connect: { id: catId } },
        })),
      },
    };
  }

  /**
   * @description Trích xuất các trường dữ liệu chung (Extract common fields)
   * @param props Các thuộc tính của câu hỏi (Question properties)
   * @returns Đối tượng chứa các trường dùng cho Create/Update (Shared fields for Create/Update)
   */
  private static getCommonFields(props: IQuestionProps) {
    return {
      id: props.id,
      content: props.content,
      imageUrl: props.imageUrl,
      indexNumber: props.indexNumber,
      difficultyLevel: props.difficultyLevel,
      isCritical: props.isCritical,
      status: props.status.toUpperCase() as Status,
      deletedAt: props.deletedAt,
      // Dùng connect để đảm bảo tính toàn vẹn quan hệ ở tầng DB
      chapter: { connect: { id: props.chapterId } },
    };
  }

  /**
   * @description Chuyển đổi thực thể sang DTO phản hồi cho học viên (Convert entity to student response DTO)
   * @param entity Thực thể câu hỏi (Question entity)
   * @returns DTO phản hồi tinh gọn (Clean response DTO)
   */
  public static toResponse(entity: Question): IQuestionResponseDTO {
    const { props } = entity;
    return new QuestionResponseDTO({
      id: props.id ?? "",
      indexNumber: props.indexNumber,
      chapterId: props.chapterId,
      content: props.content,
      status: props.status,
      // Format URL ảnh đầy đủ
      imageUrl: formatImageUrl(props.imageUrl),
      isCritical: props.isCritical,
      difficulty: {
        level: props.difficultyLevel,
        label: labels[props.difficultyLevel] || "Không xác định",
      },
      answers: props.answers.map((ans) => ({
        id: ans.id || "",
        content: ans.content,
        isCorrect: ans.isCorrect,
        imageUrl: formatImageUrl(ans.imageUrl) || null,
      })),
      licenseCategoryIds: props.licenseCategoryIds,
    });
  }

  /**
   * @description Chuyển đổi thực thể sang DTO chi tiết cho Admin (Convert entity to detailed Admin DTO)
   * @param entity Thực thể câu hỏi (Question entity)
   * @returns DTO phản hồi đầy đủ thông tin quản trị (Full admin response DTO)
   */
  public static toAdminResponse(entity: Question): IQuestionAdminResponseDTO {
    const base = this.toResponse(entity);

    return new QuestionAdminResponseDTO({
      ...base,
      // Bổ sung các thông tin nhãn hiển thị đã được nạp vào Entity Props
      chapterName: entity.props.chapterName || "Chưa phân loại",
      licenseCategoryNames: entity.props.licenseCategoryNames || [],
      deletedAt: entity.props.deletedAt
        ? entity.props.deletedAt.toISOString()
        : null,
      createdAt: entity.props.createdAt
        ? entity.props.createdAt.toISOString()
        : new Date().toISOString(),
    });
  }

  /**
   * @description Ánh xạ một bản ghi Question thô từ Database sang DTO rút gọn.
   * @param {QuestionWithDetails} raw - Dữ liệu thô trực tiếp từ Prisma model.
   * @param {number} chapterOrder - Thứ tự chương được giải quyết từ Cache hoặc Master Data.
   * @returns {IExamQuestionSummaryResponseDTO} DTO tóm tắt phục vụ hiển thị danh sách và Selection Pool.
   */
  public static toSummaryDTO(
    raw: QuestionWithDetails,
    chapterOrder: number,
  ): IExamQuestionSummaryResponseDTO {
    return new ExamQuestionSummaryResponseDTO({
      id: raw.id,
      content: raw.content,
      // hoặc ông có thể lấy từ Cache truyền vào tham số thứ 3
      difficultyLabel:
        labels[raw.difficultyLevel as keyof typeof labels] ?? "EASY",
      chapterName: raw.chapter.name,
      licenseCategoryNames: raw.licenseLinks.map(
        (link) => link.licenseCategory.name,
      ),
      chapterOrder: chapterOrder,
      isCritical: raw.isCritical,
      indexNumber: raw.indexNumber,
      // Vì là model thô nên licenseCategoryIds sẽ không có sẵn trừ khi ông include.
      // Nếu không cần hiển thị ngay ở Pool thì để mảng rỗng.
      licenseIds: raw.licenseLinks.map((link) => link.licenseCategoryId),
    });
  }

  /**
   * @description Chuyển đổi hàng loạt danh sách bản ghi Question sang danh sách DTO tóm tắt.
   * Sử dụng cơ chế Dependency Injection thông qua callback để giải quyết dữ liệu ngoại vi (Chapter Order).
   * @param {QuestionWithDetails[]} rawList - Mảng các bản ghi câu hỏi từ Repository.
   * @param {(chapterId: string) => number} resolveChapterOrder - Hàm callback tra cứu thứ tự chương (thường dùng Memory Map).
   * @returns {IExamQuestionSummaryResponseDTO[]} Danh sách DTO đã được định dạng chuẩn.
   */
  public static toSummaryDTOList(
    rawList: QuestionWithDetails[],
    resolveChapterOrder: (id: string) => number,
  ): IExamQuestionSummaryResponseDTO[] {
    return rawList.map((raw) =>
      this.toSummaryDTO(raw, resolveChapterOrder(raw.chapterId)),
    );
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang DTO phản hồi (Convert entity list to response DTOs)
   * @param entities Danh sách thực thể câu hỏi (List of question entities)
   * @returns Danh sách DTO cho người dùng (List of DTOs for users)
   */
  public static toResponseList(entities: Question[]): IQuestionResponseDTO[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang DTO cho quản trị viên (Convert entity list to admin DTOs)
   * @param entities Danh sách thực thể câu hỏi (List of question entities)
   * @returns Danh sách DTO chi tiết cho admin (List of detailed DTOs for admins)
   */
  public static toAdminResponseList(
    entities: Question[],
  ): IQuestionAdminResponseDTO[] {
    return entities.map((entity) => this.toAdminResponse(entity));
  }
}
