import { User } from '@/domain/entities/user/user.entity';
import { UserStatus } from "@/domain/entities/user/user.status";
import { ILoginResponseDTO } from '@/application/dtos/response/auth/auth.respone.dto';
import { UserResponseDTO } from '@/application/dtos/response/user/user.respone.dto';
import { Role } from '@/domain/entities/role/role.entity';
import { Prisma } from '@prisma/client';
import { IUserRecord } from '@/infrastructure/persistence/identity/user.record';
import { IUserProps } from '@/domain/entities/user/user.props';
import { ITokenResponse } from '@/application/dtos/response/auth/token/token.respone.dto';
export class UserMapper {

  /**
   * @description Chuyển đổi dữ liệu thô và danh sách Roles đã được chuẩn bị sẵn sang Domain Entity.
   * @param raw - Bản ghi thô từ DB
   * @param roles - Danh sách thực thể Role đã được lấy từ Cache/DB trước đó
   */
  public static toDomain(raw: IUserRecord, roles: Role[]): User {
    // 1. Định nghĩa Blueprint (IUserProps)
    const props: IUserProps = {
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName || "",
      passwordHash: raw.passwordHash,
      phoneNumber: raw.phoneNumber ?? "",
      urlPicture: raw.urlPicture || "",
      status: raw.status as UserStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt || undefined,
      roles: roles,
    };

    // 2. Truyền blueprint vào phương thức hồi sinh
    return User.reconstitute(props);
  }

  /**
     * @description Chuyển đổi thực thể người dùng sang định dạng lưu trữ của Prisma.
     * @param {User} user - Thực thể người dùng từ tầng Domain.
     * @returns {Prisma.UserCreateInput} Dữ liệu đầu vào cho tầng Database.
     */
  public static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber ?? "",
      passwordHash: user.passwordHash,
      status: user.status,
      urlPicture: user.urlPicture ?? "",
      createdAt: user.createdAt as Date,
      updatedAt: user.updatedAt as Date,
      deletedAt: user.deletedAt || undefined,
    };
  }

  /**
   * @description Chuyển đổi thực thể người dùng sang định dạng phản hồi (Response DTO).
   * @param {User} user - Thực thể người dùng từ tầng Domain.
   * @returns {UserResponseDTO} DTO chứa dữ liệu người dùng được chuẩn hóa cho Client.
   */
  public static toResponse(user: User): UserResponseDTO {
    const baseUrl = process.env.APP_URL || '';

    return {
      id: user.id as string,
      email: user.email,
      username: user.username,
      fullName: user.fullName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      urlPicture: user.getFullPictureUrl(baseUrl),
      status: user.status,
      createdAt: user.createdAt as Date,
      updatedAt: user.updatedAt as Date,
      roles: user.roles.map(r => ({
        id: r.id,
        name: r.name,
        displayName: r.description
      })),
      permissions: user.getAllPermissionNames(),
    };
  }

  /**
   * @description Chuyển đổi dữ liệu người dùng và Token sang định dạng phản hồi đăng nhập.
   * @param {User} user - Thực thể người dùng từ tầng Domain.
   * @param {ITokenResponse} tokens - Cặp mã xác thực (Access & Refresh Token).
   * @returns {ILoginResponseDTO} DTO phản hồi đăng nhập hoàn chỉnh.
   */
  public static toLoginResponse(user: User, tokens: ITokenResponse): ILoginResponseDTO {
    return {
      user: this.toResponse(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}