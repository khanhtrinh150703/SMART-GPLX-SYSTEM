import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../domain/entities/User';

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    // Mapper là nơi lý tưởng để xử lý các vấn đề về kiểu dữ liệu 
    // Ví dụ: mapping Enum của Prisma sang Enum của Domain, 
    // hoặc xử lý null/undefined để đảm bảo Domain Entity luôn "sạch".
    
    return User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName,
      status: raw.status as any, // Ép kiểu nếu cần
      urlPicture: raw.urlPicture,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(user: User): any {
    // Ngược lại, khi bạn muốn lưu từ Domain vào DB
    return {
      id: user.id,
      username: user.username,
      // ... mapping ngược lại các trường
    };
  }
}