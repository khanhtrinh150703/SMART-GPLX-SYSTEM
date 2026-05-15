import { IExcelService } from '@/domain/interfaces/services/integration/commands/i-excel.service';
import { AppError, ErrorCode } from '@/shared/errors';
import { RowValidationError } from '@/shared/errors/row-validation.error';
import ExcelJS from 'exceljs';
import path from 'node:path';
import fs from 'node:fs/promises';
import { QuestionExcelMapper } from '@/infrastructure/database/mappers/integration/excel/question-excel.mapper';
import { IRawQuestion } from '@/domain/entities/import/raw-question.props';
import { IImportQuestionProps } from '@/domain/entities/import/import-question.props';

/**
 * @class ExcelService
 * @description Dịch vụ hạ tầng (Infrastructure Service) chuyên trách các thao tác I/O thô trên tệp tin Excel.
 * @principle Separation of Concerns - Chỉ tập trung vào xử lý tệp tin, không tham gia vào logic nghiệp vụ chuyển đổi dữ liệu. (Handles file operations only, no data transformation logic).
 */
export class ExcelService implements IExcelService {

  /**
   * @description Xây dựng và chuẩn hóa đường dẫn tuyệt đối đến tệp tin Excel dựa trên thư mục nguồn và tên tệp.
   * @param {string} extractedDir - Đường dẫn đến thư mục chứa tệp đã được giải nén. (Directory path where files are extracted).
   * @param {string} excelName - Tên chính xác của tệp tin Excel (bao gồm cả phần mở rộng). (Exact Excel filename including extension).
   * @returns {string} Đường dẫn tuyệt đối hoàn chỉnh của tệp tin. (The complete absolute path to the file).
   */
  public buildExcelPath(extractedDir: string, excelName: string): string {
    return path.join(extractedDir, excelName);
  }

  /**
   * @description Đọc dữ liệu từ tệp Excel và chuyển đổi thành danh sách câu hỏi thô.
   * Sử dụng Mapper để ánh xạ dữ liệu từng dòng, tự động bỏ qua tiêu đề và các hàng trống.
   * @param {string} filePath - Đường dẫn vật lý của tệp Excel trên hệ thống.
   * @returns {Promise<IRawQuestion[]>} Mảng chứa dữ liệu câu hỏi thô (Raw DTO).
   * @throws {AppError} EXCEL.WORKSHEET_NOT_FOUND - Nếu không tìm thấy trang tính (Sheet) đầu tiên trong tệp.
   */
  public async readQuestions(filePath: string): Promise<IRawQuestion[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new AppError(ErrorCode.EXCEL.WORKSHEET_NOT_FOUND);
    }

    const questions: IRawQuestion[] = [];

    worksheet.eachRow((row, rowNumber) => {
      // 1. Bỏ qua header
      if (rowNumber <= 1) return;

      // 2. Kiểm tra nhanh nếu dòng trống (check cột content)
      const content = row.getCell(2).text;
      if (!content) return;

      // 3. Sử dụng Mapper để "thông dịch" dòng này
      // Không cần push thủ công lùm xùm, Mapper lo hết logic ép kiểu và parse
      questions.push(QuestionExcelMapper.toRawDto(row));
    });

    return questions;
  }

  /**
   * @description Kiểm tra sự tồn tại của các tệp tin hình ảnh vật lý trên ổ đĩa dựa trên đường dẫn tuyệt đối.
   * @param {IImportQuestionProps} props - Đối tượng chứa thông tin câu hỏi và danh sách các đường dẫn ảnh cần kiểm tra. (Object containing question data and image paths to validate).
   * @returns {Promise<void>} 
   * @throws {RowValidationError} Lỗi xảy ra khi có ít nhất một tệp tin hình ảnh không tồn tại tại đường dẫn đã chỉ định. (Thrown when at least one image file is missing at the specified path).
   */
  public async validateImagesExist(props: IImportQuestionProps): Promise<void> {
    const imageErrors: string[] = [];

    // 1. Kiểm tra ảnh chính của câu hỏi
    if (props.questionImage) {
      try {
        await fs.access(props.questionImage);
      } catch {
        imageErrors.push(`Không tìm thấy ảnh câu hỏi: ${path.basename(props.questionImage)}`);
      }
    }

    // 2. Kiểm tra ảnh của từng đáp án
    for (const ans of props.answers) {
      if (ans.image) {
        try {
          await fs.access(ans.image);
        } catch {
          imageErrors.push(`Không tìm thấy ảnh đáp án: ${path.basename(ans.image)}`);
        }
      }
    }

    // Nếu có bất kỳ file nào thất lạc, ném lỗi để tầng Application ghi nhận vào Job
    if (imageErrors.length > 0) {
      throw new RowValidationError('Lỗi file đính kèm không tồn tại', imageErrors);
    }
  }
}