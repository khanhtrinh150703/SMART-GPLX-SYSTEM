import { User } from '@/domain/entities/user/user.entity';
import { UserStatus } from "@/domain/entities/user/user.status";
import { LoginResponseDTO } from '@/application/dtos/response/auth.dto';
import { UserResponseDTO } from '@/application/dtos/response/user.dto';
import { RoleMapper, RoleWithPermissionsPayload } from './role.mapper';
import { UserWithRolesPayload } from '@/shared/types/user-payload.type';


export class UserMapper {
  /**
     * @description Chuyển dữ liệu từ Prisma sang Entity User.
     * @param {UserRawPrisma} raw - Dữ liệu thô từ câu lệnh query Prisma.
     * @returns {User} Thực thể User chuẩn DDD.
     */
  public static toDomain(raw: UserWithRolesPayload): User {
    // 1. Chuyển đổi từ cấu trúc bảng trung gian (userRoles) sang mảng Entity Role
    const roleEntities = (raw.userRoles || []).map((ur) =>
      RoleMapper.toDomain(ur.role as RoleWithPermissionsPayload)
    );

    // 2. Tái tạo User Entity thông qua Factory Method chuẩn
    return User.reconstitute({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName ?? "",
      passwordHash: raw.passwordHash,
      urlPicture: raw.urlPicture,
      status: raw.status as UserStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      roles: roleEntities, // Truyền đúng mảng Entity Role[]
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
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName ?? "",
      urlPicture: user.urlPicture ?? "",
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