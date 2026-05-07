import { IRawQuestion } from '@/domain/entities/import/raw-question.props';
import { Row } from 'exceljs';

export class QuestionExcelMapper {
  private static readonly TRUTHY_VALUES = ['1', 'x', 'có', 'co', 'yes', 'true'];

  public static toRawDto(row: Row): IRawQuestion {
    const getCell = (col: number) => row.getCell(col).text?.toString().trim() || '';

    const isCriticalRaw = this.TRUTHY_VALUES.includes(getCell(6).toLowerCase());

    const rawLicenseValue = getCell(4); // Lấy giá trị gốc từ cột 4
    const licenseCategoryArray = rawLicenseValue.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);

    const rawAnswers = [];
    for (let i = 0; i < 4; i++) {
      const text = getCell(8 + i * 2);
      const image = getCell(9 + i * 2);
      if (text) {
        rawAnswers.push({ text, image: image || undefined });
      }
    }

    return {
      indexNumber: Number(getCell(1)) || 0,
      content: getCell(2),
      chapter: getCell(3),
      licenseCategory: licenseCategoryArray, // Dùng biến đã log ở trên
      difficultyLevel: Number(getCell(5)) || 1,
      isCriticalRaw,
      questionImage: getCell(7) || undefined,
      rawAnswers,
      correctAnswerIndex: Number(getCell(16)) || 0,
      aiExplainDraft: getCell(17),
    };
  }
}