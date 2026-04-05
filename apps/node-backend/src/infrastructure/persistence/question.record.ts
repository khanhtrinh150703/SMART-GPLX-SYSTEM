import { Prisma } from "@prisma/client";

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

export interface ILicenseLinkRecord {
  questionId: string;
  licenseCategoryId: string;
}

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
  answers?: IAnswerRecord[];
  licenseLinks?: ILicenseLinkRecord[];
}

/**
 * Type chuẩn từ Prisma bao gồm cả quan hệ Answers và LicenseLinks.
 */
export type PrismaQuestionWithRelations = Prisma.QuestionGetPayload<{
  include: {
    answers: true;
    licenseLinks: true;
  };
}>;