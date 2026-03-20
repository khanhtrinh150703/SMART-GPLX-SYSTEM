// import { PrismaClient } from '@prisma/client';

import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User'; // Domain Entity
import { UserMapper } from './mappers/user.mapper'; // Bộ chuyển đổi
import prisma from '../../../prisma/prisma';

// const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { email, deletedAt: null } // Chỉ lấy user chưa bị xóa (Soft Delete)
    });

    if (!rawUser) return null;

    return UserMapper.toDomain(rawUser);
  }

  async findByUserName(username: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { username, deletedAt: null }
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }


  async findById(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { id, deletedAt: null }
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


}