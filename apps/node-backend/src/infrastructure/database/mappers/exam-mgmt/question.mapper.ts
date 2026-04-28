import { QuestionAdminResponseDTO } from "@/application/dtos/response/question/admin-question.respone.dto";
import { QuestionResponseDTO } from "@/application/dtos/response/question/question.respone.dto";
import { labels } from "@/domain/constants/difficulty.constant";
import { Answer } from "@/domain/entities/question/answer.entity";
import { Question } from "@/domain/entities/question/question.entity";
import { IQuestionProps } from "@/domain/entities/question/question.props";
import { QuestionStatus } from "@/domain/entities/question/question.status";
import { IQuestionRecord } from "@/infrastructure/persistence/exam-mgmt/question.record";
import { Prisma } from "@prisma/client";

export class QuestionMapper {

  /**
   * @description Chuyển từ Database Record (Prisma) sang Domain Entity.
   * Chốt chặn: Phải biến Answer Record thành Answer Entity.
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
      })
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
      licenseCategoryIds: (raw.licenseLinks || []).map((l) => l.licenseCategoryId),
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
     * @description Ánh xạ dữ liệu cho lệnh INSERT (Prisma.create).
     */
  public static toCreatePersistence(entity: Question): Prisma.QuestionCreateInput {
    const props = entity.props;

    return {
      ...this.getCommonFields(props),
      answers: {
        create: props.answers.map(ans => ({
          id: ans.id,
          content: ans.content,
          imageUrl: ans.imageUrl,
          isCorrect: ans.isCorrect,
        }))
      },
      licenseLinks: {
        create: props.licenseCategoryIds.map(catId => ({
          licenseCategory: { connect: { id: catId } }
        }))
      }
    };
  }

  /**
   * @description Ánh xạ dữ liệu cho lệnh UPDATE (Prisma.update).
   * Chứa logic đồng bộ (Sync) trạng thái Answers và LicenseLinks.
   */
  public static toUpdatePersistence(entity: Question): Prisma.QuestionUpdateInput {
    const props = entity.props;

    return {
      ...this.getCommonFields(props),
      answers: {
        updateMany: {
          where: {
            id: { notIn: props.answers.map(a => a.id).filter((id): id is string => !!id) },
            questionId: props.id
          },
          data: { deletedAt: new Date() }
        },
        upsert: props.answers.map(ans => ({
          where: { id: ans.id || 'new-identity' },
          update: {
            content: ans.content,
            imageUrl: ans.imageUrl,
            isCorrect: ans.isCorrect,
            deletedAt: null
          },
          create: {
            content: ans.content,
            imageUrl: ans.imageUrl,
            isCorrect: ans.isCorrect
          }
        }))
      },
      licenseLinks: {
        deleteMany: {},
        create: props.licenseCategoryIds.map(catId => ({
          licenseCategory: { connect: { id: catId } }
        }))
      }
    };
  }

  /**
   * @description Trích xuất các trường chung giữa Create và Update.
   * Tuyệt đối không dùng any, sử dụng IQuestionProps để đảm bảo Type Safety.
   */
  private static getCommonFields(props: IQuestionProps) {
    return {
      id: props.id,
      content: props.content,
      imageUrl: props.imageUrl,
      indexNumber: props.indexNumber,
      difficultyLevel: props.difficultyLevel,
      isCritical: props.isCritical,
      status: props.status.toUpperCase() as QuestionStatus,
      deletedAt: props.deletedAt,
      // Dùng connect để đảm bảo tính toàn vẹn quan hệ ở tầng DB
      chapter: { connect: { id: props.chapterId } },
    };
  }

  /**
   * @description Ánh xạ dữ liệu tinh gọn cho học viên (Dịch: Map clean data for students)
   */
  public static toResponse(entity: Question): QuestionResponseDTO {
    const { props } = entity;
    const baseUrl = process.env.APP_URL || ''; // Dùng để format full path cho ảnh

    return {
      id: props.id ?? "",
      indexNumber: props.indexNumber,
      chapterId: props.chapterId,
      content: props.content,
      status: props.status,
      // Format URL ảnh đầy đủ
      imageUrl: props.imageUrl ? `${baseUrl}/${props.imageUrl.replace(/^\//, '')}` : null,
      isCritical: props.isCritical,
      difficulty: {
        level: props.difficultyLevel,
        label: labels[props.difficultyLevel] || 'Không xác định'
      },
      answers: props.answers.map((ans) => ({
        id: ans.id || "",
        content: ans.content,
        isCorrect: ans.isCorrect,
        imageUrl: ans.imageUrl ? `${baseUrl}/${ans.imageUrl.replace(/^\//, '')}` : null,
      })),
      licenseCategoryIds: props.licenseCategoryIds,
    };
  }

  /**
   * @description Ánh xạ dữ liệu đầy đủ cho Admin (Dịch: Map rich data for Admin panel)
   */
  public static toAdminResponse(entity: Question): QuestionAdminResponseDTO {
    const base = this.toResponse(entity);

    return {
      ...base,
      // Bổ sung các thông tin nhãn hiển thị đã được nạp vào Entity Props
      chapterName: entity.props.chapterName || "Chưa phân loại",
      licenseCategoryNames: entity.props.licenseCategoryNames || [],
      deletedAt: entity.props.deletedAt ? entity.props.deletedAt.toISOString() : null,
      createdAt: entity.props.createdAt ? entity.props.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  public static toResponseList(entities: Question[]): QuestionResponseDTO[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  public static toAdminResponseList(entities: Question[]): QuestionAdminResponseDTO[] {
    return entities.map((entity) => this.toAdminResponse(entity));
  }
}