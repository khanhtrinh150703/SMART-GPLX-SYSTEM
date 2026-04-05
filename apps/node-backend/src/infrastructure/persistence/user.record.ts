import { Prisma } from "@prisma/client";

/**
 * @description Triển khai Repository cho người dùng sử dụng MySQL và Prisma ORM.
 * Sử dụng IUserRecord làm cầu nối giữa Persistence và Domain.
 */
export type PrismaUserWithRoles = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      select: { roleId: true }
    }
  }
}>;

export interface IUserRecord {
  id: string;
  username: string;
  email: string;
  fullName: string | null;  
  phoneNumber: string | null;      // Phải có | null
  passwordHash: string ;  // Phải có | null
  status: string;
  urlPicture: string | null;    // Phải có | null
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;       // Phải có | null
  userRoles?: { roleId: string }[];
}