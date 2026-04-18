import { IImportJobStatusResponseDTO } from "@/application/dtos/response/import/import-status-response.dto";
import { IImportJobResponseDTO } from "@/application/dtos/response/import/import-job.dto.respone";
import { ImportJobEntity } from "@/domain/entities/import/import-job.entity";
import { ImportStatus } from "@/domain/entities/import/import.status";
import { IImportJobRecord } from "@/infrastructure/persistence/import.record";
import { IImportResultData } from "@/domain/entities/import/import-result.type";
import { IRawQuestion } from "@/application/services/excel.service";
import { ImportQuestionCommand } from "@/application/dtos/request/question/import-question.command";
import { STORAGE_CONFIG } from "@/shared/config/storage.config"
import path from "path";

/**
 * @description Mapper chuẩn 4 hàm cho ImportJob.
 */
export class ImportMapper {

  /**
   * @description 1. Database Record -> Domain Entity
   */
  public static toDomain(raw: IImportJobRecord): ImportJobEntity {
    return new ImportJobEntity({
      id: raw.id,
      fileName: raw.fileName,
      totalSize: raw.totalSize,
      totalChunks: raw.totalChunks,
      chunkSizeLimit: raw.chunkSizeLimit,
      status: raw.status as ImportStatus,
      expiresAt: raw.expiresAt,
      resultData: (raw.resultData as IImportResultData) ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });
  }

  /**
   * @description 2. Domain Entity -> Database Record (Prisma)
   */
  public static toPersistence(entity: ImportJobEntity): Partial<IImportJobRecord> {
    const props = entity.toJSON();
    return {
      id: props.id,
      fileName: props.fileName,
      totalSize: props.totalSize,
      totalChunks: props.totalChunks,
      chunkSizeLimit: props.chunkSizeLimit,
      status: props.status,
      expiresAt: props.expiresAt,
      resultData: props.resultData ?? null,
    };
  }

  /**
   * @description Chuyển đổi từ Domain Entity sang Response DTO (Hết im lặng)
   * @param {ImportJobEntity} entity - Thực thể nghiệp vụ
   * @param {string} message - Thông báo tùy chọn gửi về cho FE
   */
  public static toResponse(entity: ImportJobEntity, message?: string): IImportJobResponseDTO {
    // 1. Lấy props an toàn từ Entity (Sử dụng Getter props đã đóng gói)
    const props = entity.props;
    const result = props.resultData;

    // 2. Mapping sang DTO chuẩn "Strict"
    return {
      jobId: props.id ?? '',
      fileName: props.fileName,
      status: props.status,

      // --- Cấu hình đối soát cho FE ---
      chunkSizeLimit: props.chunkSizeLimit,
      expectedChunks: props.totalChunks,
      expiresAt: props.expiresAt.toISOString(),

      // --- Thông báo ---
      message: message || 'Lấy thông tin phiên làm việc thành công.',

      // --- Dữ liệu tiến độ (Trái tim của sự "hết im lặng") ---
      progressData: {
        // Sử dụng Getter tính toán % thực tế từ Entity
        percent: entity.progressPercentage,
        currentStep: result.currentStep,
        metadata: {
          totalRows: result.totalRows,
          processedRows: result.processedRows,
          successCount: result.successCount,
          errorCount: result.errorCount,
        },
        errors: result.errors,
      }
    };
  }

  /**
   * @description 4. List mapping
   */
  public static toResponseList(entities: ImportJobEntity[]): IImportJobResponseDTO[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  /**
   * @description Ánh xạ từ Entity sang DTO trạng thái (Dịch: Map Entity to Status DTO)
   * @param {ImportJobEntity} entity - Thực thể nghiệp vụ đã được load từ DB
   * @returns {IImportJobStatusResponseDTO} DTO trạng thái chi tiết
   */
  public static toStatusResponse(entity: ImportJobEntity): IImportJobStatusResponseDTO {
    // 1. Lấy props an toàn (Readonly)
    const { id, status, resultData } = entity.props;

    // 2. Trả về cấu trúc phẳng nhưng đầy đủ thông tin
    return {
      jobId: id ?? "",
      status: status,

      /** * @description Tính toán % dựa trên logic nghiệp vụ của Entity.
       * BE tính toán giúp FE luôn, không để FE tự chia (tránh sai số).
       */
      progress: entity.progressPercentage,

      /** @description Metadata đối soát chi tiết */
      metadata: {
        totalRows: resultData.totalRows,
        processedRows: resultData.processedRows,
        successCount: resultData.successCount,
        errorCount: resultData.errorCount,
      },

      /** @description Danh sách lỗi (Strict Type: IImportError[]) */
      errors: resultData.errors,

      /** @description Bước xử lý hiện tại (Step: MERGING, EXTRACTING, v.v.) */
      currentStep: resultData.currentStep,
    };
  }

  /**
   * @description Chuyển đổi dữ liệu thô từ Excel thành Command chuẩn để xử lý 
   * @param raw - Dữ liệu thô bóc tách từ một dòng Excel (Raw data extracted from an Excel row)
   * @param extractedDir - Đường dẫn thư mục tạm chứa ảnh (Path to the temporary directory containing images)
   * @param chapterId - ID của Chương đã được tra cứu từ Cache (Chapter ID looked up from Cache)
   * @param categoryId - ID của Hạng bằng đã được tra cứu từ Cache (Category ID looked up from Cache)
   */
  public static toImportCommand(
    raw: IRawQuestion,
    extractedDir: string,
    chapterId: string,
    categoryId: string[]
  ): ImportQuestionCommand {
    const { IMAGE_FOLDER } = STORAGE_CONFIG.IMPORT_CONVENTION;
    // 1. Ánh xạ danh sách đáp án (Map the answers array)
    const mappedAnswers = raw.rawAnswers.map((ans, index) => {
      // Trong Excel, cột "Đáp án" ghi số 1, 2, 3, 4. 
      // Nhưng index của vòng lặp map() trong TypeScript bắt đầu từ 0.
      // (In Excel, the "Answer" column records 1, 2, 3, 4. But the map() loop index in TS starts at 0.)
      const isCorrect = (index + 1) === raw.correctAnswerIndex;

      return {
        content: ans.text,
        isCorrect: isCorrect,
        // Nối đường dẫn thư mục tạm với tên file ảnh để ra đường dẫn vật lý tuyệt đối
        // (Join the temporary directory path with the image filename to get the absolute physical path)
        imageLocalPath: ans.image
          ? path.join(extractedDir, IMAGE_FOLDER, ans.image)
          : undefined
      };
    });

    // 2. Lắp ráp và trả về DTO chuẩn (Assemble and return the standard DTO)
    return {
      chapterId: chapterId,
      categoryId: categoryId,
      content: raw.content,
      difficultyLevel: parseInt(raw.difficulty) || 1,
      isCritical: raw.isCritical,
      // Ảnh chính của câu hỏi (Main image of the question)
      imageLocalPath: raw.questionImage
        ? path.join(extractedDir, IMAGE_FOLDER, raw.questionImage)
        : undefined,
      answers: mappedAnswers
    };
  }
}