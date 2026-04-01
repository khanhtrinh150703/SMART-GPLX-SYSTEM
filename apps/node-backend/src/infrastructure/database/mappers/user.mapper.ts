import { User } from '@/domain/entities/user/user.entity';
import { UserStatus } from "@/domain/entities/user/user.status";
import { LoginResponseDTO } from '@/application/dtos/response/auth.dto';
import { UserResponseDTO } from '@/application/dtos/response/user.dto';
import { RoleCacheService } from '@/infrastructure/security/role-cache.service';
import { Role } from '@/domain/entities/role/role.entity';
import { Permission } from '@/domain/entities/permission/permission.entity';
import { UserWithRolesPayload } from '@/shared/types/user-payload.type';
import { AppError, ErrorCode } from '@/shared/errors';

export class UserMapper {
  /**
   * @description Chuyển dữ liệu từ Prisma sang Entity User.
   */
  public static toDomain(raw: UserWithRolesPayload): User {
    // 1. Hydrate Roles từ Cache
    const roleEntities: Role[] = (raw.userRoles || []).map((ur) => {
      const cached = RoleCacheService.getRole(ur.roleId);

      if (!cached) {
        throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);
      }

      const permissionEntities: Permission[] = cached.permissions.map(pName =>
        Permission.reconstitute({ id: "N/A", name: pName, description: "" })
      );

      return Role.reconstitute({
        id: cached.id,
        name: cached.name,
        description: cached.description,
        permissions: permissionEntities
      });
    });

    // 2. Tái tạo User chuẩn DDD
    // Lưu ý: Chuyển "" thành null nếu Entity yêu cầu string | null
    return User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName || null,
      passwordHash: raw.passwordHash ,
      phoneNumber: raw.phoneNumber ?? "",
      urlPicture: raw.urlPicture || null,
      status: raw.status as UserStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt || null,
      roles: roleEntities,
    });
  }

  /**
   * @description Trích xuất dữ liệu từ Entity để lưu vào DB (Prisma).
   */
  public static toPersistence(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber ?? "",
      passwordHash: user.passwordHash,
      status: user.status,
      urlPicture: user.urlPicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * @description Chuyển đổi sang Response DTO trả về Client.
   */
  public static toResponse(user: User): UserResponseDTO {
    const baseUrl = process.env.APP_URL || '';

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      urlPicture: user.urlPicture
        ? `${baseUrl}/${user.urlPicture.replace(/\\/g, '/')}`
        : "",
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map(r => ({
        id: r.id,
        name: r.name,
        displayName: r.description
      })),
    };
  }

  /**
   * @description Ánh xạ dữ liệu cho phản hồi đăng nhập.
   */
  public static toLoginResponse(
    user: User,
    accessToken: string,
    refreshToken: string
  ): LoginResponseDTO {
    return {
      user: this.toResponse(user),
      accessToken,
      refreshToken,
    };
  }
}