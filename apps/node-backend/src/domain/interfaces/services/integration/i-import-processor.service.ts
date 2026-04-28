/**
 * @description Interface cho dịch vụ xử lý nặng (Dịch: Heavy Processing Service Interface)
 */
export interface IImportProcessorService {
  /**
   * @description Thực hiện quy trình nhai file ZIP, giải nén và lưu DB
   * @param jobId - ID của phiên làm việc
   * @param zipPath - Đường dẫn vật lý đến file ZIP đã gộp
   */
  process(jobId: string, zipPath: string): Promise<void>;
}