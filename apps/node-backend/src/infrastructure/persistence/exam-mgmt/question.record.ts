import { QuestionStatus } from "@/domain/entities/question/question.status";
import { Prisma } from "@prisma/client";

// 1. Interface cho Answer (Dịch: Answer record interface)
export interface IAnswerRecord {
  id: string;
  questionId: string;
  content: string;
  imageUrl: string | null;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// 2. Interface cho Link (Dịch: License link record interface)
// Cập nhật thêm licenseCategory để lấy được Name
export interface ILicenseLinkRecord {
  questionId: string;
  licenseCategoryId: string;
  licenseCategory?: {
    name: string;
  };
}

// 3. Interface Question Record mở rộng (Dịch: Enriched Question Record)
export interface IQuestionRecord {
  id: string;
  chapterId: string;
  content: string;
  imageUrl: string | null;
  difficultyLevel: number;
  isCritical: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  indexNumber: number,
  // Các quan hệ lồng nhau
  answers?: IAnswerRecord[];
  licenseLinks?: ILicenseLinkRecord[];
  chapter?: {
    name: string;
  };
  status: QuestionStatus;

  // Các trường "ảo" dùng để map sang Entity dễ hơn
  chapterName?: string;
  licenseCategoryNames?: string[];
}

/**
 * @description Type chuẩn từ Prisma bao gồm đầy đủ quan hệ để lấy Tên hiển thị.
 * (Dịch: Standard Prisma type with full relations for display names)
 */
export type PrismaQuestionWithRelations = Prisma.QuestionGetPayload<{
  include: {
    questions: true;
    answers: true;
    chapter: { select: { name: true } }; // Lấy thêm tên chương
    licenseLinks: {
      include: {
        licenseCategory: { select: { name: true } } // Lấy thêm tên hạng bằng
      }
    };
  };
}>;

/**
 * @description Type mở rộng cho Question bao gồm đầy đủ thông tin Chapter và tên Hạng bằng lái.
 */
export type QuestionWithDetails = Prisma.QuestionGetPayload<{
  include: {
    chapter: true,
    licenseLinks: {
      include: {
        licenseCategory: { select: { name: true } }
      }
    }
  }
}>;