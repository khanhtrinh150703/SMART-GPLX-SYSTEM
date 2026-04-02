import { Prisma } from "@prisma/client";

/**
 * Interface đại diện cho cấu trúc bản ghi Chapter trong Database (Prisma).
 * Giúp loại bỏ hoàn toàn 'any'.
 */
export interface IChapterRecord {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number; // Thường DB dùng snake_case
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Type chuẩn từ Prisma để lấy dữ liệu thô (Tránh lỗi {} rỗng).
 */
export type PrismaChapter = Prisma.ChapterGetPayload<Record<string, never>>;