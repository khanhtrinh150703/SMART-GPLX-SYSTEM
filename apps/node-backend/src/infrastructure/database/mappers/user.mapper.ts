import { User } from '@/domain/entities/user/user.entity';
import { UserStatus } from "@/domain/entities/user/user.status";
import { LoginResponseDTO } from '@/application/dtos/response/auth/auth.respone.dto';
import { UserResponseDTO } from '@/application/dtos/response/user/user.respone.dto';
import { RoleCacheService } from '@/infrastructure/security/role-cache.service';
import { Role } from '@/domain/entities/role/role.entity';
import { Permission } from '@/domain/entities/permission/permission.entity';
import { AppError, ErrorCode } from '@/shared/errors';
import { Prisma } from '@prisma/client';
import { IUserRecord } from '@/infrastructure/persistence/user.record';


export class UserMapper {
  /**
   * @description Chuyển dữ liệu từ bản ghi Database (Persistence) sang Domain Entity.
   */
  public static toDomain(raw: IUserRecord): User {
    // 1. Hydrate Roles từ Cache dựa trên dữ liệu từ DB
    const roleEntities: Role[] = (raw.userRoles || []).map((ur) => {
      const cached = RoleCacheService.getRole(ur.roleId);

      if (!cached) {
        throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);
      }

      // Tái tạo Permission từ danh sách tên quyền trong Cache
      const permissionEntities: Permission[] = cached.permissions.map(pName =>
        Permission.reconstitute({ 
          id: "N/A", // Permission trong cache thường chỉ lưu name để nhẹ
          name: pName, 
          description: null 
        })
      );

      // Tái tạo Role Entity bằng props chuẩn
      return Role.reconstitute({
        id: cached.id,
        name: cached.name,
        description: cached.description,
        permissions: permissionEntities
      });
    });

    // 2. Tái tạo User Entity theo cấu trúc _props
    return User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName, // Mapping snake_case -> camelCase
      passwordHash: raw.passwordHash,
      phoneNumber: raw.phoneNumber ?? "",
      urlPicture: raw.urlPicture,
      status: raw.status as UserStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      roles: roleEntities,
    });
  }

  /**
   * @description Ánh xạ từ Domain Entity sang Persistence Model (Prisma).
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
      deletedAt: user.deletedAt,
    };
  }

  /**
   * @description Chuyển đổi sang Response DTO trả về Client.
   */
  public static toResponse(user: User): UserResponseDTO {
    const baseUrl = process.env.APP_URL || '';

    return {
      id: user.id as string,
      email: user.email,
      username: user.username,
      fullName: user.fullName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      urlPicture: user.urlPicture
        ? `${baseUrl}/${user.urlPicture.replace(/\\/g, '/')}`
        : "",
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