import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from '../../../domain/entities/User';
import { UserStatus } from "../../../domain/constants/userStatus";
import { UserResponseDTO } from '@/application/dtos/respone/user.dto';

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.reconstitute({
      ...raw, // Copy toàn bộ những gì giống nhau
      fullName: raw.fullName ?? "",
      status: raw.status as UserStatus,
    });
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    // Chỉ lấy những gì cần thiết để lưu vào DB
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.displayName, // Mapping logic khác tên trường
      passwordHash: user.passwordHash!,
      status: user.isActive() ? 'active' : 'suspended',
      urlPicture: user.urlPicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  static toResponse(user: User): UserResponseDTO {
    // Bạn có thể dùng destructuring để lấy ra những thứ cần trả về
    const { id, username, email, urlPicture, createdAt } = user;
    
    return {
      id, username, email, urlPicture, createdAt,
      fullName: user.displayName,
      status: user.isActive() ? 'active' : 'suspended',
    };
  }
}