import { IRawQuestion } from "@/application/services/excel.service";

export interface IExcelService {
  /**
   * Đọc file Excel từ đường dẫn và chuyển đổi thành danh sách các câu hỏi thô.
   */
  readQuestions(filePath: string): Promise<IRawQuestion[]>;
}