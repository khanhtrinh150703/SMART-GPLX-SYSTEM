import { IImportQuestionProps } from "@/domain/entities/import/import-question.props";
import { IRawQuestion } from "@/domain/entities/import/raw-question.props";

/**
 * @description Dịch vụ xử lý tệp Excel và kiểm tra tài nguyên vật lý.
 */
export interface IExcelService {
  /**
   * @description Đọc dữ liệu thô từ file Excel và chuyển đổi thành mảng.
   * @param filePath - Đường dẫn tuyệt đối đến file Excel.
   */
  readQuestions(filePath: string): Promise<IRawQuestion[]>;

  /**
   * @description Thao tác chuỗi để xây dựng đường dẫn tuyệt đối cho file Excel.
   * @param extractedDir - Thư mục gốc đã giải nén.
   * @param excelName - Tên file Excel cần truy cập.
   */
  buildExcelPath(extractedDir: string, excelName: string): string;

  /**
   * @description Kiểm tra sự tồn tại vật lý của các file ảnh trên ổ cứng.
   * @param props - Thuộc tính câu hỏi đã có sẵn đường dẫn ảnh tuyệt đối.
   */
  validateImagesExist(props: IImportQuestionProps): Promise<void>;
}