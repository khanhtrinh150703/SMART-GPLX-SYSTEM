import { ImportJobEntity } from "@/domain/entities/import/import-job.entity";


/**
 * @description Hợp đồng giao tiếp với Database cho ImportJob
 */
export interface IImportJobRepository {
  /**
   * @description Lưu thực thể mới hoặc cập nhật thực thể đã có
   * @param {ImportJobEntity} entity - Thực thể cần lưu
   * @returns {Promise<ImportJobEntity>} (Dịch: Trả về Promise chứa thực thể)
   */
  createImportJob(entity: ImportJobEntity): Promise<ImportJobEntity>;

  /**
   * @description Tìm kiếm phiên Import theo ID
   * @param {string} id - Mã định danh duy nhất (Dịch: Unique Identifier)
   * @returns {Promise<ImportJobEntity | null>}
   */
  findById(id: string): Promise<ImportJobEntity | null>;

  /**
   * @description Cập nhật thông tin phiên Import hiện có trong cơ sở dữ liệu.
   * @param {ImportJobEntity} entity - Đối tượng Entity chứa dữ liệu mới cần cập nhật.
   * @returns {Promise<ImportJobEntity>} Entity đã được cập nhật thành công.
   */
  updateImportJob(entity: ImportJobEntity): Promise<ImportJobEntity> 
}