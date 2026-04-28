import { IImportJobStatusResponseDTO } from "@/application/dtos/response/import/import-status-response.dto";
import { IImportJobResponseDTO } from "@/application/dtos/response/import/import-job.dto.respone";
import { ImportJobEntity } from "@/domain/entities/import/import-job.entity";
import { ImportStatus } from "@/domain/entities/import/import.status";
import { IImportJobRecord } from "@/infrastructure/persistence/integration/import.record";
import { IImportResultData } from "@/domain/entities/import/import-result.type";
import { Prisma } from "@prisma/client";
import { IImportJobProps } from "@/domain/entities/import/import-job.props";

/**
 * @description Mapper chuẩn 4 hàm cho ImportJob.
 */
export class ImportMapper {

  /**
   * @description Chuyển đổi bản ghi từ Database sang thực thể Domain (Import Job).
   * @param {IImportJobRecord} raw - Dữ liệu thô từ tầng Persistence (Prisma Record).
   * @returns {ImportJobEntity} Thực thể nghiệp vụ hoàn chỉnh.
   */
  public static toDomain(raw: IImportJobRecord): ImportJobEntity {
    // 1. Chuẩn bị Props
    const props: IImportJobProps = {
      id: raw.id,
      fileName: raw.fileName,
      totalSize: raw.totalSize,
      totalChunks: raw.totalChunks,
      chunkSizeLimit: raw.chunkSizeLimit,
      status: raw.status as ImportStatus,
      expiresAt: raw.expiresAt,
      resultData: (raw.resultData as IImportResultData) || {
        successCount: 0,
        failCount: 0,
        errors: [],
        errorCount: 0,
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };

    // 2. Khởi tạo thông qua phương thức static (Khuyên dùng)
    return ImportJobEntity.reconstitute(props);
  }

  /**
   * @description Chuyển đổi thực thể Domain sang định dạng lưu trữ của Prisma.
   * @param {ImportJobEntity} entity - Thực thể Import Job từ tầng Domain.
   * @returns {Prisma.ImportJobCreateInput} Dữ liệu đầu vào cho tầng Database.
   */
  public static toPersistence(entity: ImportJobEntity): Prisma.ImportJobCreateInput {
    // Truy cập thông qua getter props (đã được freeze) để bảo vệ Entity
    const props = entity.props;

    return {
      id: props.id,
      fileName: props.fileName,
      totalSize: props.totalSize,
      totalChunks: props.totalChunks,
      chunkSizeLimit: props.chunkSizeLimit,
      status: props.status,
      expiresAt: props.expiresAt,
      resultData: (props.resultData as Prisma.InputJsonValue),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
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

      // --- Dữ liệu tiến độ  ---
      progressData: {
        percent: entity.progressPercentage,
        currentStep: result.currentStep || 'QUEUED',
        metadata: {
          totalRows: result.totalRows ?? 0,
          processedRows: result.processedRows ?? 0,
          successCount: result.successCount ?? 0,
          errorCount: result.errorCount ?? 0,
        },
        errors: result.errors || [],
      }
    };
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang danh sách DTO phản hồi (List mapping).
   * @param {ImportJobEntity[]} entities - Mảng các thực thể Import Job từ tầng Domain.
   * @returns {IImportJobResponseDTO[]} Mảng DTO định dạng dữ liệu cho API.
   */
  public static toResponseList(entities: ImportJobEntity[]): IImportJobResponseDTO[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  /**
   * @description Chuyển đổi thực thể sang DTO trạng thái phục vụ cập nhật thời gian thực.
   * @param {ImportJobEntity} entity - Thực thể nghiệp vụ từ tầng Domain.
   * @returns {IImportJobStatusResponseDTO} DTO chứa thông tin trạng thái và tiến độ.
   */
  public static toStatusResponse(entity: ImportJobEntity): IImportJobStatusResponseDTO {
    // 1. Lấy props Readonly từ Entity
    const { id, status, resultData } = entity.props;

    // 2. Trả về cấu trúc phẳng, tối ưu cho việc hiển thị Progress Bar và Error Table
    return {
      jobId: id!,
      status: status,
      progress: entity.progressPercentage,
      currentStep: resultData.currentStep ?? 'QUEUED', // Tránh undefined

      // Metadata dùng để hiển thị các con số thống kê
      metadata: {
        totalRows: resultData.totalRows ?? 0,       // Ép về 0 nếu undefined
        processedRows: resultData.processedRows ?? 0,
        successCount: resultData.successCount ?? 0,
        errorCount: resultData.errorCount ?? 0,
      },

      // Danh sách lỗi chi tiết (Thêm kiểm tra errors tồn tại)
      errors: (resultData.errors || []).map(err => ({
        row: err.row,
        column: err.column ?? "Chung",
        message: err.message,
        details: err.details,
        timestamp: err.timestamp
      })),

      lastError: resultData.lastError ?? ""
    };
  }
}