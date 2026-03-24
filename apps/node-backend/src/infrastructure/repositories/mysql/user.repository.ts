
// const prisma = new PrismaClient();

import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import prisma from "../../../../prisma/prisma";

export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: { email, deletedAt: null } // Chỉ lấy user chưa bị xóa (Soft Delete)
    });

    if (!rawUser) return null;

    return UserMapper.toDomain(rawUser);
  }

  async findByUserName(username: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: { username, deletedAt: null }
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  async findByUserName_deleted(username: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { username }
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }


  async findById(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: { id, deletedAt: null }
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  async checkUserExists(email: string, username: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ],
        deletedAt: null
      }
    });
    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }


  async create(user: User): Promise<User> {
    // 1. Chuyển từ Entity (Domain) sang Object phẳng (Database)
    const persistenceData = UserMapper.toPersistence(user);

    // 2. Đưa dữ liệu đã "lọc" vào Prisma
    const rawUser = await prisma.user.create({
      data: persistenceData
    });

    // 3. Chuyển ngược lại từ Prisma Model sang Entity để trả về cho Service
    return UserMapper.toDomain(rawUser);
  }


  async update(user: User): Promise<User> {
    // 1. Chuyển từ Domain Entity sang Persistence Data (Object phẳng của Prisma)
    const persistenceData = UserMapper.toPersistence(user);

    // 2. Gọi Prisma update dữ liệu dựa trên ID
    const rawUser = await prisma.user.update({
      where: { id: user.id },
      data: persistenceData
    });

    // 3. Trả về Domain Entity mới sau khi đã cập nhật
    return UserMapper.toDomain(rawUser);
  }

}