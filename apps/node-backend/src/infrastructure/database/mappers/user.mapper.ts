import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from '../../../domain/entities/User';
import { UserStatus } from "../../../domain/constants/userStatus";
import { UserResponseDTO } from '@/application/dtos/respone/user.dto';

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    // Mapper là nơi lý tưởng để xử lý các vấn đề về kiểu dữ liệu 
    // Ví dụ: mapping Enum của Prisma sang Enum của Domain, 
    // hoặc xử lý null/undefined để đảm bảo Domain Entity luôn "sạch".

    return User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName ?? "",
      status: raw.status as UserStatus, // Ép kiểu nếu cần
      urlPicture: raw.urlPicture,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      passwordHash: raw.passwordHash
    });
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    if (!(user instanceof User)) {
      user = User.reconstitute(user);
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.displayName,
      status: user.isActive() ? 'active' : 'suspended',
      urlPicture: user.urlPicture,
      deletedAt: null,
      passwordHash: user.passwordHash!,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.displayName,
      urlPicture: user.urlPicture,
      status: user.isActive() ? 'active' : 'suspended',
      createdAt: user.createdAt,
    };
  }
}