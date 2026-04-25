import { IRawQuestion } from '@/domain/entities/import/raw-question.props';
import { Row } from 'exceljs';

export class QuestionExcelMapper {
  private static readonly TRUTHY_VALUES = ['1', 'x', 'có', 'co', 'yes', 'true'];

  public static toRawDto(row: Row): IRawQuestion {
    const getCell = (col: number) => row.getCell(col).text?.toString().trim() || '';

    // Logic parse linh hoạt cho isCritical
    const isCriticalRaw = this.TRUTHY_VALUES.includes(getCell(6).toLowerCase());

    // Thu thập câu trả lời (Cột 8-15)
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
      licenseCategory: getCell(4).split(' ').map(s => s.trim()), 
      difficultyLevel: Number(getCell(5)) || 1,
      isCriticalRaw,
      questionImage: getCell(7) || undefined,
      rawAnswers,
      correctAnswerIndex: Number(getCell(16)) || 0,
      aiExplainDraft: getCell(17),
    };
  }
}