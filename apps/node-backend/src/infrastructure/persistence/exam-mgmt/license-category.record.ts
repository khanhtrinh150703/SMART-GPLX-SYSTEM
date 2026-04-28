import { Prisma } from "@prisma/client";

/**
 * @description Interface đại diện cho cấu trúc bảng trong Database (Persistence Layer).
 * Đã chuẩn hóa 100% camelCase để khớp với Domain Entity và Response DTO.
 */
export interface ILicenseCategoryRecord {
  id: string;
  name: string;
  description: string;
  minAge: number;
  orderIndex: number;
  createdAt: Date; // Đã chuyển từ created_at
  updatedAt: Date; // Đã chuyển từ updated_at
  deletedAt: Date | null;
}

/**
 * @description Type đại diện cho Payload trả về từ Prisma cho Model LicenseCategory.
 */
export type PrismaLicenseCategory = Prisma.LicenseCategoryGetPayload<Record<string, never>>;