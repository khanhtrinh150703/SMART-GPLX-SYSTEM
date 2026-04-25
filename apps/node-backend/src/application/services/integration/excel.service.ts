import { IExcelService } from '@/domain/interfaces/services/integration/i-excel.service';
import { AppError, ErrorCode } from '@/shared/errors';
import { RowValidationError } from '@/shared/errors/row-validation.error';
import ExcelJS from 'exceljs';
import path from 'node:path';
import fs from 'node:fs/promises';
import { QuestionExcelMapper } from '@/infrastructure/database/mappers/integration/excel/question-excel.mapper';
import { IRawQuestion } from '@/domain/entities/import/raw-question.props';
import { IImportQuestionProps } from '@/domain/entities/import/import-question.props';

/**
 * @description Dịch vụ hạ tầng xử lý Excel. 
 * Chỉ thực hiện I/O thô, không chứa logic nghiệp vụ chuyển đổi dữ liệu.
 */
export class ExcelService implements IExcelService {

  /**
   * @description Xây dựng đường dẫn tuyệt đối đến file Excel.
   */
  public buildExcelPath(extractedDir: string, excelName: string): string {
    return path.join(extractedDir, excelName);
  }

  /**
   * @description Đọc file Excel và chuyển đổi thành mảng dữ liệu thô (Raw Data).
   * @param {string} filePath - Đường dẫn vật lý của file Excel cần đọc.
   * @returns {Promise<IRawQuestion[]>} Danh sách câu hỏi thô chưa qua xử lý logic.
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
   * @description Kiểm tra file vật lý dựa trên các đường dẫn tuyệt đối đã được Entity chuẩn bị.
   * Service này chỉ làm nhiệm vụ "hỏi" hệ điều hành xem file có đó không.
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