import { QuestionAdminResponseDTO } from "@/application/dtos/response/question/admin-question.respone.dto";
import { QuestionResponseDTO } from "@/application/dtos/response/question/question.respone.dto";
import { labels } from "@/domain/constants/difficulty.constant";
import { Question } from "@/domain/entities/question/question.entity";
import { IQuestionRecord } from "@/infrastructure/persistence/question.record";

export class QuestionMapper {

  /**
   * @description Chuyển từ Database Record (Prisma) sang Domain Entity (Dịch: Map DB Record to Domain Entity)
   * Xử lý "làm phẳng" dữ liệu từ các bảng liên quan (Chapter, LicenseCategory).
   */
  public static toDomain(raw: IQuestionRecord): Question {
    return Question.reconstitute({
      id: raw.id,
      chapterId: raw.chapterId,
      content: raw.content,
      imageUrl: raw.imageUrl ?? null,
      difficultyLevel: raw.difficultyLevel,
      isCritical: raw.isCritical,
      
      // --- PHẦN LÀM GIÀU DỮ LIỆU (DATA ENRICHMENT) ---
      // Lấy tên chương từ quan hệ chapter
      chapterName: raw.chapter?.name || "Chưa phân loại",

      // Lấy danh sách ID từ bảng trung gian licenseLinks
      licenseCategoryIds: (raw.licenseLinks || []).map((l) => l.licenseCategoryId),

      // Lấy danh sách TÊN từ bảng lồng nhau licenseCategory (Dịch: Flatten nested names)
      licenseCategoryNames: (raw.licenseLinks || [])
        .map((l) => l.licenseCategory?.name)
        .filter((name): name is string => !!name), 
      // ----------------------------------------------

      deletedAt: raw.deletedAt ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      status: raw.status,
      // Map danh sách đáp án
      answers: (raw.answers || []).map((a) => ({
        id: a.id,
        content: a.content,
        imageUrl: a.imageUrl ?? null,
        isCorrect: a.isCorrect,
        deletedAt: a.deletedAt ?? null,
      })),
    });
  }

  /**
   * @description Chuyển từ Entity sang Persistence Record (Dịch: Map Entity to Database Record)
   * Chỉ giữ lại các trường thực sự tồn tại trong bảng Question.
   */
  public static toPersistence(entity: Question): Partial<IQuestionRecord> {
    const { props } = entity;
    return {
      chapterId: props.chapterId,
      content: props.content,
      imageUrl: props.imageUrl,
      difficultyLevel: props.difficultyLevel,
      isCritical: props.isCritical,
      status: props.status,
      // Lưu ý: Không đưa chapterName hay licenseCategoryNames vào đây vì DB không có cột này
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