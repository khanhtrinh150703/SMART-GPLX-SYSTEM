import { User } from '@/domain/entities/user/user.entity';
import { UserStatus } from "@/domain/entities/user/user.status";
import { LoginResponseDTO } from '@/application/dtos/response/auth.dto';
import { UserResponseDTO } from '@/application/dtos/response/user.dto';
import { RoleCacheService } from '@/infrastructure/security/role-cache.service';
import { Role } from '@/domain/entities/role/role.entity';
import { Permission } from '@/domain/entities/permission/permission.entity';
import { UserWithRolesPayload } from '@/shared/types/user-payload.type';


export class UserMapper {
  /**
     * @description Chuyển dữ liệu từ Prisma sang Entity User.
     * @param {UserRawPrisma} raw - Dữ liệu thô từ câu lệnh query Prisma.
     * @returns {User} Thực thể User chuẩn DDD.
     */
  public static toDomain(raw: UserWithRolesPayload): User {
    // 1. Hydrate Roles từ Cache và ép về chuẩn Entity Role
    const roleEntities: Role[] = (raw.userRoles || []).map((ur) => {
      const cached = RoleCacheService.getRole(ur.roleId);

      // Nếu không có trong cache, hệ thống đang mất đồng bộ dữ liệu
      if (!cached) {
        throw new Error(`Critical: Role ${ur.roleId} missing in Cache.`);
      }

      // Tái tạo Permission Entities (Internal mapping)
      const permissionEntities: Permission[] = cached.permissions.map(pName =>
        Permission.reconstitute({ id: "N/A", name: pName, description: "" })
      );

      // Trả về Instance của Class Role
      return Role.reconstitute({
        id: cached.id,
        name: cached.name,
        description: cached.description,
        permissions: permissionEntities
      });
    });

    // 2. Reconstitute User với mảng Role chuẩn
    return User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName ?? "",
      passwordHash: raw.passwordHash,
      urlPicture: raw.urlPicture || null,
      status: raw.status as UserStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      roles: roleEntities, // Đã khớp kiểu Role[], không cần 'as any'
    });
  }

  /**
     * @description Trích xuất dữ liệu từ Entity User để chuẩn bị lưu vào Database.
     * @param {User} user - Entity từ tầng Domain.
     */
  public static toPersistence(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash ?? "",
      status: user.status,
      urlPicture: user.urlPicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * @description Chuyển đổi từ Domain Entity sang Response DTO để trả về cho Client.
   * @summary Đảm bảo không rò rỉ thông tin nhạy cảm (password, deletedAt) và xử lý linh hoạt các Role.
   */
  static toResponse(user: User): UserResponseDTO {

    const baseUrl = process.env.APP_URL;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName ?? "",
      urlPicture: user.urlPicture
        ? `${baseUrl}/${user.urlPicture.replace(/\\/g, '/')}`
        : "",
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      // Chỉ để lại roles, xóa dòng role (số ít) bị lỗi
      roles: user.roles.map(r => ({
        id: r.id,
        name: r.name,
        displayName: r.description
      })),
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