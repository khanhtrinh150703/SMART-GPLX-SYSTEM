import { IExcelService } from '@/domain/interfaces/services/i-excel.service';
import ExcelJS from 'exceljs';

// src/infrastructure/services/excel.service.ts

// src/infrastructure/services/excel.service.ts

export interface IRawQuestion {
  stt: number;
  content: string;
  chapter: string;
  licenseCategory: string; // Hạng bằng
  difficulty: string;      // Độ khó
  isCritical: boolean;     // Điểm liệt
  questionImage?: string;  // Ảnh câu hỏi

  // Dữ liệu thô của 4 đáp án (Xen kẽ Nội dung - Ảnh)
  rawAnswers: {
    text: string;
    image?: string;
  }[];

  correctAnswerIndex: number; // Cột "Đáp án"
  aiExplainDraft: string;     // Cột "AI EXPLAIN" - Chỉ dùng làm Context
}

export class ExcelService implements IExcelService {
  public async readQuestions(filePath: string): Promise<IRawQuestion[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    const questions: IRawQuestion[] = [];

    worksheet?.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return;

      const answers = [];
      // Cột 8 là Đáp án 1, Cột 9 là Ảnh ĐA 1... đến Cột 15 là Ảnh ĐA 4
      for (let i = 0; i < 4; i++) {
        const text = row.getCell(8 + i * 2).text;
        const img = row.getCell(9 + i * 2).text;
        if (text) answers.push({ text, image: img || undefined });
      }

      questions.push({
        stt: Number(row.getCell(1).value),
        content: row.getCell(2).text,
        chapter: row.getCell(3).text,
        licenseCategory: row.getCell(4).text,
        difficulty: row.getCell(5).text,
        isCritical: row.getCell(6).text === '1' || row.getCell(6).text.toLowerCase() === 'x',
        questionImage: row.getCell(7).text || undefined,
        rawAnswers: answers,
        correctAnswerIndex: Number(row.getCell(16).value), // Cột 16: Đáp án
        aiExplainDraft: row.getCell(17).text,              // Cột 17: AI EXPLAIN
      });
    });

    return questions;
  }
}