import { User } from '@/domain/entities/user/user.entity';
import { UserStatus } from "@/domain/entities/user/user.status";
import { LoginResponseDTO } from '@/application/dtos/respone/auth.dto';
import { UserResponseDTO } from '@/application/dtos/respone/user.dto';

/**
 * Interface mô tả cấu trúc dữ liệu thô trong bảng 'users' của MySQL.
 * Giúp loại bỏ hoàn toàn 'any' khi mapping.
 */
export interface IUserPersistence {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  passwordHash: string;
  status: string;
  urlPicture: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class UserMapper {
  /**
   * Tác dụng: Chuyển dữ liệu thô từ Database thành Entity User.
   * @param {IUserPersistence} raw - Dữ liệu thô từ MySQL.
   */
  static toDomain(raw: IUserPersistence): User {
    return User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName ?? "",
      passwordHash: raw.passwordHash,
      urlPicture: raw.urlPicture ,
      status: raw.status as UserStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ,
    });
  }

  /**
   * Tác dụng: Chuyển Entity User thành object để lưu vào MySQL.
   * @param {User} user - Entity từ tầng Domain.
   */
  static toPersistence(user: User): IUserPersistence {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName, 
      passwordHash: user.passwordHash ?? "",
      status: user.status,
      urlPicture: user.urlPicture ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? null,
    };
  }

  /**
   * Tác dụng: Trả về thông tin User cơ bản cho Client.
   */
  static toResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName ?? "",
      urlPicture: user.urlPicture ?? "",
      role: "USER",
      status: user.status,
    };
  }

  /**
   * Tác dụng: Ánh xạ dữ liệu cho phản hồi đăng nhập thành công.
   */
  static toLoginResponse(
    user: User,
    accessToken: string,
    refreshToken: string
  ): LoginResponseDTO {
    return {
      user: this.toResponse(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}