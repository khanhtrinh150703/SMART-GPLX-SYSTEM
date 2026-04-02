import { Prisma } from "@prisma/client";

/**
 * Interface đại diện cho cấu trúc bảng trong Database (thường được Prisma tự sinh).
 * Đảm bảo Zero Any khi làm việc với Mapper.
 */
export interface ILicenseCategoryRecord {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type PrismaLicenseCategory = Prisma.LicenseCategoryGetPayload<Record<string, never>>;