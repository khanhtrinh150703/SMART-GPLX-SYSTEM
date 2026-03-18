import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User'; // Domain Entity
import { UserMapper } from './mappers/user.mapper'; // Bộ chuyển đổi

const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
  
  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({ 
      where: { email, deletedAt: null } // Chỉ lấy user chưa bị xóa (Soft Delete)
    });

    if (!rawUser) return null;

    return UserMapper.toDomain(rawUser);
  }

  async create(data: any): Promise<User> {
    const rawUser = await prisma.user.create({ data });
    
    // Luôn trả về Entity thay vì Prisma Model
    return UserMapper.toDomain(rawUser);
  }

  async findById(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({ 
      where: { id } 
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }
}